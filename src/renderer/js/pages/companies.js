import { DOM, AddEvent, Navigate, Modal, Dialog } from 'Components/controlAPI.js';
import { COMPANY, GetCompanies, SetCompany, DeleteCompany } from 'Components/dbAPI.js';
import Table from 'Components/table.js';
import DIALOG_TYPE from 'Types/dialog.js';
import ENTRY_POINTS_TYPE from 'Types/entryPoints.js';

DOM(async() => {
    registerBackHandler();
    const table = initTable();
    await loadCompanies(table);
    registerCreateHandler(table);
});

function initTable() {
    const id = 'tblCompanies';
    const table = new Table(id, COMPANY);

    table.addInteractiveRowNavigation(ENTRY_POINTS_TYPE.EDIT_COMPANY);
    table.addInteractiveRowDelete('Vas a eliminar una empresa ¿Estás Seguro?', async(nif) => {
        try {
            await DeleteCompany(nif)
            table.deleteRow(nif);
        } catch (error) {
            console.error('Error al eliminar la empresa:', error);
        }
    });

    return table;
}

async function loadCompanies(table) {
    try {
        const companies = await GetCompanies();
        table.init(companies);
    } catch (err) {
        console.error('Error al inicializar la tabla:', err);
        Dialog('Error', 'No se ha podido eliminar a la empresa.', DIALOG_TYPE.ERROR);    
    }
}

function registerCreateHandler(table) {
    AddEvent('.wininCreate', 'click', () => {
        Modal('form', { title: 'Nueva empresa', dataType: JSON.stringify(COMPANY) })
        .then(async(company) => {
            try {
                await SetCompany(company);
                table.addRow(company);
            } catch (error) {
                console.error('Error al abrir el modal:', error);
                Dialog('Error', 'No se ha podido añadir a la empresa.', DIALOG_TYPE.ERROR);       
            }
        });
    });
}

function registerBackHandler() {
    AddEvent('.pgBack', 'click', () => { Navigate(ENTRY_POINTS_TYPE.MAIN); });
}