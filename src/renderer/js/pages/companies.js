import { DOM, AddEvent, Navigate, Modal, Dialog } from 'Components/controlAPI.js';
import dbAPI, { keys, COMPANY } from 'Components/dbAPI.js';
import Table from 'Components/table.js';
import TableName from 'Types/handler/TableName.js';
import DialogType from 'Types/dialog.js';
import EntryPointsType from 'Types/entryPoints.js';

const cmpKeys = keys(TableName.COMPANY);

DOM(async() => {
    registerBackHandler();
    const table = initTable();
    await loadCompanies(table);
    registerCreateHandler(table);
});

function initTable() {
    const id = 'tblCompanies';
    const table = new Table(id, COMPANY);

    table.addInteractiveRowNavigation(EntryPointsType.EDIT_COMPANY);
    table.addInteractiveRowDelete('Vas a eliminar una empresa ¿Estás Seguro?', async(nif) => {
        try {
            await dbAPI[cmpKeys.DELETE](nif)
            table.deleteRow(nif);
        } catch (error) {
            console.error('Error al eliminar la empresa:', error);
        }
    });

    return table;
}

async function loadCompanies(table) {
    try {
        const companies = await dbAPI[cmpKeys.GETALL]();
        table.init(companies);
    } catch (err) {
        console.error('Error al inicializar la tabla:', err);
        Dialog('Error', 'No se ha podido eliminar a la empresa.', DialogType.ERROR);    
    }
}

function registerCreateHandler(table) {
    AddEvent('.wininCreate', 'click', () => {
        Modal('form', { title: 'Nueva empresa', dataType: JSON.stringify(COMPANY) })
        .then(async(company) => {
            try {
                await dbAPI[cmpKeys.INSERT](company);
                table.addRow(company);
            } catch (error) {
                console.error('Error al abrir el modal:', error);
                Dialog('Error', 'No se ha podido añadir a la empresa.', DialogType.ERROR);       
            }
        });
    });
}

function registerBackHandler() {
    AddEvent('.pgBack', 'click', () => { Navigate(EntryPointsType.MAIN); });
}