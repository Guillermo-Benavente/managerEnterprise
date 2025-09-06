import { useState } from 'react';
import { Trash } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import style from './table.module.css'
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';
import DataTable from 'react-data-table-component';

export default function Table({ title, columns, data, dbAction, actions = true }) {
    const navigate = useNavigate();
    const location = useLocation();
    const rootStyles = getComputedStyle(document.documentElement);
    const [filterText, setFilterText] = useState('');
    let filteredData;
    if (data) {
        filteredData = data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(filterText.toLowerCase())
            )
        );
    }

    let finalColumns = [];
    let paginationPerPage = 4;
    let columnId;
    let onRowClicked;
    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };
    let customStyles = {
        table: {
            style: {
                backgroundColor: rootStyles.getPropertyValue('--table-background-color').trim(),
                padding: '5px',
                fontFamily: 'sans-serif',
            }
        },
        subHeader: {
            style: {
                justifyContent: 'space-between',
                borderRadius: '5px 5px 0 0',
                backgroundColor: rootStyles.getPropertyValue('--table-head-background-color').trim(),
                color: rootStyles.getPropertyValue('--table-head-color').trim(),
            }
        },
        headRow: {
            style: {
                backgroundColor: rootStyles.getPropertyValue('--table-head-background-color').trim(),
                color: rootStyles.getPropertyValue('--table-head-color').trim(),
                fontSize: '16px',
                fontWeight: 'bold',
            }
        },
        rows: {
            style: {
                minHeight: '40px',
                backgroundColor: rootStyles.getPropertyValue('--table-row-background-color').trim(),
                transition: 'background-color 0.1s ease',
                '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: rootStyles.getPropertyValue('--table-row-hover-background-color').trim(),
                }
            },
            stripedStyle: {
                backgroundColor: rootStyles.getPropertyValue('--table-row-odd-background-color').trim(),
            },
        },
        pagination: {
            style: {
                backgroundColor: rootStyles.getPropertyValue('--table-pagination-background-color').trim(),
                color: rootStyles.getPropertyValue('--table-pagination-color').trim(),
                borderRadius: '0 0 5px 5px',
            },
            pageButtonsStyle: {
                fill: rootStyles.getPropertyValue('--table-button-fill').trim(),
            },
        },
    };

    if (columns) {
        columnId = columns.find(col => col.identifier)?.key ?? 'id';
        finalColumns = columns
            .filter(col => col.showTable)
            .map(col => ({
                name: col.name,
                selector: row => row[col.key],
                sortable: true,
            }));
        if (actions) finalColumns.push({
            name: 'Acciones',
            cell: row => (
                <Button type={ButtonType.LINK} event={() => dbAction(row[columnId])}>
                    <Trash size={16} />
                </Button>
            ),
            ignoreRowClick: true,
            width: '110px',
            center: true,
        });
        onRowClicked = (row) => {
            const basePath = location.pathname.endsWith('/')
                ? location.pathname.slice(0, -1)
                : location.pathname;
            navigate(`${basePath}/${row[columnId]}`);
        }
    } else {
        finalColumns = [{ name: 'Ha ocurrido un error', selector: row => row.info }];
        data = [{ id: 1, info: 'No es posible visualizar los datos.' }];
        paginationPerPage = 1;

        customStyles = {
            ...customStyles,
            headCells: { style: { justifyContent: 'center', } },
            cells: { style: { justifyContent: 'center', } },
        };
    }

    return (
        <DataTable
            striped
            columns={finalColumns}
            data={filteredData}
            defaultSortFieldId={1}
            pagination
            paginationPerPage={paginationPerPage}
            paginationRowsPerPageOptions={[4, 10, 50, 100]}
            paginationComponentOptions={paginationComponentOptions}
            fixedHeader={true}
            fixedHeaderScrollHeight='calc(100vh - 263px)'
            customStyles={customStyles}
            onRowClicked={onRowClicked}
            noDataComponent={'No hay datos disponibles.'}
            subHeader
            subHeaderComponent={
                <>
                    <h2 className={style.title}>{title}</h2>
                    <input
                        className={style.search}
                        type="search"
                        placeholder="Buscar..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                </>
            }
        />
    );
}