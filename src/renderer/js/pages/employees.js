import { DOM, AddEvent, Navigate, Modal, Dialog, SaveDialog } from 'Components/controlAPI.js';
import dbAPI, { keys, EMPLOYEE} from 'Components/dbAPI.js';
import Table from 'Components/table.js';
import TableName from 'Types/handler/TableName.js';
import DialogType from 'Types/dialog.js';
import EntryPointsType from 'Types/entryPoints.js';
import { ExportCSV, FormatObjectLD } from 'Components/utilAPI';

const empKeys = keys(TableName.EMPLOYEE);

DOM(async() => {
    registerBackHandler();
    const table = initTable();
    await loadEmployees(table);
    registerCreateHandler(table);
    registerExportHandler();
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
        let formatEmployees = [];
        for (const employee of employees) formatEmployees.push(await FormatObjectLD(employee))
        table.init(formatEmployees);
    } catch (err) {
        console.error('Error al inicializar la tabla:', err);
        Dialog('Error', 'No se ha podido cargar a los empleados.', DialogType.ERROR);    
    }
}

function registerCreateHandler(table) {
    let isProcessing = false;

    AddEvent('.wininCreate', 'click', async() => {
        if (!isProcessing) {
            isProcessing = true;
            Modal(EntryPointsType.FORM, { title: 'Nuevo empleado', dataType: JSON.stringify(EMPLOYEE) })
            .then(async(employee) => {
                if (employee) {
                    try {
                        await dbAPI[empKeys.INSERT](employee);
                        table.addRow(await FormatObjectLD(employee));
                    } catch (error) {
                        console.error('Error añadir al empleado:', error);
                        Dialog('Error', 'No se ha podido añadir al empleado.', DialogType.ERROR);       
                    }
                }
                isProcessing = false;
            });
        }
    });
}

function registerExportHandler() {
    let isProcessing = false;

    AddEvent('.export', 'click', async() => {
        if (!isProcessing) {
            isProcessing = true;
            try {
                const employees = await dbAPI[empKeys.GETALL]();
                const path = await SaveDialog('Guardar Tabla', 'Empleados', 'csv');
                if (path != null){
                    await ExportCSV(employees, path);
                    Dialog('Información', 'Exportación creada correctamente.', DialogType.INFO);
                }
            } catch (err) {
                console.error('Error al inicializar la tabla:', err);
                Dialog('Error', 'No se ha podido exportar la tabla.', DialogType.ERROR);    
            }
            isProcessing = false;
        }
    });
}

function registerBackHandler() {
    AddEvent('.pgBack', 'click', () => { Navigate(EntryPointsType.MAIN); });
}