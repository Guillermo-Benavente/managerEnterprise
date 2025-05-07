import { DOM, AddEvent, Navigate, Modal, Dialog } from 'Components/controlAPI.js';
import { EMPLOYEE, GetEmployees, SetEmployee, DeleteEmployee } from 'Components/dbAPI.js';
import Table from 'Components/table.js';
import DIALOG_TYPE from 'Types/dialog.js';
import ENTRY_POINTS_TYPE from 'Types/entryPoints.js';

DOM(async() => {
    registerBackHandler();
    const table = initTable();
    await loadEmployees(table);
    registerCreateHandler(table);
});

function initTable() {
    const id = 'tblEmployees';
    //TODO crear tipos para las keys
    const table = new Table(id, EMPLOYEE, { 'discharge_date': '110px', 'leave_date': '110px'} );

    table.addInteractiveRowNavigation(ENTRY_POINTS_TYPE.EDIT_EMPLOYEE);
    table.addInteractiveRowDelete('Vas a eliminar un empleado ¿Estás Seguro?', async(dni) => {
        try {
            await DeleteEmployee(dni)
            table.deleteRow(dni);
        } catch (error) {
            console.error('Error al eliminar el empleado:', error);
        }
    });

    return table;
}

async function loadEmployees(table) {
    try {
        const employees = await GetEmployees();
        table.init(employees);
    } catch (err) {
        console.error('Error al inicializar la tabla:', err);
        Dialog('Error', 'No se ha podido eliminar al empleado.', DIALOG_TYPE.ERROR);    
    }
}

function registerCreateHandler(table) {
    AddEvent('.wininCreate', 'click', () => {
        Modal('form', { title: 'Nuevo empleado', dataType: JSON.stringify(EMPLOYEE) })
        .then(async(employee) => {
            try {
                await SetEmployee(employee);
                table.addRow(employee);
            } catch (error) {
                console.error('Error al abrir el modal:', error);
                Dialog('Error', 'No se ha podido añadir al empleado.', DIALOG_TYPE.ERROR);       
            }
        });
    });
}

function registerBackHandler() {
    AddEvent('.pgBack', 'click', () => { Navigate(ENTRY_POINTS_TYPE.MAIN); });
}