import { DOM, AddEvent, GetElement, AddElement, Navigate, Dialog } from 'Components/controlAPI.js';
import { COMPANY, DOCUMENT, GetCompany, UpdateCompany, GetDocuments, DeleteDocument, GetDocument, GetEmployeesByDocument, GetEmployee } from 'Components/dbAPI.js';
import { CreateForm } from 'Components/form.js';
import DIALOG_TYPE from 'Types/dialog.js';
import Table from 'Components/table.js';
import VAR_INLINE from 'Types/varInline';
import VAR_INLINE_NAME from 'Types/varInlineName';

DOM(() => {
    const idTable = 'tblDocuments';
    const table = new Table(idTable, DOCUMENT, [{ width: "100px", targets: 1 }]);
    const companyId = new URLSearchParams(window.location.search).get('id');

    AddEvent('.pgBack', 'click', () => { Navigate('companies'); });
    AddEvent('.pgCreateDocument', 'click', () => { Navigate('createdocument', {id:companyId}); });

    GetCompany(companyId, (success, data) => {
        if(success){
            AddElement(CreateForm(data, COMPANY,
                (company) => {
                    UpdateCompany(company, (success) => {
                        if (success) Dialog('Información', 'Información actualizada.', DIALOG_TYPE.INFO).then(() => { Navigate('companies'); });
                        else Dialog('Error', 'No se pudo actualizar la informacion con éxito.', DIALOG_TYPE.ERROR);
                    });
                }
            ), GetElement('.frm-cnt'));
        }
    });

    GetDocuments(companyId,(success, data) => {
        if (success){
            table.addInteractiveRowNavigation('editdocument', companyId);
            table.addInteractiveRowDelete('Vas a eliminar un documento ¿Estás Seguro?', (id) => {
                DeleteDocument(id, (success) => { if (success) table.deleteRow(id); });
            });
            table.addInteractiveRowCreate('Documentos generados correctamente', async (id) => {
                /*try {
                    const employeesData = await GetEmployeesByDocument(id);

                    // Se obtiene el documento una sola vez si es común a todos.
                    const documentData = await GetDocument(id);
                    const content = JSON.parse(documentData.content);

                    for (const ebd of employeesData) {
                        const employee = await GetEmployee(ebd.employee);

                        content.blocks.forEach((block, index) => {
                            if (typeof block.data.text === 'string') {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(block.data.text, 'text/html');
                                const spans = doc.querySelectorAll('span.' + VAR_INLINE.CLASS_NAME);

                                spans.forEach(span => {
                                    const key = span.getAttribute(VAR_INLINE.DATA_KEY);
                                    const actions = {
                                    [VAR_INLINE_NAME.EMPLOYEE_NAME]: () =>
                                        employee.name + ' ' + employee.first_surname + ' ' + employee.second_surname,
                                    [VAR_INLINE_NAME.COMPANY_NAME]: () => { /* ...  },
                                    [VAR_INLINE_NAME.EMPLOYEE_SIGNATURE]: () => { /* ...  }
                                    };
                                    
                                    if (actions[key]) {
                                    // Se sustituye el contenido del span.
                                    span.innerText = actions[key]();
                                    }
                                    console.log(`Se encontró ${VAR_INLINE.CLASS_NAME} en el bloque ${index}:`, span);
                                });
                            }
                        });
                    }
                } catch (err) {
                    Dialog('Error', 'No se ha podido descargar el documento.', DIALOG_TYPE.ERROR);
                    console.error(err);
                }*/
                
                
                
                
                GetEmployeesByDocument(id, (success, data) => {
                    if (success) 
                        data.forEach(ebd => {
                            let employee;
                            GetEmployee(ebd.employee, (success, data) => { if (success) employee.push(data); });

                            GetDocument(id, (success, data) => {
                                if (success) {
                                    const content = JSON.parse(data.content);
                                    content.blocks.forEach((block, index) => {
                                        if (typeof block.data.text === 'string') {
                                            const parser = new DOMParser();
                                            const doc = parser.parseFromString(block.data.text, 'text/html');

                                            const allSpan = doc.querySelectorAll('span.'+VAR_INLINE.CLASS_NAME);
                                            if (allSpan) allSpan.forEach(span => {

                                                const key = span.getAttribute(VAR_INLINE.DATA_KEY);
                                                const actions = {
                                                    [VAR_INLINE_NAME.EMPLOYEE_NAME]: () => { return employee.name +' '+ employee.first_surname +' '+ employee.second_surname; },
                                                    [VAR_INLINE_NAME.COMPANY_NAME]: () => { /* ... */ },
                                                    [VAR_INLINE_NAME.EMPLOYEE_SIGNATURE]: () => { /* ... */ },
                                                }
                                                if (actions[key]) actions[key]();
                                                console.log(`Se encontró ${VAR_INLINE.CLASS_NAME} en el bloque ${index}:`, span)
                                            });
                                        }
                                    });
                                } else {
                                    Dialog('Error', 'No se ha podido descargar el documento.', DIALOG_TYPE.ERROR);
                                }
                            });
                        });
                    else Dialog('Error', 'No se ha podido descargar el documento.', DIALOG_TYPE.ERROR);
                });
            });
            table.init(data);
        } 
    });
});