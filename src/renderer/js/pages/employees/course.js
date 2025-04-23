import { DOM, AddEvent, Navigate, Dialog } from 'Components/controlAPI.js';
import { COURSE, GetCourses } from 'Components/dbAPI.js';
import DIALOG_TYPE from 'Types/dialog.js';
import Table from 'Components/table.js';

DOM(async() => {
    const employeeId = new URLSearchParams(window.location.search).get('id');

    registerBackHandler(employeeId);
    const table = initTable();
    await loadCourses(employeeId, table);
});

function initTable() {
    const id = 'tblCourses';
    const table = new Table(id, COURSE, [
        { width: "100px", targets: 1 }
    ]);

    table.addInteractiveRowNavigation('editemployees');
    table.addInteractiveRowDelete('Vas a eliminar un curso ¿Estás Seguro?', async(id) => {
        try {
            await Delete(id)
            table.deleteRow(id);
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

function registerBackHandler(employeeId) {
    AddEvent('.pgBack', 'click', () => { Navigate('editemployees', {id:employeeId} ); });
}