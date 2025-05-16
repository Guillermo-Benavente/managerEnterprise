import { BrowserWindow, dialog } from 'electron';
import { SaveFile } from '../fileWriter';
import server from '../server';
import ipc from '../ipc';
import IpcChannel from 'Types/handler/IpcChannel';
import IpcMain from 'Types/handler/IpcMain';
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const ipcM = ipc as IpcMain;

export default class ControlHandler {
    constructor(private mainWindow: BrowserWindow) {}
    public register() {
        const serverURL = 'http://localhost:3000';

        ipcM.handle(IpcChannel.GET_SERVER, () => server.getServer());

        ipcM.on(IpcChannel.NAVIGATE, (page, attr) => {
            let url = `${serverURL}/${page}/index.html`;
            if (attr && typeof attr === 'object') url += `?${new URLSearchParams(attr).toString()}`;
            this.mainWindow.loadURL(url);
        });

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

            let url = `${serverURL}/${page}/index.html`;
            if (attr && typeof attr === 'object') url += `?${new URLSearchParams(attr).toString()}`;
            modal.loadURL(url);

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

            modal.on('closed', () => { modal = null!; });
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
}