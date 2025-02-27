import { ipcMain } from 'electron';
import util from './util';

function AddDatabaseHandlers(db) {
    /// TABLE METHODS EMPLOYED ///

    ipcMain.handle('get-employees', async () => {
        try { return await db.GetEmployees(); } 
        catch (err) { 
            console.error('Error al intentar obtener los empleados:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('get-employee', async (_, dni) => {
        try { return await db.GetEmployee(dni); } 
        catch (err) { 
            console.error('Error al intentar obtener al empleado:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('insert-employee', async (_, employee) => {
        try {
            await db.InsertEmployee(
                employee.dni, 
                employee.name, 
                employee.first_surname, 
                employee.second_surname, 
                employee.discharge_date, 
                employee.courses
            );
            return { success: true };
        } catch (err) {
            console.error('Error al intentar insertar el empleado:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('update-employee', async (_, employee) => {
        try {
            await db.UpdateEmployee(
                employee.dni,
                employee.name, 
                employee.first_surname, 
                employee.second_surname, 
                employee.discharge_date,
                employee.leave_date,
                employee.medical_leave_date,
                employee.medical_discharge_date,
                employee.courses
            );
            return { success: true };
        } catch (err) {
            console.error('Error al intentar actualizar el empleado:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('delete-employee', async (_, dni) => {
        try {
            await db.DeleteEmployee(dni);
            return { success: true };
        } catch (err) {
            console.error('Error al intentar borrar el empleado:', err);
            return { success: false, error: err.message };
        }
    });

    /// TABLE METHODS COMPANY ///
    
    ipcMain.handle('get-companies', async () => {
        try { return await db.GetCompanies(); } 
        catch (err) { 
            console.error('Error al intentar obtener las empresas:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('get-company', async (_, nif) => {
        try { return await db.GetCompany(nif); } 
        catch (err) { 
            console.error('Error al intentar obtener al empleado:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('insert-company', async (_, company) => {
        try {
            await db.InsertCompany(
                company.nif, 
                company.name, 
                company.telephone, 
                company.registration_date
            );
            return { success: true };
        } catch (err) {
            console.error('Error al intentar insertar la empresa:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('update-company', async (_, company) => {
        try {
            await db.UpdateCompany(
                company.nif, 
                company.name, 
                company.telephone, 
                company.registration_date
            );
            return { success: true };
        } catch (err) {
            console.error('Error al intentar actualizar la empresa:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('delete-company', async (_, nif) => {
        try {
            await db.DeleteCompany(nif);
            return { success: true };
        } catch (err) {
            console.error('Error al intentar borrar la empresa:', err);
            return { success: false, error: err.message };
        }
    });

    /// TABLE METHODS COURSES ///

    ipcMain.handle('get-courses', async (_, dni) => {
        try { return await db.GetCourses(dni); } 
        catch (err) { 
            console.error('Error al intentar obtener los cursos:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('insert-courses', async (_, dni, courses) => {
        try {
            return await db.InsertCourses(
                dni, 
                courses
            );
        } catch (err) {
            console.error('Error al intentar insertar los cusrsos:', err);
            return { success: false, error: err.message };
        }
    });

    /// TABLE METHODS DOCUMENTS ///

    ipcMain.handle('get-documets', async (_, nif) => {
        try { return await db.GetDocuments(nif); } 
        catch (err) { 
            console.error('Error al intentar obtener los documentos:', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('insert-documents', async (_, nif, documents) => {
        try {
            return await db.InsertDocuments(
                nif, 
                documents
            );
        } catch (err) {
            console.error('Error al intentar insertar los docmuentos:', err);
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
    ipcMain.on('navigate', async (_, page, attr) => {
        let filePath = '';
        const serverURL = 'http://localhost:3000';

        if (page != '') filePath = `${serverURL}/${page}/index.html`;
        console.log(attr)
        if (attr && typeof attr === 'object')
            filePath += `?${new URLSearchParams(attr).toString()}`;

        console.log(filePath);
        if (filePath != '') mainWindow.loadURL(filePath);
    });
}

const handler = {
  AddDatabaseHandlers,
  AddUtilHandlers,
  AddPathHandlers,
};

export default handler;