import { DOM, AddEvent, GetElement, AddElement, Navigate, Dialog } from 'Components/controlAPI.js';
import dbAPI, { keys, EMPLOYEE } from 'Components/dbAPI.js';
import { CreateForm } from 'Components/form.js';
import TableName from 'Types/handler/TableName.js';
import DialogType from 'Types/dialog.js';
import EntryPointsType from 'Types/entryPoints.js';

const empKeys = keys(TableName.EMPLOYEE);

DOM(async() => {
    const employeeId = new URLSearchParams(window.location.search).get('id');

    registerBackHandler();
    await init(employeeId);
});

async function init(employeeId){
    try {
        const employee = await dbAPI[empKeys.GETONE](employeeId);

        AddElement(CreateForm(employee, EMPLOYEE, 
            async(employee) => {
                try {
                    await dbAPI[empKeys.UPDATE](employee);
                    Dialog('Información', 'Información actualizada.', DialogType.INFO).then(() => { Navigate(EntryPointsType.EMPLOYEES); });
                } catch (error) {
                    console.error('Error al abrir el modal:', error);
                    Dialog('Error', 'No se pudo actualizar la informacion con éxito.', DialogType.ERROR);
                }
            }
        ), GetElement('.frm-cnt'));

        AddEvent('click', () => { Navigate(EntryPointsType.COURSES, {id:employeeId} ); }, '.pgCourse');
    } catch (error) {
        console.error('Error al inicializar el código:', error);
        Dialog('Error', 'No se ha podido cargar la página con éxito.', DialogType.ERROR);
    }
}

function registerBackHandler() {
    AddEvent('click', () => { Navigate(EntryPointsType.EMPLOYEES); }, '.pgBack');
}