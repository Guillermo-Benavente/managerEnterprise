import afterImage from '../../../assets/img/after.svg';
import beforeImage from '../../../assets/img/before.svg';
import { GetEmployees, SetEmployee, DeleteEmployee, FormatEmployee, FormatDbEmployee } from 'Components/dbAPI.js';
import { AddElement, GetElement, RemoveElement, Navigate } from 'Components/controlAPI.js';
import { CreateFormWindow, AlertWindow } from 'Components/window.js';
import Alert from 'Types/alert.js';

/**
 * Crea una tabla en un elemento HTML con los datos proporcionados y soporte de paginación.
 * 
 * @param {string} tableElement - Selector del elemento donde se creará la tabla.
 * @param {Array<Object>} data - Array de objetos con los datos a mostrar en la tabla. Las claves de los objetos serán los encabezados.
 * @param {number} rowsPerPage - Número de filas a mostrar por página.
 * @returns {void} - La tabla es creada dentro del elemento especificado con la funcionalidad de paginación.
 * 
 * @example
 * const data = [
 *     { nombre: 'Juan', edad: 25, trabajo: 'Desarrollador' },
 *     { nombre: 'Ana', edad: 30, trabajo: 'Diseñadora' }
 * ];
 * CreateTable('.miTabla', data, 10);
 */
export function CreateTable(tableElement, data, rowsPerPage) {
    const table = document.querySelector(tableElement);

    if (!table) {
        throw new Error(`El elemento con el selector "${tableElement}" no se encontró.`);
    }

    CreateHeader(tableElement, data, rowsPerPage);
    
    CreateBody(tableElement, data, rowsPerPage);
}

/**
 * Crea el cuerpo de la tabla HTML con las filas de datos y las agrega al elemento tabla.
 * 
 * @param {string} tableElement - Selector CSS del elemento donde se creará el cuerpo de la tabla.
 * @param {Array<Object>} data - Array de objetos que contiene los datos para mostrar en la tabla.
 * @param {number} rowsPerPage - Número de filas que se mostrarán por página.
 * @returns {void} - No retorna un valor, pero añade las filas al cuerpo de la tabla.
 * 
 * @example
 * CreateBody('.miTabla', data, 10);
 */
