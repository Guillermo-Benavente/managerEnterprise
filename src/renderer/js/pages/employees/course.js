import { DOM, AddEvent, GetElement, AddElement, RemoveElement, Navigate } from 'Components/controlAPI.js';
import { COURSE, GetCourses } from 'Components/dbAPI.js';
import { UploadImages } from 'Components/button.js';
import { CreateBody, CreateHeader, UpdatePages, LoadPage, GetRowsPerPage } from 'Components/table.js';
import { CreateFormWindow, AlertWindow } from 'Components/window.js';
import Alert from 'Types/alert.js';

DOM(() => {
    const sizeRow = 53; 
    const sizeHead = 240;
    const idTable = 'tblCourses';
    const employeeId = new URLSearchParams(window.location.search).get('id');

    let tableBody;
    let pageNumber;

    let rowsPerPage = GetRowsPerPage(sizeRow,sizeHead);

    AddEvent('.pgBack', 'click', () => { Navigate('editemployees', {id:employeeId} ); });

    CreateHeader('#' + idTable, COURSE);

    ChargeCourses((data) => {
        CreateBody('#' + idTable, data, COURSE, rowsPerPage);
        UpdatePages('#' + idTable, data.length, rowsPerPage);
        Delete();

        tableBody = GetElement('#' + idTable + ' tbody');
        pageNumber = GetElement('#vPages-' + idTable);
    });

    AddEvent(null, 'resize', () => {
        if (rowsPerPage != GetRowsPerPage(sizeRow,sizeHead)) {
            rowsPerPage = GetRowsPerPage(sizeRow,sizeHead);

            ChargeCourses((data) => {
                UpdatePages('#' + idTable, data.length, rowsPerPage);
                LoadPage(tableBody, pageNumber, data, COURSE, rowsPerPage);
            });
        }
    });

    AddEvent('.btnBefore', 'click', () => {
        if(pageNumber.textContent > 1){
            pageNumber.textContent = pageNumber.textContent - 1

            ChargeCourses((data) => {
                LoadPage(tableBody, pageNumber, data, COURSE, rowsPerPage);
            });
        }
    });

    AddEvent('.btnAfter', 'click', () => {
        const pageNumberTotal = GetElement('#vPagesTotal-' + idTable);

        if(pageNumberTotal.textContent > pageNumber.textContent){
            pageNumber.textContent = parseInt(pageNumber.textContent) + 1

            ChargeCourses((data) => {
                LoadPage(tableBody, pageNumber, data, COURSE, rowsPerPage);
            });
        }
    });

    UploadImages();

    function ChargeCourses(callback) {
        GetCourses(employeeId, (success, data) => {
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

                const dni = target.closest('tr').children[0].textContent;
                AddElement(AlertWindow(Alert.WARNING, 'Vas a eliminar un empleado ¿Estás Seguro?', (success) => {
                    if (success) DeleteEmployee(dni, (success) => {
                        if (success) {
                            RemoveElement(target.closest('tr'), tableBody);
                            ChargeCourses((data) => {
                                UpdatePages('#' + idTable, data.length, rowsPerPage);
                                LoadPage(tableBody, pageNumber, data, COURSE, rowsPerPage);
                            });
                        }
                    });
                }));
            } else if (target.closest('tr')) {
                const row = target.closest('tr');
                const idKey = row.children[0].textContent;
                Navigate('editemployees', {id:idKey} );
            }
        });
    }
});