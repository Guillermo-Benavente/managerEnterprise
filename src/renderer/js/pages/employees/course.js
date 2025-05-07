import { DOM, AddEvent, Navigate, Dialog, Modal } from 'Components/controlAPI.js';
import { COURSE, COURSES, DeleteCourse, GetCourse, GetCourses, GetEmployee, SetCourses, UpdateEmployee } from 'Components/dbAPI.js';
import Table from 'Components/table.js';
import DIALOG_TYPE from 'Types/dialog.js';
import ENTRY_POINTS_TYPE from 'Types/entryPoints.js';

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

    table.addInteractiveRowNavigation(ENTRY_POINTS_TYPE.VIEW_COURSE, employeeId);
    table.addInteractiveRowDelete('Vas a eliminar un curso ¿Estás Seguro?', async(id) => {
        try {
            await DeleteCourse(id);
            table.deleteRow(id);
            await updateEmployeeCourses(employeeId, -1);
        } catch (error) {
            console.error('Error al eliminar el curso:', error);
            Dialog('Error', 'No se ha podido eliminar el curso.', DIALOG_TYPE.ERROR);
        }
    });

    return table;
}

async function loadCourses(employeeId, table) {
    try {
        const courses = await GetCourses(employeeId);
        table.init(courses);
    } catch (err) {
        console.error('Error al inicializar la tabla:', err);
        Dialog('Error', 'No se ha podido cargar los cursos.', DIALOG_TYPE.ERROR);    
    }
}

function registerCreateHandler(employeeId, table) {
    AddEvent('.wininCreate', 'click', () => {
        Modal('form', { title: 'Nuevos cursos', dataType: JSON.stringify(COURSES) })
        .then(async(model) => {
            try {
                const idCourses = await SetCourses(employeeId, model.courses);
                const courses = await Promise.all(idCourses.map(id => GetCourse(id)));
                
                courses.forEach(course => { table.addRow(course); });

                await updateEmployeeCourses(employeeId, courses.length);
            } catch (error) {
                console.error('Error al abrir el modal:', error);
                Dialog('Error', 'No se han podido añadir los cursos.', DIALOG_TYPE.ERROR);       
            }
        });
    });
}

function registerBackHandler(employeeId) {
    AddEvent('.pgBack', 'click', () => { Navigate(ENTRY_POINTS_TYPE.EDIT_EMPLOYEE, {id:employeeId} ); });
}

async function updateEmployeeCourses(employeeId, courses) {
    try {
        const employee = await GetEmployee(employeeId);
        employee.courses += courses;
        await UpdateEmployee(employee);
    } catch (error) {
        console.error('Error al abrir el modal:', error);
        Dialog('Error', 'No se han podido actualizar los cursos en el empleado.', DIALOG_TYPE.ERROR);       
    }
}