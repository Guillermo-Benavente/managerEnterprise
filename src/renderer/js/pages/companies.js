import { DOM, AddEvent, Navigate, Modal, Dialog, SaveDialog } from 'Components/controlAPI.js';
import dbAPI, { keys, COMPANY } from 'Components/dbAPI.js';
import Table from 'Components/table.js';
import TableName from 'Types/handler/TableName.js';
import DialogType from 'Types/dialog.js';
import EntryPointsType from 'Types/entryPoints.js';
import { ExportCSV, FormatObjectLD } from 'Components/utilAPI';

const cmpKeys = keys(TableName.COMPANY);

DOM(async() => {
    registerBackHandler();
    const table = initTable();
    await loadCompanies(table);
    registerCreateHandler(table);
    registerExportHandler();
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
        let formatCompanies = [];
        for (const company of companies) formatCompanies.push(await FormatObjectLD(company))
        table.init(formatCompanies);
    } catch (err) {
        console.error('Error al inicializar la tabla:', err);
        Dialog('Error', 'No se ha podido eliminar a la empresa.', DialogType.ERROR);    
    }
}

function registerCreateHandler(table) {
    let isProcessing = false;
    
    AddEvent('click', () => {
        if (!isProcessing) {
            isProcessing = true;
            Modal(EntryPointsType.FORM, { title: 'Nueva empresa', dataType: JSON.stringify(COMPANY) })
            .then(async(company) => {
                if (company){
                    try {
                        await dbAPI[cmpKeys.INSERT](company);
                        table.addRow(await FormatObjectLD(company));
                    } catch (error) {
                        console.error('Error al intentar crear la empresa:', error);
                        Dialog('Error', 'No se ha podido añadir a la empresa.', DialogType.ERROR);       
                    }
                }
                isProcessing = false;
            });
        }
    }, '.wininCreate');
}

function registerExportHandler() {
    let isProcessing = false;

    AddEvent('click', async() => {
        if (!isProcessing) {
            isProcessing = true;
            try {
                const companies = await dbAPI[cmpKeys.GETALL]();
                const path = await SaveDialog('Guardar Tabla', 'Empresas', 'csv');
                if (path != null){
                    await ExportCSV(companies, path);
                    Dialog('Información', 'Exportación creada correctamente.', DialogType.INFO);
                }
            } catch (err) {
                console.error('Error al inicializar la tabla:', err);
                Dialog('Error', 'No se ha podido exportar la tabla.', DialogType.ERROR);    
            }
            isProcessing = false;
        }  
    }, '.export');
}

function registerBackHandler() {
    AddEvent('click', () => { Navigate(EntryPointsType.MAIN); }, '.pgBack');
}