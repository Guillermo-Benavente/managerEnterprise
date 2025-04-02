import { DOM, AddEvent, GetElement, AddElement, Navigate, Dialog } from 'Components/controlAPI.js';
import { COMPANY, DOCUMENT, GetCompany, UpdateCompany, GetDocuments, DeleteDocument } from 'Components/dbAPI.js';
import { CreateForm } from 'Components/form.js';
import Alert from 'Types/alert.js';
import Table from 'Components/table.js';

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
                        if (success) Dialog('Información', 'Información actualizada.', Alert.INFO).then(() => { Navigate('companies'); });
                        else Dialog('Error', 'No se pudo actualizar la informacion con éxito.', Alert.ERROR);
                    });
                }
            ), GetElement('.frm-cnt'));
        }
    });

    GetDocuments(companyId,(success, data) => {
        if (success){
            table.init(data);
            table.addInteractiveRow('editdocument', 'Vas a eliminar un documento ¿Estás Seguro?', (id) => {
                DeleteDocument(id, (success) => { if (success) table.deleteRow(id); });
            }, companyId);
        } 
    });
});