import { DOM, AddEvent, GetElement, AddElement } from '../controlAPI.js';
import { COMPANY_TYPES, GetCompanies, SetCompany } from '../dbAPI.js';
import { UploadImages } from '../button.js';
import { CreateBody, CreateHeader, UpdatePages, LoadPage, GetRowsPerPage } from '../table.js';
import { CreateFormWindow } from '../window.js';

DOM(() => {
    const SIZE_ROW = 53; 
    const SIZE_HEAD = 240;
    const ID_TABLE = 'tblCompanies';
    const HEADER = [{ 
        'nif': 'nif',
        'name': 'nombre',
        'telephone': 'teléfono',
        'registration_date':'fecha de registro'
    }];
    const INSERT_DATA = { 
        'nif': 'nif',
        'name': 'nombre',
        'telephone': 'teléfono',
        'registration_date':'fecha de registro'
    };
    //[{ 'nif': '','nombre': '','teléfono': '','email': '','domicilio fiscal':''}];
    let rowsPerPage = GetRowsPerPage(SIZE_ROW,SIZE_HEAD);

    CreateHeader('#' + ID_TABLE, HEADER);

    GetCompanies((success, data) => {
        if (success) {
            CreateBody('#' + ID_TABLE, data, rowsPerPage);
            UpdatePages('#' + ID_TABLE, data.length, rowsPerPage);
            UploadImages();
        }
    });

    AddEvent(null, 'resize',() => {
        if (rowsPerPage != GetRowsPerPage(SIZE_ROW,SIZE_HEAD)) {
            rowsPerPage = GetRowsPerPage(SIZE_ROW,SIZE_HEAD);
            const tableBody = GetElement('#' + ID_TABLE + ' tbody');
            const pageNumber = GetElement('#vPages-' + ID_TABLE);
            
            GetCompanies((success, data) => {
                if (success) {
                    UpdatePages('#' + ID_TABLE, data.length, rowsPerPage);
                    LoadPage(tableBody, pageNumber, data, rowsPerPage);
                    UploadImages();
                }
            });
        }
    });

    AddEvent('.pgBack', 'click', () => {
        window.location.href = '../../index.html';
    });

    AddEvent('.wininCreate', 'click', () => {
        AddElement(CreateFormWindow('Datos de empresa', INSERT_DATA, COMPANY_TYPES,
            (companie) => {
                SetCompany(companie, (success) => {
                    if (success) {
                        GetCompanies((success, data) => {
                            if (success) {
                                const tableBody = GetElement('#' + ID_TABLE + ' tbody');
                                const pageNumber = GetElement('#vPages-' + ID_TABLE);
                                
                                UpdatePages('#' + ID_TABLE, data.length, rowsPerPage);
                                LoadPage(tableBody, pageNumber, data, rowsPerPage);
                                UploadImages();
                            }
                        });
                    } else {
                        //TODO añadir un mensaje informativo de que no se ha podido añadir por x razon
                    }
                });
            }
        ,'Crear Empresa'));
        UploadImages();
    });

    AddEvent('.btnBefore', 'click', () => {
        const tableBody = GetElement('#' + ID_TABLE + ' tbody');
        const pageNumber = GetElement('#vPages-' + ID_TABLE);

        if(pageNumber.textContent > 1){
            pageNumber.textContent = pageNumber.textContent - 1

            GetCompanies((success, data) => {
                if (success) {
                    LoadPage(tableBody, pageNumber, data, rowsPerPage);
                    UploadImages();
                }
            });
        }
    });

    AddEvent('.btnAfter', 'click', () => {
        const tableBody = GetElement('#' + ID_TABLE + ' tbody');
        const pageNumber = GetElement('#vPages-' + ID_TABLE);
        const pageNumberTotal = GetElement('#vPagesTotal-' + ID_TABLE)

        if(pageNumberTotal.textContent > pageNumber.textContent){
            pageNumber.textContent = parseInt(pageNumber.textContent) + 1

            GetCompanies((success, data) => {
                if (success) {
                    LoadPage(tableBody, pageNumber, data, rowsPerPage);
                    UploadImages();
                }
            });
        }
    });

    UploadImages();
});