import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import db, { keys } from 'Api/db';
import { Dialog } from 'Api/control';
import TemplateFormTable from 'Components/TemplateFormTable/TemplateFormTable';
import Modal from 'Components/Modal/Modal';
import Form from 'Components/Form/Form';
import TableName from 'Types/shared/handler/TableName.js';
import DialogType from 'Types/renderer/dialog';
import COMPANY from 'Schemas/CompanySchema';
import COMPANY_DOCUMENT from 'Schemas/CompanyDocumentSchema';


export default function CompanyEdit() {
    const { id } = useParams();
    const [dataForm, setDataForm] = useState(null);
    const [dataTable, setDataTable] = useState(null);
    const cmpKeys = keys(TableName.COMPANY);
    const docKeys = keys(TableName.DOCUMENT);

    useEffect(() => {
        if (id) {
            (async () => {
                const resultForm = await db[cmpKeys.GETONE](id);
                const resultTable = await db[docKeys.GETALL]();
                
                setDataForm(resultForm);
                setDataTable(resultTable);
            })();
        }
    }, [id]);

    const handleInsert = async (data) => {
        const itemId = await db[docKeys.INSERT](data);
        Dialog('Información', 'Documento añadido correctamente.', DialogType.INFO);
        setData(prev => [...prev, { ...data, itemId }]);
    }

    const handleUpdate = async (data) => {
        const items = await db[cmpKeys.UPDATE](data);
        Dialog('Información', 'Empresa actualizada correctamente.', DialogType.INFO);
    }
    
    const handleDelete = async (itemId) => {
        await db[docKeys.DELETE](itemId);
        Dialog('Información', 'Documento eliminado correctamente.', DialogType.INFO);
        const key = COMPANY_DOCUMENT.find(col => col.identifier)?.key;
        setData(prev => prev.filter(item => item[key] !== itemId));
    }

    return (
        <TemplateFormTable
            title={['Docmaen', 'Empresas', 'Editar']}
            titleTable={'Documentos'}
            backNav='/company'
            columnsForm={COMPANY}
            columnsTable={COMPANY_DOCUMENT}
            dataForm={dataForm}
            dataTable={dataTable}
            dbActionForm={handleUpdate}
            dbActionTable={handleDelete}
        >
            <Modal title='Nuevos documentos' textButtonOpen='Añadir Documentos' textButtonClose='X'>
                {({ close }) => (
                    <Form
                        columns={COMPANY_DOCUMENT}
                        embedded={true}
                        onSubmitSuccess={close}
                        dbAction={handleInsert}
                    />
                )}
            </Modal>
        </TemplateFormTable>
    );
}