import { DOM, AddEvent, GetElement, AddElement, Navigate, Dialog } from 'Components/controlAPI.js';
import { EMPLOYEE, GetEmployee, UpdateEmployee } from 'Components/dbAPI.js';
import { CreateForm } from 'Components/form.js';
import DIALOG_TYPE from 'Types/dialog.js';
import ENTRY_POINTS_TYPE from 'Types/entryPoints.js';

DOM(async() => {
    const employeeId = new URLSearchParams(window.location.search).get('id');

    registerBackHandler();
    await init(employeeId);
});

async function init(employeeId){
    try {
        const employee = await GetEmployee(employeeId);

        AddElement(CreateForm(employee, EMPLOYEE, 
            async(employee) => {
                try {
                    await UpdateEmployee(employee);
                    Dialog('Información', 'Información actualizada.', DIALOG_TYPE.INFO).then(() => { Navigate(ENTRY_POINTS_TYPE.EMPLOYEES); });
                } catch (error) {
                    console.error('Error al abrir el modal:', error);
                    Dialog('Error', 'No se pudo actualizar la informacion con éxito.', DIALOG_TYPE.ERROR);
                }
            }
        ), GetElement('.frm-cnt'));

        AddEvent('.pgCourse', 'click', () => { Navigate(ENTRY_POINTS_TYPE.COURSES, {id:employeeId} ); });
    } catch (error) {
        console.error('Error al inicializar el código:', error);
        Dialog('Error', 'No se ha podido cargar la página con éxito.', DIALOG_TYPE.ERROR);
    }
    //TODO Añadir a empleados un nuevo campo de la fecha de DNI
}

function registerBackHandler() {
    AddEvent('.pgBack', 'click', () => { Navigate(ENTRY_POINTS_TYPE.EMPLOYEES); });
}