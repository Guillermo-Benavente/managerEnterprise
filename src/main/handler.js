import { app, ipcMain, BrowserWindow, dialog } from 'electron';
import server from './server';
import util from './util';
import { SaveFile } from './fileWriter';
import { join } from 'path';
import Employee from './database/tables/employee/Employee';
import Company from './database/tables/company/Company';
import Course from './database/tables/course/Course';
import Document from './database/tables/document/Document';
import EmployeeByDocument from './database/tables/employeeByDocument/EmployeeByDocument';
import { promises as fspromise } from 'fs';
const { rm } = fspromise;

function AddDatabaseHandlers(db) {
    /// TABLE METHODS EMPLOYED ///

    ipcMain.handle('get-employees', async () => {
        try { 
            const employees = await db.tables.employee.getAll();
            return  employees.map(e => new Employee(e).toFrontend());
        }
        catch (err) { 
            console.error('Error al intentar obtener los empleados:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('get-employee', async (_, dni) => {
        try { 
            const employee = await db.tables.employee.getOne(dni);
            return new Employee(employee).toFrontend();
        }
        catch (err) { 
            console.error('Error al intentar obtener al empleado:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('insert-employee', async (_, employee) => {
        try {
            await db.tables.employee.insert(Employee.fromView(employee).toData());
            return { success: true };
        } catch (err) {
            console.error('Error al intentar insertar el empleado:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('update-employee', async (_, employee) => {
        try {
            await db.tables.employee.update(Employee.fromView(employee).toData());
            return { success: true };
        } catch (err) {
            console.error('Error al intentar actualizar el empleado:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('delete-employee', async (_, dni) => {
        try {
            await db.tables.employee.delete(dni);
            return { success: true };
        } catch (err) {
            console.error('Error al intentar borrar el empleado:', err);
            return { success: false, error: err.message };
        }
    });

    /// TABLE METHODS COMPANY ///
    
    ipcMain.handle('get-companies', async () => {
        try { 
            const companies = await db.tables.company.getAll(); 
            return companies.map(c => new Company(c).toFrontend());
        } 
        catch (err) { 
            console.error('Error al intentar obtener las empresas:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('get-company', async (_, nif) => {
        try { 
            const company = await db.tables.company.getOne(nif); 
            return new Company(company).toFrontend();
        } 
        catch (err) { 
            console.error('Error al intentar obtener al empleado:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('insert-company', async (_, company) => {
        try {
            await db.tables.company.insert(Company.fromView(company).toData());
            return { success: true };
        } catch (err) {
            console.error('Error al intentar insertar la empresa:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('update-company', async (_, company) => {
        try {
            await db.tables.company.update(Company.fromView(company).toData());
            return { success: true };
        } catch (err) {
            console.error('Error al intentar actualizar la empresa:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('delete-company', async (_, nif) => {
        try {
            await db.tables.company.delete(nif);
            return { success: true };
        } catch (err) {
            console.error('Error al intentar borrar la empresa:', err);
            return { success: false, error: err.message };
        }
    });

    /// TABLE METHODS COURSES ///

    ipcMain.handle('get-courses', async (_, dni) => {
        try { 
            const courses = await db.tables.course.getAll(dni);
            return courses.map(c => new Course(c).toFrontend());
        } 
        catch (err) { 
            console.error('Error al intentar obtener los cursos:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('get-course', async (_, id) => {
        try { 
            const course = await db.tables.course.getOne(id);
            return new Course(course).toFrontend();
        } 
        catch (err) { 
            console.error('Error al intentar obtener los cursos:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('insert-courses', async (_, dni, courses) => {
        try {
            const formatCourses = await Promise.all(
                courses.map(async (course, index) => {
                    try {
                        course.id = dni + Date.now() + index;
                        course.employee = dni;
                        course.url = join(app.getPath('userData'), 'courses', dni, `${course.id}.pdf`);
                        await SaveFile(course.url, course.data);
                        const formatCourse = Course.fromView(course).toData();
                        return formatCourse;
                    } catch (error) {
                        console.error(`Error al procesar curso:`, error);
                    }
                })
            );
            return await db.tables.course.insert(formatCourses);
        } catch (err) {
            console.error('Error al intentar insertar los cursos:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('delete-course', async (_, id) => {
        try {
            return await db.tables.course.delete(id);
        } catch (err) {
            console.error('Error al intentar eliminar el curso:', err);
            return { success: false, error: err.message };
        }
    });

    /// TABLE METHODS DOCUMENTS ///

    ipcMain.handle('get-documets', async (_, nif) => {
        try { 
            const document = await db.tables.document.getAll(nif);
            return document.map(d => new Document(d).toFrontend());
        } 
        catch (err) { 
            console.error('Error al intentar obtener los documentos:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('get-documet', async (_, id) => {
        try { 
            const document = await db.tables.document.getOne(id); 
            return new Document(document).toFrontend();
        } 
        catch (err) { 
            console.error('Error al intentar obtener el documento:', err);
            return { success: false, error: err.message };
        }
    });


    ipcMain.handle('insert-documents', async (_, nif, documents) => {
        try {
            const formatDocuments = await Promise.all(
                documents.map(async (document, index) => {
                    try {
                        document.id = nif + Date.now() + index;
                        document.company = nif;
                        document.url = join(app.getPath('userData'), 'documents', nif, `${document.id}.pdf`);
                        await SaveFile(document.url, document.buffer);
                        const formatDocument = Document.fromView(document).toData();
                        return formatDocument;
                    } catch (error) {
                        console.error(`Error al procesar el documento:`, error);
                    }
                })
            );
            return await db.tables.document.insert(formatDocuments);
        } catch (err) {
            console.error('Error al intentar insertar los docmuentos:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('update-document', async (_, document) => {
        try {
            if (document.company && document.buffer) {
                await rm(document.url);
                await SaveFile(document.url, document.buffer);
            }
            await db.tables.document.update(Document.fromView(document).toData());
            return { success: true };
        } catch (err) {
            console.error('Error al intentar actualizar el documento:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('delete-document', async (_, id) => {
        try {
            await db.tables.document.delete(id);
            return { success: true };
        } catch (err) {
            console.error('Error al intentar borrar el documento:', err);
            return { success: false, error: err.message };
        }
    });

    /// TABLE METHODS EMPLOYEEBYDOCUMENT///

    ipcMain.handle('get-employees-document', async (_, idDoc) => {
        try { 
            const employeesByDocument = await db.tables.employeeByDocument.getAll(idDoc);
            return employeesByDocument.map(ebd => new EmployeeByDocument(ebd).toFrontend());
        }
        catch (err) { 
            console.error('Error al intentar obtener los empleados del documento:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('get-employee-document', async (_, id) => {
        try { 
            const employeeByDocument = await db.tables.employeeByDocument.getOne(id);
            return new EmployeeByDocument(employeeByDocument).toFrontend();
        }
        catch (err) { 
            console.error('Error al intentar obtener el empleado del documento:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('insert-employee-document', async (_, employee, document, date) => {
        try {
            const id = employee + Date.now();
            const ebd = EmployeeByDocument.fromView({id, employee, document, date}).toData();
            return await db.tables.employeeByDocument.insert(ebd);
        } catch (err) {
            console.error('Error al intentar crear la referencia entre empleado y documento:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('update-employee-document', async (_, employeeByDocument) => {
        try {
            await db.tables.employeeByDocument.update(EmployeeByDocument.fromView(employeeByDocument).toData());
            return { success: true };
        } catch (err) {
            console.error('Error al intentar actualizar la referencia entre empleado y documento:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('delete-employee-document', async (_, id) => {
        try {
            await db.tables.employeeByDocument.delete(id);
            return { success: true };
        } catch (err) {
            console.error('Error al intentar borrar el empleado del documento:', err);
            return { success: false, error: err.message };
        }
    });

    console.log('Cargado los handlers de Database correctamente.');
}

function AddUtilHandlers() {
    ipcMain.handle('modify-svg', async (_, url, color) => {
        try {
            return await util.ModifySvgColor(url, color);
        } catch (error) {
            console.error('Error al modificar el SVG:', error);
            return { success: false, error: error.message };
        }
    });

    console.log('Cargado los handlers de Util correctamente.');
}

function AddPathHandlers(mainWindow) {
    const serverURL = 'http://localhost:3000';

    ipcMain.handle('get-server', () => server.getServer());

    ipcMain.on('navigate', async (_, page, attr) => {
        let filePath = '';
        if (page != '') filePath = `${serverURL}/${page}/index.html`;
        if (attr && typeof attr === 'object')
            filePath += `?${new URLSearchParams(attr).toString()}`;
        if (filePath != '') mainWindow.loadURL(filePath);
    });

    ipcMain.on('modal-window', async (_, page, attr) => {
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
        ipcMain.on('modal-send', (_, data) => {
            parentWindow.webContents.send('modal-response', data);
        });

        modal.on('closed', () => { modal = null; });
    });

    ipcMain.on('dialog-window', async (_, type, title, message) => {
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

        mainWindow.webContents.send('dialog-response', buttons[response]);
    });

    ipcMain.handle('save-dialog', async (event, options) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        const { canceled, filePath } = await dialog.showSaveDialog(win, options);
        return canceled ? null : filePath;
    });

    ipcMain.handle('open-dialog', async (event, options) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        const { canceled, filePaths } = await dialog.showOpenDialog(win, options);
        return canceled || filePaths.length === 0 ? null : filePaths[0];
    });

    ipcMain.handle('save-file', async (_, filePath, base64Data) => {
        try {
            await SaveFile(filePath, base64Data);
            return { success: true };
        } catch (error) {
            console.error('Error al modificar el SVG:', error);
            return { success: false, error: error.message };
        }
    });
}

const handler = {
  AddDatabaseHandlers,
  AddUtilHandlers,
  AddPathHandlers,
};

export default handler;