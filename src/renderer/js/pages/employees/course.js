import { DOM, AddEvent, Navigate, Dialog, Modal } from 'Components/controlAPI.js';
import dbAPI, { keys, COURSE, COURSES } from 'Components/dbAPI.js';
import Table from 'Components/table.js';
import TableName from 'Types/handler/TableName.js';
import DialogType from 'Types/dialog.js';
import EntryPointsType from 'Types/entryPoints.js';

const empKeys = keys(TableName.EMPLOYEE);
const curKeys = keys(TableName.COURSE);

DOM(async() => {
    const employeeId = new URLSearchParams(window.location.search).get('id');

    registerBackHandler(employeeId);
    const table = initTable(employeeId);
    await loadCourses(employeeId, table);
    registerCreateHandler(employeeId, table);
});

function initTable(employeeId) {
    const id = 'tblCourses';
    const table = new Table(id, COURSE);

    table.addInteractiveRowNavigation(EntryPointsType.VIEW_COURSE, employeeId);
    table.addInteractiveRowDelete('Vas a eliminar un curso ¿Estás Seguro?', async(id) => {
        try {
            await dbAPI[curKeys.DELETE](id);
            table.deleteRow(id);
            await updateEmployeeCourses(employeeId, -1);
        } catch (error) {
            console.error('Error al eliminar el curso:', error);
            Dialog('Error', 'No se ha podido eliminar el curso.', DialogType.ERROR);
        }
    });

    return table;
}

async function loadCourses(employeeId, table) {
    try {
        const courses = await dbAPI[curKeys.GETALL](employeeId);
        table.init(courses);
    } catch (err) {
        console.error('Error al inicializar la tabla:', err);
        Dialog('Error', 'No se ha podido cargar los cursos.', DialogType.ERROR);    
    }
}

function registerCreateHandler(employeeId, table) {
    let isProcessing = false;

    AddEvent('.wininCreate', 'click', () => {
        if (!isProcessing) {
            isProcessing = true;
            Modal(EntryPointsType.FORM, { title: 'Nuevos cursos', dataType: JSON.stringify(COURSES) })
            .then(async(model) => {
                if (model){
                    try {
                        const idCourses = await dbAPI[curKeys.INSERT](employeeId, model.courses);
                        const courses = await Promise.all(idCourses.map(id => dbAPI[curKeys.GETONE](id)));
                        
                        courses.forEach(course => { table.addRow(course); });

                        await updateEmployeeCourses(employeeId, courses.length);
                    } catch (error) {
                        console.error('Error al abrir el modal:', error);
                        Dialog('Error', 'No se han podido añadir los cursos.', DialogType.ERROR);       
                    }
                }
                isProcessing = false;
            });
        }
    });
}

function registerBackHandler(employeeId) {
    AddEvent('.pgBack', 'click', () => { Navigate(EntryPointsType.EDIT_EMPLOYEE, {id:employeeId} ); });
}

async function updateEmployeeCourses(employeeId, courses) {
    try {
        const employee = await dbAPI[empKeys.GETONE](employeeId);
        employee.courses += courses;
        await dbAPI[empKeys.UPDATE](employee);
    } catch (error) {
        console.error('Error al abrir el modal:', error);
        Dialog('Error', 'No se han podido actualizar los cursos en el empleado.', DialogType.ERROR);       
    }
}