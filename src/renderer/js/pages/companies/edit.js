import { DOM, AddEvent, GetElement, AddElement, Navigate, Dialog, SaveDialog, OpenDialog, SaveFile } from 'Components/controlAPI.js';
import { COMPANY, DOCUMENT, GetCompany, UpdateCompany, GetDocuments, DeleteDocument, GetDocument, GetEmployeesByDocument, GetEmployee, FormatEmployee } from 'Components/dbAPI.js';
import { CreateForm } from 'Components/form.js';
import DIALOG_TYPE from 'Types/dialog.js';
import Table from 'Components/table.js';
import VAR_INLINE from 'Types/varInline';
import VAR_INLINE_NAME from 'Types/varInlineName';
import { newPdf } from 'Components/createPdf';

DOM(async() => {
    const companyId = new URLSearchParams(window.location.search).get('id');

    registerBackHandler();
    const table = initTable(companyId);
    await loadCompany(companyId);
    await loadDocuments(companyId, table);
    registerCreateHandler(companyId);
});

function initTable(companyId) {
    const id = 'tblDocuments';
    const table = new Table(id, DOCUMENT, [
        { width: "100px", targets: 1 }
    ]);

    table.addInteractiveRowNavigation('editdocument', companyId);
    table.addInteractiveRowDelete('Vas a eliminar un documento ¿Estás Seguro?', async(id) => {
        try {
            await DeleteDocument(id)
            table.deleteRow(id);
        } catch (error) {
            console.error('Error al eliminar el documento:', error);
            Dialog('Error', 'No se ha podido eliminar el documento.', DIALOG_TYPE.ERROR);
        }
    });

    return table;
}

async function loadCompany(companyId) {
    try {
        const company = await GetCompany(companyId);
        AddElement(CreateForm(company, COMPANY,
            async(company) => {
                try {
                    await UpdateCompany(company);
                    Dialog('Información', 'Información actualizada.', DIALOG_TYPE.INFO).then(() => { Navigate('companies'); });
                } catch (error) {
                    console.error('Error al actualizar la empresa:', error);
                    Dialog('Error', 'No se pudo actualizar la informacion con éxito.', DIALOG_TYPE.ERROR);
                }
            }
        ), GetElement('.frm-cnt2'));
    } catch (err) {
        console.error('Error al cargar la empresa:', err);
        Dialog('Error', 'No se ha podido cargar la empresa.', DIALOG_TYPE.ERROR);    
    }
}

async function loadDocuments(companyId, table) {
    try {
        const documents = await GetDocuments(companyId);
        table.addInteractiveRowCreate('Documentos generados correctamente', async (id) => {
            try {
                let savePath;
                const employeesData = await GetEmployeesByDocument(id);
                const documentData = await GetDocument(id);

                if (employeesData.length > 1) savePath = await OpenDialog('Seleccione la carpeta de destino');
                else savePath = await SaveDialog('Guardar PDF', documentData.name);

                if (savePath != null) {
                    const content = JSON.parse(documentData.content);

                    for (const ebd of employeesData) {
                        const employee = FormatEmployee(await GetEmployee(ebd.employee));
                        const company = await GetCompany(documentData.company);

                        const employeeName = employee.name+ ' ' + employee.surnames;

                        content.blocks.forEach((block) => {
                            if (typeof block.data.text === 'string') {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(block.data.text, 'text/html');
                                const spans = doc.querySelectorAll('span.' + VAR_INLINE.CLASS_NAME);

                                spans.forEach(span => {
                                    const key = span.getAttribute(VAR_INLINE.DATA_KEY);
                                    const actions = {
                                        [VAR_INLINE_NAME.EMPLOYEE_NAME]: () => employeeName,
                                        [VAR_INLINE_NAME.COMPANY_NAME]: () => company.name,
                                        [VAR_INLINE_NAME.DOCUMENT_DATE]: () => ebd.date.split('-').reverse().join('/'),
                                        [VAR_INLINE_NAME.EMPLOYEE_SIGNATURE]: () => { /* ... */ }
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

                        SaveFile(fileName, newPdf(content));
                    }
                }
            } catch (err) {
                Dialog('Error', 'No se ha podido descargar el documento.', DIALOG_TYPE.ERROR);
                console.error(err);
            }
        });
        table.init(documents);
    } catch (err) {
        console.error('Error al inicializar la tabla:', err);
        Dialog('Error', 'No se ha podido cargar los documentos.', DIALOG_TYPE.ERROR);    
    }
}

function registerCreateHandler(companyId) {
    AddEvent('.pgCreateDocument', 'click', () => { Navigate('createdocument', {id:companyId}); });
}

function registerBackHandler() {
    AddEvent('.pgBack', 'click', () => { Navigate('companies'); });
}