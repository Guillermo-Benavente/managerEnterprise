import { app, ipcMain, BrowserWindow, dialog } from 'electron';
import { join } from 'path';
import { promises as fspromise } from 'fs';
import { SaveFile } from './fileWriter';
import server from './server';
import util from './util';
import Employee from './database/tables/employee/Employee';
import Company from './database/tables/company/Company';
import Course from './database/tables/course/Course';
import Document from './database/tables/document/Document';
import EmployeeByDocument from './database/tables/employeeByDocument/EmployeeByDocument';
import IpcChannel from 'Types/handler/IpcChannel';
import TableName from 'Types/handler/TableName';

const { rm } = fspromise;

function newHandler(channel, fn) {
  ipcMain.handle(channel, async (_, ...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      console.error(`Error en ${channel}:`, err);
      return { success: false, error: err.message };
    }
  });
}

function allHandlers(prefix, db,  Class, custom = {}) {
  const table = db.tables[prefix];

  // GET ALL
  newHandler(`${IpcChannel.GETALL}-${prefix}`, custom.getAll ?? (async (...args) => {
    const all = await table.getAll(...args);
    return all.map(item => new Class(item).toFrontend());
  }));

  // GET ONE
  newHandler(`${IpcChannel.GETONE}-${prefix}`, custom.getOne ?? (async key => {
    const one = await table.getOne(key);
    return new Class(one).toFrontend();
  }));

  // INSERT
  newHandler(`${IpcChannel.INSERT}-${prefix}`, custom.insert ?? (async view => {
    const data = Class.fromView(view).toData();
    await table.insert(data);
    return { success: true };
  }));

  // UPDATE
  newHandler(`${IpcChannel.UPDATE}-${prefix}`, custom.update ?? (async view => {
    const data = Class.fromView(view).toData();
    await table.update(data);
    return { success: true };
  }));

  // DELETE
  newHandler(`${IpcChannel.DELETE}-${prefix}`, custom.delete ?? (async key => {
    await table.delete(key);
    return { success: true };
  }));
}

function AddDatabaseHandlers(db) {
    allHandlers(TableName.EMPLOYEE, db,  Employee);
    allHandlers(TableName.COMPANY, db, Company);
    allHandlers(TableName.COURSE, db, Course, {
        insert: async (dni, courses) => {
            const formatCourses = await Promise.allSettled(
                courses.map(async (course, index) => {
                    course.id       = dni + Date.now() + index;
                    course.employee = dni;
                    course.url      = join(app.getPath('userData'),'courses',dni,`${course.id}.pdf`);
                    await SaveFile(course.url, course.data);
                    return Course.fromView(course).toData();
                })
            );
            const goodResults = formatCourses.filter(r => r.status==='fulfilled').map(r => r.value);
            return await db.tables.course.insert(goodResults);
        }
    });
    allHandlers(TableName.DOCUMENT, db, Document, {
        insert: async (nif, documents) => {
            const formatDocuments = await Promise.allSettled(
                documents.map(async (document, index) => {
                    document.id      = nif + Date.now() + index;
                    document.company = nif;
                    document.url     = join(app.getPath('userData'), 'documents', nif, `${document.id}.pdf`);
                    await SaveFile(document.url, document.buffer);
                    return Document.fromView(document).toData();
                })
            );
            const goodResults = formatDocuments.filter(r => r.status === 'fulfilled').map(r => r.value);
            return await db.tables.document.insert(goodResults);
        },
        update: async document => {
            if (document.company && document.buffer) {
                await rm(document.url);
                await SaveFile(document.url, document.buffer);
            }
            await db.tables.document.update(Document.fromView(document).toData());
            return { success: true };
        }
    });
    allHandlers(TableName.EMPLOYEEBYDOCUMENT, db, EmployeeByDocument, {
        insert: async (employee, document, date) => {
            const id = employee + Date.now();
            const ebd = EmployeeByDocument.fromView({id, employee, document, date}).toData();
            return await db.tables.employeeByDocument.insert(ebd);
        }
    });

    console.log('Cargado los handlers de Database correctamente.');
}

