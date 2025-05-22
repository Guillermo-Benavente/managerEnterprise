import { BrowserWindow, dialog } from 'electron';
import { SaveFile } from '../fileWriter';
import server from '../server';
import ipc from '../ipc';
import IpcChannel from 'Types/handler/IpcChannel';
import IpcMain from 'Types/handler/IpcMain';
import EntryPointsType from 'Types/entryPoints';
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const FORM_WEBPACK_ENTRY: string;
declare const FORM_DOCUMENT_WEBPACK_ENTRY: string;
declare const EMPLOYEES_WEBPACK_ENTRY: string;
declare const EDIT_EMPLOYEE_WEBPACK_ENTRY: string;
declare const COURSES_WEBPACK_ENTRY: string;
declare const VIEW_COURSE_WEBPACK_ENTRY: string;
declare const COMPANIES_WEBPACK_ENTRY: string;
declare const EDIT_COMPANY_WEBPACK_ENTRY: string;
declare const DOCUMENTS_WEBPACK_ENTRY: string;
declare const EDIT_DOCUMENT_WEBPACK_ENTRY: string;

const ipcM = ipc as IpcMain;

export default class ControlHandler {
    constructor(
        private mainWindow: BrowserWindow,
        private entryMap = {
            [EntryPointsType.MAIN]: MAIN_WINDOW_WEBPACK_ENTRY,
            [EntryPointsType.FORM]: FORM_WEBPACK_ENTRY,
            [EntryPointsType.FORM_DOCUMENT]: FORM_DOCUMENT_WEBPACK_ENTRY,
            [EntryPointsType.EMPLOYEES]: EMPLOYEES_WEBPACK_ENTRY,
            [EntryPointsType.EDIT_EMPLOYEE]: EDIT_EMPLOYEE_WEBPACK_ENTRY,
            [EntryPointsType.COURSES]: COURSES_WEBPACK_ENTRY,
            [EntryPointsType.VIEW_COURSE]: VIEW_COURSE_WEBPACK_ENTRY,
            [EntryPointsType.COMPANIES]: COMPANIES_WEBPACK_ENTRY,
            [EntryPointsType.EDIT_COMPANY]: EDIT_COMPANY_WEBPACK_ENTRY,
            [EntryPointsType.DOCUMENTS]: DOCUMENTS_WEBPACK_ENTRY,
            [EntryPointsType.EDIT_DOCUMENT]: EDIT_DOCUMENT_WEBPACK_ENTRY,
        }
    ) {}
    public register() {
        ipcM.handle(IpcChannel.GET_SERVER, () => server.getServer());

        ipcM.on(IpcChannel.NAVIGATE, (page, attr) => this.navigate(this.mainWindow, page, attr));

        ipcM.on(IpcChannel.MODAL, (page, attr) => {
            const parent = BrowserWindow.getFocusedWindow() || this.mainWindow;
            let modal = new BrowserWindow({
                width: 800,
                height: 600,
                parent,
                modal: true,
                show: false,
                resizable: false,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
                }
            });

            this.navigate(modal, page, attr);

            modal.once('ready-to-show', () => {
                modal.webContents.executeJavaScript(`
                    new Promise(resolve => {
                        const body = document.body;
                        resolve({ width: body.scrollWidth, height: body.scrollHeight });
                    });
                `).then(size => {
                    const w = Math.min(size.width + 85, 800);
                    const h = Math.min(size.height + 85, 600);
                    const screen = require('electron').screen.getPrimaryDisplay().workAreaSize;
                    modal.setBounds({ x: (screen.width - w) / 2, y: (screen.height - h) / 2, width: w, height: h });
                });

                modal.show();
            });

            ipcM.on(IpcChannel.MODAL_SEND, (data) => {
                parent.webContents.send(IpcChannel.MODAL_RESPONSE, data);
            });

            modal.on('closed', () => { parent.webContents.send(IpcChannel.MODAL_RESPONSE, null); });
        });

        ipcM.on(IpcChannel.DIALOG, (type, title, message) => {
            const options = {
                question: { buttons: ['Yes', 'No', 'Cancel'], defaultId: 1 },
                warning: { buttons: ['OK', 'Cancel'], defaultId: 0 },
                error: { buttons: ['Close'], defaultId: 0 },
                info: { buttons: ['OK', 'Más información'], defaultId: 0 }
            };

            const { buttons, defaultId } = options[type as keyof typeof options] || { buttons: ['OK'], defaultId: 0 };

            const response = dialog.showMessageBoxSync(this.mainWindow, {
                type, title, message, buttons, defaultId
            });

            this.mainWindow.webContents.send(IpcChannel.DIALOG_RESPONSE, buttons[response]);
        });

        ipcM.handle(IpcChannel.DIALOG_SAVE, async (options) => {
            const win = BrowserWindow.getFocusedWindow();
            const { canceled, filePath } = await dialog.showSaveDialog(win!, options);
            return canceled ? null : filePath;
        });

        ipcM.handle(IpcChannel.DIALOG_OPEN, async (options) => {
            const win = BrowserWindow.getFocusedWindow();
            const { canceled, filePaths } = await dialog.showOpenDialog(win!, options);
            return canceled || !filePaths.length ? null : filePaths[0];
        });

        ipcM.handle(IpcChannel.FILE_SAVE, async (path: string, base64: string) => {
            await SaveFile(path, base64);
            return { success: true };
        });
        
        console.log('Handlers de Path cargados');
    }

    private navigate(
        browserWindow: BrowserWindow, 
        page: keyof typeof this.entryMap, 
        attr: Record<string, string | number | boolean> | null
    ): void {
        const url = this.entryMap[page];

        if (url) {
            if(attr) browserWindow.loadURL(`${url}?${this.toSearchParams(attr).toString()}`);
            else browserWindow.loadURL(url);
        } else console.error(`Página no reconocida: ${page}`);
    }

    private toSearchParams(obj: Record<string, string | number | boolean>): URLSearchParams {
        const result: Record<string, string> = {};
        for (const key in obj) result[key] = String(obj[key]);
        return new URLSearchParams(result);
    }
}