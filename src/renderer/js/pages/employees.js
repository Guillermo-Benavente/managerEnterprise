import { DOM, AddEvent, Navigate, Modal, Dialog } from 'Components/controlAPI.js';
import dbAPI, { keys, EMPLOYEE} from 'Components/dbAPI.js';
import Table from 'Components/table.js';
import TableName from 'Types/handler/TableName.js';
import DialogType from 'Types/dialog.js';
import EntryPointsType from 'Types/entryPoints.js';

const empKeys = keys(TableName.EMPLOYEE);

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

    table.addInteractiveRowNavigation(EntryPointsType.EDIT_EMPLOYEE);
    table.addInteractiveRowDelete('Vas a eliminar un empleado ¿Estás Seguro?', async(dni) => {
        try {
            await dbAPI[empKeys.DELETE](dni)
            table.deleteRow(dni);
        } catch (error) {
            console.error('Error al eliminar el empleado:', error);
        }
    });

    return table;
}

async function loadEmployees(table) {
    try {
        const employees = await dbAPI[empKeys.GETALL]();
        table.init(employees);
    } catch (err) {
        console.error('Error al inicializar la tabla:', err);
        Dialog('Error', 'No se ha podido eliminar al empleado.', DialogType.ERROR);    
    }
}

function registerCreateHandler(table) {
    AddEvent('.wininCreate', 'click', () => {
        Modal('form', { title: 'Nuevo empleado', dataType: JSON.stringify(EMPLOYEE) })
        .then(async(employee) => {
            try {
                await dbAPI[empKeys.INSERT](employee);
                table.addRow(employee);
            } catch (error) {
                console.error('Error al abrir el modal:', error);
                Dialog('Error', 'No se ha podido añadir al empleado.', DialogType.ERROR);       
            }
        });
    });
}

function registerBackHandler() {
    AddEvent('.pgBack', 'click', () => { Navigate(EntryPointsType.MAIN); });
}