//TODO cambiar comentarios
export function CreateBody(tableElement, data, dataType, rowsPerPage) {
    const table = document.querySelector(tableElement);

    if (!table) {
        throw new Error(`El elemento con el selector "${tableElement}" no se encontró.`);
    }

    const tbody = document.createElement('tbody');

    console.log(data);

    // Iterar sobre los datos para crear las filas
    data.slice(0, rowsPerPage).forEach((rowData, index) => {
        const row = CreateRow(rowData, dataType);

        if (index % 2 === 0) row.className += 'row row-first';
        else row.className += 'row row-second'; 

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
}

/**
 * Crea el encabezado de la tabla HTML y añade la paginación.
 * 
 * @param {string} tableElement - Selector CSS del elemento donde se creará el encabezado de la tabla.
 * @param {Array<Object>} data - Array de objetos que contiene los datos para generar los encabezados.
 * @param {number} rowsPerPage - Número de filas que se mostrarán por página (por defecto, el total de filas).
 * @returns {void} - No retorna un valor, pero añade el encabezado de la tabla.
 * 
 * @example
 * CreateHeader('.miTabla', data, 10);
 */
export function CreateHeader(tableElement, data, rowsPerPage = data.length) {
    const table = document.querySelector(tableElement);

    if (!table) throw new Error(`El elemento con el selector "${tableElement}" no se encontró.`);

    table.innerHTML = '';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    Object.entries(data).forEach(([key, _]) => {
        if (data[key].showTable) {
            const th = document.createElement('th');
            th.textContent = data[key].name;
            headerRow.appendChild(th);
        }
    });

    const thPages = document.createElement('th');
    thPages.className = 'tbl-btn';
    thPages.style.width = '90px';

    const pagBefore = document.createElement('span');
    pagBefore.className = 'btn-img btn-primary btnBefore';
    pagBefore.setAttribute('data-img', beforeImage);

    const pages = document.createElement('span');
    pages.id = 'vPages-' + tableElement.substring(1, tableElement.length);
    pages.textContent = '1';

    const separatorPages = document.createElement('span');
    separatorPages.textContent = '/';

    const pagesTotal = document.createElement('span');
    pagesTotal.id = 'vPagesTotal-' + tableElement.substring(1, tableElement.length);
    pagesTotal.textContent = data.length > 0 ? Math.ceil(data.length / rowsPerPage) : 1;

    const pagAfter = document.createElement('span');
    pagAfter.className = 'btn-img btn-primary btnAfter';
    pagAfter.setAttribute('data-img', afterImage);

    thPages.appendChild(pagBefore);
    thPages.appendChild(pages);
    thPages.appendChild(separatorPages);
    thPages.appendChild(pagesTotal);
    thPages.appendChild(pagAfter);
    headerRow.appendChild(thPages);
    thead.appendChild(headerRow); 
    table.appendChild(thead);
}

/**
 * Crea una fila de una tabla a partir de los datos proporcionados, incluyendo botones de edición y eliminación.
 * 
 * @param {Object} data - Objeto que contiene los datos de una fila. Las claves son usadas como nombres de las celdas.
 * @returns {HTMLElement} - La fila (<tr>) creada con sus respectivas celdas (<td>).
 * 
 * @example
 * const data = { nombre: 'Juan', edad: 25, trabajo: 'Desarrollador' };
 * const row = CreateRow(data);
 * tableBody.appendChild(row);
 */
//TODO cambiar comentarios
export function CreateRow(data, dataType) {
    const row = document.createElement('tr');

    let idKey = null;

    Object.keys(data).forEach(key => {
        if (dataType[key].showTable) {
            if(idKey == null) idKey = data[key];
            const td = document.createElement('td');
            td.textContent = data[key];
            row.appendChild(td);
        }
    });

    const tdOptions = document.createElement('td');
    tdOptions.className = 'tbl-btn';

    /*const editBtn = document.createElement('span');
    editBtn.className = 'btn-img btn-primary';
    editBtn.setAttribute('data-img', '../../assets/img/edit.svg');*/

    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'btn-img btn-link tbl-row-del';
    deleteBtn.setAttribute('data-img', '../../assets/img/delete.svg');

    //tdOptions.appendChild(editBtn);
    tdOptions.appendChild(deleteBtn);
    row.appendChild(tdOptions);

    return row;
}

/**
 * Actualiza la paginación de la tabla, reseteando el número de página actual y el total de páginas.
 * 
 * @param {string} idTable - El identificador de la tabla (su selector).
 * @param {Array<Object>} data - Datos utilizados para recalcular el total de páginas.
 * @param {number} rowsPerPage - Número de filas por página.
 * @returns {void}
 * 
 * @example
 * UpdatePages('.miTabla', data, 10);
 */
export function UpdatePages(idTable, dataLength, rowsPerPage){
    const pages = document.querySelector('#vPages-' + idTable.substring(1, idTable.length));
    pages.textContent = '1';

    const pagesTotal = document.querySelector('#vPagesTotal-' + idTable.substring(1, idTable.length));
    pagesTotal.textContent = dataLength > 0 ? Math.ceil(dataLength / rowsPerPage) : 1;
}

/**
 * Carga los datos correspondientes a una página en el cuerpo de la tabla.
 * Reemplaza las filas existentes con las de la página seleccionada.
 * 
 * @param {HTMLElement} tableBody - Elemento tbody donde se añadirán las nuevas filas.
 * @param {HTMLElement} pageNumber - Elemento que contiene el número de la página actual.
 * @param {Array<Object>} allData - Todos los datos de la tabla, que serán paginados.
 * @param {number} rowsPerPage - Número de filas por página.
 * @returns {void}
 * 
 * @example
 * LoadPage(tbody, pageElement, data, 10);
 */
//TODO cambiar comentarios
export function LoadPage(tableBody, pageNumber, allData, dataType, rowsPerPage) {
    tableBody.innerHTML = '';

    let startIndex = (pageNumber.textContent - 1) * rowsPerPage;

    let data = allData.slice(startIndex, startIndex + rowsPerPage);
    
    data.forEach((row, index) => {
        const rowHtml = CreateRow(row, dataType);

        if (index % 2 === 0) rowHtml.className = 'row row-first';
        else rowHtml.className = 'row row-second';
        
        tableBody.appendChild(rowHtml);
    });
}

/**
 * Calcula cuántas filas caben en la pantalla basándose en la altura de la fila y el encabezado.
 * 
 * @param {number} rowHeight - Altura de una fila en píxeles.
 * @param {number} headerHeight - Altura del encabezado en píxeles.
 * @returns {number} - El número calculado de filas que caben en la pantalla.
 * 
 * @example
 * const rowsPerPage = GetRowsPerPage(50, 100);
 */
export function GetRowsPerPage (rowHeight, headerHeight) {
    let screenHeight = window.innerHeight - headerHeight;
    // Calculo cuántas filas caben en la pantalla
    return Math.floor(screenHeight / rowHeight);
}

export class Table {
    constructor(tableId, dataType, apiPath, columns = []) {
        this.tableId = tableId;
        this.dataType = dataType; // 'employee' o 'company'
        this.apiPath = apiPath;
        this.columns = columns;
        this.tableBody = null;
        this.pageNumber = null;
        this.rowsPerPage = GetRowsPerPage(sizeRow, sizeHead);
    }

    async loadInitialData() {
        const response = await GetEmployees();
        if (response.success) {
            this.data = response.data;
            this.currentPage = 1;
            this.updateTable();
        }
    }

    updatePage(page) {
        this.currentPage = page;
        this.loadPage();
    }

    loadMorePages() {
        const totalPages = document.querySelector(`#vPagesTotal-${this.tableId}`).textContent;
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.loadPage();
        }
    }

    loadLessPages() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadPage();
        }
    }

    async loadPage(number = this.currentPage) {
        const data = await GetEmployees();
        if (data.success) {
            this.data = data.data;
            this.updateTable();
        }
    }

    showForm(type = 'add') {
        AddElement(CreateFormWindow(
            type === 'add' ? 'Agregar Empleado' : 'Agregar Empresa',
            this.dataType,
            (formData) => {
                if (type === 'add') {
                    this.addNewRecord(formData);
                } else {
                    this.editRecord(formData);
                }
            }
        ));
    }

    async addNewRecord(formData) {
        const response = await SetEmployee(FormatDbEmployee(formData));
        if (response.success) {
            this.loadInitialData();
            this.hideForm();
        } else {
            this.showError('No se ha podido agregar el registro');
            this.hideForm();
        }
    }

    async editRecord(formData) {
        const id = formData.id;
        const response = await GetEmployees(id);
        if (response.success) {
            this.showEditForm();
        } else {
            this.showError('No se ha podido editar el registro');
        }
    }

    async deleteRecord(id) {
        const response = await DeleteEmployee(id);
        if (response.success) {
            this.removeRow();
            this.loadInitialData();
        } else {
            this.showError('No se ha podido eliminar el registro');
        }
    }

    updateTable() {
        CreateBody(`#${this.tableId}`, FormatEmployee(this.data), EMPLOYEE, this.rowsPerPage);
        UpdatePages(`#${this.tableId}`, this.data.length, this.rowsPerPage);
        this.delete();
    }

    showAlert(type) {
        AddElement(AlertWindow(
            type, 'Vas a hacer algo ¿Estás seguro?', (success) => {}
        ));
    }

    delete() {
        document.querySelector(`#${this.tableId} tbody`).addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('tbl-row-del')) {
                event.stopPropagation();
                const dni = target.closest('tr').children[0].textContent;
                AddElement(AlertWindow(Alert.WARNING, 'Vas a eliminar un empleado ¿Estás Seguro?', (success) => {
                    if (success) DeleteEmployee(dni, (success) => {
                        if (success) {
                            RemoveElement(target.closest('tr'), this.tableBody);
                            this.loadInitialData();
                        }
                    });
                }));
            } else if (target.closest('tr')) {
                const row = target.closest('tr');
                const idKey = row.children[0].textContent;
                Navigate('editemployees', { id: idKey });
            }
        });
    }
}
