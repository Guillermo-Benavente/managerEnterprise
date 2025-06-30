import { DOM, AddEvent, AddElement, GetElement, Navigate, Dialog } from 'Components/controlAPI.js';
import dbAPI, { keys, PROFILE, DOCUMENT } from 'Components/dbAPI.js';
import { CreateForm } from 'Components/form.js';
import Table from 'Components/table.js';
import TableName from 'Types/handler/TableName.js';
import DialogType from 'Types/dialog.js';
import EntryPointsType from 'Types/entryPoints.js';

const proKeys = keys(TableName.PROFILE);
const docKeys = keys(TableName.DOCUMENT);
const ebdKeys = keys(TableName.EMPLOYEEBYDOCUMENT);

DOM(async() => {
    const profile = (await dbAPI[proKeys.GETALL]())[0] ?? {nif: undefined, name: undefined, telephone: undefined};

    registerBackHandler();
    await loadProfile(profile);
    const table = initTable(profile.nif);
    if(profile.nif != undefined) await loadDocuments(profile.nif, table);
    registerCreateHandler(profile.nif);
});

function initTable(profileId) {
    const id = 'tblProfile';
    const table = new Table(id, DOCUMENT);

    table.addInteractiveRowNavigation(EntryPointsType.EDIT_DOCUMENT, profileId, EntryPointsType.PROFILE);
    table.addInteractiveRowDelete('Vas a eliminar un documento ¿Estás Seguro?', async(id) => {
        try {
            await dbAPI[docKeys.DELETE](id)
            table.deleteRow(id);
        } catch (error) {
            console.error('Error al eliminar el documento:', error);
            Dialog('Error', 'No se ha podido eliminar el documento.', DialogType.ERROR);
        }
    });

    return table;
}

async function loadProfile(profile) {
    try {
        AddElement(CreateForm(profile, PROFILE,
            async(profileUpdate) => {
                try {
                    if (profile.nif === undefined) await dbAPI[proKeys.INSERT](profileUpdate);
                    else await dbAPI[proKeys.UPDATE](profileUpdate);
                    Dialog('Información', 'Información actualizada.', DialogType.INFO).then(() => { Navigate(EntryPointsType.PROFILE); });
                } catch (error) {
                    console.error('Error al actualizar el perfil:', error);
                    Dialog('Error', 'No se pudo actualizar la informacion con éxito.', DialogType.ERROR);
                }
            }
        ), GetElement('.frm-cnt2'));
    } catch (err) {
        console.error('Error al cargar el perfil:', err);
        Dialog('Error', 'No se ha podido cargar el perfil.', DialogType.ERROR);    
    }
}

async function loadDocuments(profileId, table) {
    try {
        const documents = await dbAPI[docKeys.GETALL](profileId);
        table.addInteractiveRowCreate('Documentos generados correctamente', async (id) => {
            try {
                let savePath;
                const employeesData = await dbAPI[ebdKeys.GETALL](id);
                const documentData = await dbAPI[docKeys.GETONE](id);

                if (employeesData.length > 1) savePath = await OpenDialog('Seleccione la carpeta de destino');
                else savePath = await SaveDialog('Guardar PDF', documentData.name, 'pdf');

                if (savePath != null) {
                    for (const ebd of employeesData) {
                        const employee = await dbAPI[empKeys.GETONE](ebd.employee);
                        const company = await dbAPI[cmpKeys.GETONE](documentData.company);

                        const employeeName = employee.name + ' ' + employee.surnames;
                        const copyContent = structuredClone(documentData.content);

                        copyContent.blocks.forEach((block) => {
                            if (typeof block.data.text === 'string') {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(block.data.text, 'text/html');
                                const spans = doc.querySelectorAll('span.' + VarInline.CLASS_NAME);

                                spans.forEach(span => {
                                    const key = span.getAttribute(VarInline.DATA_KEY);
                                    const actions = {
                                        [VarInlineName.EMPLOYEE_NAME]: () => employeeName,
                                        [VarInlineName.COMPANY_NAME]: () => company.name,
                                        [VarInlineName.DOCUMENT_DATE]: () => ebd.date.split('-').reverse().join('/'),
                                        [VarInlineName.EMPLOYEE_SIGNATURE]: () => { /* ... */ }
                                    };
                                    
                                    if (actions[key]) {
                                        const textNode = document.createTextNode(actions[key]());
                                        span.replaceWith(textNode);
                                    }
                                });

                                block.data.text = doc.body.innerHTML;
                            }
                        });

                        let fileName = savePath;
                        if (employeesData.length > 1) 
                            fileName = `${savePath}/${documentData.name}/${employeeName.replace(/\s+/g, '_').toLowerCase()}.pdf`;

                        SaveFile(fileName, newPdf(copyContent));
                    }
                }
            } catch (err) {
                Dialog('Error', 'No se ha podido descargar el documento.', DialogType.ERROR);
                console.error(err);
            }
        });
        table.init(documents);
    } catch (err) {
        console.error('Error al inicializar la tabla:', err);
        Dialog('Error', 'No se ha podido cargar los documentos.', DialogType.ERROR);    
    }
}

function registerCreateHandler(profileId) {
    if (profileId == undefined ) AddEvent('click', () => { Dialog('Error', 'Primero crea tu perfil.', DialogType.ERROR); }, '.pgCreateDocument');
    else AddEvent('click', () => { Navigate(EntryPointsType.DOCUMENTS, {id:profileId, EPReturn: EntryPointsType.PROFILE}); }, '.pgCreateDocument');
}

function registerBackHandler() {
    AddEvent('click', () => { Navigate(EntryPointsType.MAIN); }, '.pgBack');
}