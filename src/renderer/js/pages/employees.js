import { DOM, AddEvent, Navigate, Modal, Dialog } from 'Components/controlAPI.js';
import { EMPLOYEE, FormatEmployee, FormatDbEmployee, GetEmployees, SetEmployee, DeleteEmployee } from 'Components/dbAPI.js';
import DIALOG_TYPE from 'Types/dialog.js';
import Table from 'Components/table.js';

DOM(async() => {
    registerBackHandler();
    const table = initTable();
    await loadEmployees(table);
    registerCreateHandler(table);
});

function initTable() {
    const id = 'tblEmployees';
    const table = new Table(id, EMPLOYEE, [
        { width: "110px", targets: 3 },
        { width: "110px", targets: 4 },
        { width: "100px", targets: 8 }
    ]);

    table.addInteractiveRowNavigation('editemployees');
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
        table.init(FormatEmployee(employees));
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
                await SetEmployee(FormatDbEmployee(employee));
                table.addRow(FormatEmployee(employee));
            } catch (error) {
                console.error('Error al abrir el modal:', error);
                Dialog('Error', 'No se ha podido añadir al empleado.', DIALOG_TYPE.ERROR);       
            }
        });
    });
}

function registerBackHandler() {
    AddEvent('.pgBack', 'click', () => { Navigate('main_window'); });
}