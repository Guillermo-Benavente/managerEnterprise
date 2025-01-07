import { DOM, AddEvent, GetElement, AddElement, RemoveElement, Navigate } from 'Components/controlAPI.js';
import { COMPANY, GetCompanies, SetCompany, DeleteCompany } from 'Components/dbAPI.js';
import { UploadImages } from 'Components/button.js';
import { CreateBody, CreateHeader, UpdatePages, LoadPage, GetRowsPerPage } from 'Components/table.js';
import { CreateFormWindow, AlertWindow } from 'Components/window.js';
import Alert from 'Types/alert.js';

DOM(() => {
    const sizeRow = 53; 
    const sizeHead = 240;
    const idTable = 'tblCompanies';

    let tableBody;
    let pageNumber;
    
    let rowsPerPage = GetRowsPerPage(sizeRow,sizeHead);

    AddEvent('.pgBack', 'click', () => { Navigate('main_window'); });

    CreateHeader('#' + idTable, COMPANY);

    ChargeCompanies((data) => {
        CreateBody('#' + idTable, data, COMPANY, rowsPerPage);
        UpdatePages('#' + idTable, data.length, rowsPerPage);
        Delete();

        tableBody = GetElement('#' + idTable + ' tbody');
        pageNumber = GetElement('#vPages-' + idTable);
    });

    AddEvent(null, 'resize', () => {
        if (rowsPerPage != GetRowsPerPage(sizeRow,sizeHead)) {
            rowsPerPage = GetRowsPerPage(sizeRow,sizeHead);
            
            ChargeCompanies((data) => {
                UpdatePages('#' + idTable, data.length, rowsPerPage);
                LoadPage(tableBody, pageNumber, data, COMPANY, rowsPerPage);
            });
        }
    });

    AddEvent('.wininCreate', 'click', () => {
        AddElement(CreateFormWindow('Datos de empresa', COMPANY,
            (companie) => {
                SetCompany(companie, (success) => {
                    if (success) {
                        ChargeCompanies((data) => {
                            UpdatePages('#' + idTable, data.length, rowsPerPage);
                            LoadPage(tableBody, pageNumber, data, COMPANY, rowsPerPage);
                        });
                    } else AddElement(AlertWindow('error','No se ha podido añadir a la empresa'));
                });
            }
        ,'Crear Empresa'));
    });

    AddEvent('.btnBefore', 'click', () => {
        if(pageNumber.textContent > 1){
            pageNumber.textContent = pageNumber.textContent - 1

            ChargeCompanies((data) => {
                LoadPage(tableBody, pageNumber, data, COMPANY, rowsPerPage);
            });
        }
    });

    AddEvent('.btnAfter', 'click', () => {
        const pageNumberTotal = GetElement('#vPagesTotal-' + idTable)

        if(pageNumberTotal.textContent > pageNumber.textContent){
            pageNumber.textContent = parseInt(pageNumber.textContent) + 1

            ChargeCompanies((data) => {
                LoadPage(tableBody, pageNumber, data, COMPANY, rowsPerPage);
            });
        }
    });

    UploadImages();

    function ChargeCompanies(callback) {
        GetCompanies((success, data) => {
            if (success) {
                callback(data);
                UploadImages();
            }
        });
    }

    function Delete() {
        //TODO esta parte hay que cambiarla e un futuro por AddEvent, el problema es el evento que no pasa correctamente
        document.querySelector('#' + idTable + ' tbody').addEventListener('click', (event) => {
            const target = event.target;

            if (target.classList.contains('tbl-row-del')) {
                event.stopPropagation();

                const nif = target.closest('tr').children[0].textContent;
                AddElement(AlertWindow(Alert.WARNING, 'Vas a eliminar un empleado ¿Estás Seguro?', (success) => {
                    if (success) DeleteCompany(nif, (success) => {
                        if (success) {
                            RemoveElement(target.closest('tr'), tableBody);
                            ChargeCompanies((data) => {
                                UpdatePages('#' + idTable, data.length, rowsPerPage);
                                LoadPage(tableBody, pageNumber, data, COMPANY, rowsPerPage);
                            });
                        }
                    });
                }));
            } else if (target.closest('tr')) {
                const row = target.closest('tr');
                const idKey = row.children[0].textContent;
                Navigate('editcompanies', {id:idKey} );
            }
        });
    }
});