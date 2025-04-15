import { DOM, AddEvent, Navigate, Modal, Dialog } from 'Components/controlAPI.js';
import { COMPANY, GetCompanies, SetCompany, DeleteCompany } from 'Components/dbAPI.js';
import Table from 'Components/table.js';
import DIALOG_TYPE from 'Types/dialog.js';

DOM(() => {
    const idTable = 'tblCompanies';

    AddEvent('.pgBack', 'click', () => { Navigate('main_window'); });

    const table = new Table(idTable, COMPANY, [{ width: "100px", targets: 4 }]);

    GetCompanies((success, data) => {
        if (success){
            table.addInteractiveRowNavigation('editcompanies');
            table.addInteractiveRowDelete('Vas a eliminar una empresa ¿Estás Seguro?', (nif) => {
                DeleteCompany(nif, (success) => { if (success) table.deleteRow(nif); });
            });
            table.init(data);
        }
    });

    AddEvent('.wininCreate', 'click', () => {
        Modal('form', { title: 'Nueva empresa', dataType: JSON.stringify(COMPANY) })
        .then((company) => {
            SetCompany(company, (success) => {
                if (success) table.addRow(company);
                else Dialog('Error', 'No se ha podido añadir a la empresa.', DIALOG_TYPE.ERROR);
            });
        });
    });
});