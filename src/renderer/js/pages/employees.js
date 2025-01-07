import { DOM, AddEvent, GetElement, AddElement, RemoveElement, Navigate } from 'Components/controlAPI.js';
import { EMPLOYEE, FormatEmployee, FormatDbEmployee, GetEmployees, SetEmployee, DeleteEmployee } from 'Components/dbAPI.js';
import { UploadImages } from 'Components/button.js';
import { CreateBody, CreateHeader, UpdatePages, LoadPage, GetRowsPerPage } from 'Components/table.js';
import { CreateFormWindow, AlertWindow } from 'Components/window.js';
import Alert from 'Types/alert.js';

DOM(() => {
    const sizeRow = 53; 
    const sizeHead = 240;
    const idTable = 'tblEmployees';

    let tableBody;
    let pageNumber;

    let rowsPerPage = GetRowsPerPage(sizeRow,sizeHead);

    AddEvent('.pgBack', 'click', () => { Navigate('main_window'); });

    CreateHeader('#' + idTable, EMPLOYEE);

    ChargeEmployees((data) => {
        CreateBody('#' + idTable, FormatEmployee(data), EMPLOYEE, rowsPerPage);
        UpdatePages('#' + idTable, data.length, rowsPerPage);
        Delete();

        tableBody = GetElement('#' + idTable + ' tbody');
        pageNumber = GetElement('#vPages-' + idTable);
    });

    AddEvent(null, 'resize', () => {
        if (rowsPerPage != GetRowsPerPage(sizeRow,sizeHead)) {
            rowsPerPage = GetRowsPerPage(sizeRow,sizeHead);

            ChargeEmployees((data) => {
                UpdatePages('#' + idTable, data.length, rowsPerPage);
                LoadPage(tableBody, pageNumber, FormatEmployee(data), EMPLOYEE, rowsPerPage);
            });
        }
    });

    AddEvent('.wininCreate', 'click', () => {
        AddElement(CreateFormWindow('Datos del empleado', EMPLOYEE,
            (employee) => {
                SetEmployee(FormatDbEmployee(employee), (success) => {
                    if (success) {
                        ChargeEmployees((data) => {
                            UpdatePages('#' + idTable, data.length, rowsPerPage);
                            LoadPage(tableBody, pageNumber, FormatEmployee(data), EMPLOYEE, rowsPerPage);
                        });
                    } else AddElement(AlertWindow('error','No se ha podido añadir al empleado'));
                });
            }
        ,'Crear Empleado'));
    });

    AddEvent('.btnBefore', 'click', () => {
        if(pageNumber.textContent > 1){
            pageNumber.textContent = pageNumber.textContent - 1

            ChargeEmployees((data) => {
                LoadPage(tableBody, pageNumber, FormatEmployee(data), EMPLOYEE, rowsPerPage);
            });
        }
    });

    AddEvent('.btnAfter', 'click', () => {
        const pageNumberTotal = GetElement('#vPagesTotal-' + idTable);

        if(pageNumberTotal.textContent > pageNumber.textContent){
            pageNumber.textContent = parseInt(pageNumber.textContent) + 1

            ChargeEmployees((data) => {
                LoadPage(tableBody, pageNumber, FormatEmployee(data), EMPLOYEE, rowsPerPage);
            });
        }
    });

    UploadImages();
    
    function ChargeEmployees(callback) {
        GetEmployees((success, data) => {
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
                            ChargeEmployees((data) => {
                                UpdatePages('#' + idTable, data.length, rowsPerPage);
                                LoadPage(tableBody, pageNumber, FormatEmployee(data), EMPLOYEE, rowsPerPage);
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