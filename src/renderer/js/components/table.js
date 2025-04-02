import DeleteImage from 'Assets/img/delete.svg';
import DataTable from 'datatables.net-dt';
import { UploadImages } from 'Components/button.js';
import { Navigate, Dialog } from 'Components/controlAPI.js';
import Alert from 'Types/alert.js'

export default class Table {
    constructor(id, dataType, columns = null){
        let columnFormat = [];
        
        this.id = id;
        this.dataType = dataType;
        document.getElementById(this.id).appendChild(this.header());

        if (columns) columns.forEach(column => {
            columnFormat.push({ width: column.width, targets: column.targets });
        });

        this.dataTable = new DataTable('#'+id, {
            pageLength: 4,
            lengthMenu: [4, 8, 12, 24, 48],
            columnDefs: columnFormat,
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
    }

    init(data){
        this.data = data;
        this.body(this.data);
    }

    header(){
        let header = document.createElement('thead');
        let row = document.createElement('tr');

        Object.keys(this.dataType).filter(key => this.dataType[key].showTable).forEach(key => { 
            let th = document.createElement('th');
            th.textContent = this.dataType[key].name.charAt(0).toUpperCase() + this.dataType[key].name.slice(1);
            row.appendChild(th);
        });
        let actions = document.createElement('th');
        actions.textContent = 'Acciones';

        row.appendChild(actions);
        
        header.appendChild(row);
        return header;
    }

    body(data){ data.forEach(row => { this.addRow(row); }); }

    addInteractiveRow(page, message, callback, backId = null){
        const table = this.dataTable;

        table.on('click', 'tbody tr', (event) => {
            if (event.target.classList.contains('tbl-row-del')) {
                event.stopPropagation();
                Dialog('Eliminar', message, Alert.WARNING)
                .then(result => { if (result) callback(event.target.closest('tr').id); });
            } else if (event.target.closest('tr')) Navigate(page, {id:event.target.closest('tr').id, backId: backId});
        });
        table.on('draw.dt', () => { UploadImages(); });
        UploadImages();
    }

    addRow(data) {
        let tr = Object.keys(data)
            .filter(key => this.dataType[key].showTable)
            .map(key => data[key]);

        let deleteBtn = document.createElement('span');
        deleteBtn.className = 'btn-img btn-link tbl-row-del';
        deleteBtn.setAttribute('data-img', DeleteImage);
        
        tr.push(deleteBtn);

        tr.DT_RowId = data[Object.keys(data)[0]]; 

        this.dataTable.row.add(tr).draw(false);
    }

    deleteRow(id) {
        this.dataTable.row('#' + id).remove().draw();
    }
}