function AddUtilHandlers() {
    newHandler(IpcChannel.SVG_MODIFY, async (url, color) => await util.ModifySvgColor(url, color));

    console.log('Cargado los handlers de Util correctamente.');
}

function AddPathHandlers(mainWindow) {
    const serverURL = 'http://localhost:3000';

    newHandler(IpcChannel.GET_SERVER, () => server.getServer());

    ipcMain.on(IpcChannel.NAVIGATE, async (_, page, attr) => {
        let filePath = '';
        if (page != '') filePath = `${serverURL}/${page}/index.html`;
        if (attr && typeof attr === 'object')
            filePath += `?${new URLSearchParams(attr).toString()}`;
        if (filePath != '') mainWindow.loadURL(filePath);
    });

    ipcMain.on(IpcChannel.MODAL, async (_, page, attr) => {
        let filePath = '';

        const parentWindow = BrowserWindow.getFocusedWindow() || mainWindow;

        let modal = new BrowserWindow({
            width: 800,
            height: 600,
            parent: parentWindow,
            modal: true,
            show: false,
            resizable: false,
            webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            }
        });

        if (page != '') filePath = `${serverURL}/${page}/index.html`;
        if (attr && typeof attr === 'object')
            filePath += `?${new URLSearchParams(attr).toString()}`;
        if (filePath != '') modal.loadURL(filePath);
        
        modal.once('ready-to-show', () => {
            modal.webContents.executeJavaScript(`
                new Promise(resolve => {
                    const body = document.body;
                    const width = body.scrollWidth;
                    const height = body.scrollHeight;
                    resolve({ width, height });
                });
            `).then(size => {
                const newWidth = Math.min(size.width + 85, 800);
                const newHeight = Math.min(size.height + 85, 600);
                const { width: screenWidth, height: screenHeight } = require('electron').screen.getPrimaryDisplay().workAreaSize;
                const newX = Math.round((screenWidth - newWidth) / 2);
                const newY = Math.round((screenHeight - newHeight) / 2);
                modal.setBounds({ x: Math.round(newX), y: Math.round(newY), width: newWidth, height: newHeight });
            });

            modal.show();
        });
        ipcMain.on(IpcChannel.MODAL_SEND, (_, data) => {
            parentWindow.webContents.send(IpcChannel.MODAL_RESPONSE, data);
        });

        modal.on('closed', () => { modal = null; });
    });

    ipcMain.on(IpcChannel.DIALOG, async (_, type, title, message) => {
        const options = {
            question: { buttons: ['Yes', 'No', 'Cancel'], defaultId: 1 },
            warning: { buttons: ['OK', 'Cancel'], defaultId: 0 },
            error: { buttons: ['Close'], defaultId: 0 },
            info: { buttons: ['OK', 'Más información'], defaultId: 0 }
        };

        const { buttons, defaultId } = options[type] || { buttons: ['OK'], defaultId: 0 };

        const response = dialog.showMessageBoxSync(mainWindow, {
            type: type,
            title: title,
            message: message,
            buttons: buttons,
            defaultId: defaultId,
            modal: true
        });

        mainWindow.webContents.send(IpcChannel.DIALOG_RESPONSE, buttons[response]);
    });

    newHandler(IpcChannel.DIALOG_SAVE, async (event, options) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        const { canceled, filePath } = await dialog.showSaveDialog(win, options);
        return canceled ? null : filePath;
    });

    newHandler(IpcChannel.DIALOG_OPEN, async (event, options) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        const { canceled, filePaths } = await dialog.showOpenDialog(win, options);
        return canceled || filePaths.length === 0 ? null : filePaths[0];
    });

    newHandler(IpcChannel.FILE_SAVE, async (filePath, base64Data) => {
        await SaveFile(filePath, base64Data);
        return { success: true };
    });
}

const handler = {
  AddDatabaseHandlers,
  AddUtilHandlers,
  AddPathHandlers,
};

export default handler;