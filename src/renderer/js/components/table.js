import DeleteImage from 'Assets/img/delete.svg';
import CreateImage from 'Assets/img/pdf.svg';
import DataTable from 'datatables.net-dt';
import { UploadImages } from 'Components/button.js';
import { Navigate, Dialog } from 'Components/controlAPI.js';
import DIALOG_TYPE from 'Types/dialog.js'

export default class Table {
    constructor(id, dataType, columnsDefs = null){
        this.id = id;
        this.dataType = dataType;
        document.getElementById(this.id).appendChild(this.header());

        const columns = [
            ...Object.entries(dataType)
                .filter(([, meta]) => meta.showTable)
                .map(([key, meta]) => {
                    let columnConfig = {
                        title: meta.name.charAt(0).toUpperCase() + meta.name.slice(1),
                        data: key,
                        visible: true
                    };
                    if (columnsDefs != null && columnsDefs[key]) columnConfig.width = columnsDefs[key];
                    
                    return columnConfig;
                }),
            {
                title:    'Acciones',
                data:     'actions',
                orderable:false,
                width: columnsDefs != null && columnsDefs['actions'] ? ccolumnsDefs['actions'] : '125px'
            }
        ];

        this.dataTable = new DataTable('#'+id, {
            pageLength: 4,
            lengthMenu: [4, 10, 20, 50],
            columns: columns,
            language: {
                search: "Buscar:",
                lengthMenu: "Mostrar _MENU_ registros por página",
                info: "Mostrando del _START_ al _END_ de _TOTAL_ registros",
                infoEmpty: "No hay registros disponibles",
                infoFiltered: "(filtrado de _MAX_ registros en total)",
                loadingRecords: "Cargando...",
                zeroRecords: "No se encontraron resultados",
                emptyTable: "No hay datos disponibles en la tabla",
                aria: {
                    sortAscending: ": Activar para ordenar la columna de manera ascendente",
                    sortDescending: ": Activar para ordenar la columna de manera descendente"
                }
            }
        });

        this._interactiveRowActions = {
            navigation: null,
            deletion: null,
            creation: null
        };

        this._setupInteractiveRowHandler();
    }

    init(data){
        this.data = data;
        this.body(this.data);
    }

    header(){
        let header = document.createElement('thead');
        let row = document.createElement('tr');

        Object.entries(this.dataType)
        .filter(([, meta]) => meta.showTable)
        .forEach(([, meta]) => {
            const th = document.createElement('th');
            th.textContent = meta.name.charAt(0).toUpperCase() + meta.name.slice(1);
            row.appendChild(th);
        });

        let actions = document.createElement('th');
        actions.textContent = 'Acciones';

        row.appendChild(actions);
        
        header.appendChild(row);
        return header;
    }

    body(data){ data.forEach(row => { this.addRow(row); }); }

    _setupInteractiveRowHandler() {
        const table = this.dataTable;

        table.on('click', 'tbody tr', async (event) => {
            const row = event.target.closest('tr');
            if (row) {
                const actions = this._interactiveRowActions;

                if (actions.deletion && event.target.classList.contains('tbl-row-del')) {
                    const { message, callback } = actions.deletion;
                    const result = await Dialog('Eliminar', message, DIALOG_TYPE.WARNING);
                    if (result) callback(row.id);

                } else if (actions.creation && event.target.classList.contains('tbl-row-create')) {
                    const { message, callback } = actions.creation;
                    const result = await callback(row.id);
                    if (result) await Dialog('Información', message, DIALOG_TYPE.INFO);

                } else if (actions.navigation) {
                    const { page, backId } = actions.navigation;
                    Navigate(page, { id: row.id, backId: backId });
                }
            }
        });

        table.on('draw.dt', () => { UploadImages(); });
    }

    addInteractiveRowNavigation(page, backId = null) {
        this._interactiveRowActions.navigation = { page, backId };
    }

    addInteractiveRowDelete(message, callback) {
        this._interactiveRowActions.deletion = { message, callback };
    }

    addInteractiveRowCreate(message, callback) {
        this._interactiveRowActions.creation = { message, callback };
    }

    _interactiveButtonsActions() {

        let actions = document.createElement('div');

        if (this._interactiveRowActions.creation != null) {
            let createBtn = document.createElement('span');
            createBtn.className = 'btn-img btn-link tbl-row-create';
            createBtn.setAttribute('data-img', CreateImage);
            actions.appendChild(createBtn);
        }

        if (this._interactiveRowActions.deletion != null) {
            let deleteBtn = document.createElement('span');
            deleteBtn.className = 'btn-img btn-link tbl-row-del';
            deleteBtn.setAttribute('data-img', DeleteImage);
            actions.appendChild(deleteBtn);
        }

        return actions;
    }

    addRow(data) {
        let row = Object.keys(this.dataType)
        .filter(key => this.dataType[key].showTable)
        .reduce((o, key) => {
            o[key] = data[key] !== undefined ? data[key] : '';
            return o;
        }, {});
        
        row.actions = this._interactiveButtonsActions();
        row.DT_RowId = data[Object.keys(data)[0]]; 

        this.dataTable.row.add(row).draw(false);
    }

    deleteRow(id) {
        this.dataTable.row('#' + id).remove().draw();
    }
}