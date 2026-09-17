import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import db, { keys } from 'Api/db';
import { Dialog } from 'Api/control';
import TemplateFormTable from 'Components/TemplateFormTable/TemplateFormTable';
import Modal from 'Components/Modal/Modal';
import Form from 'Components/Form/Form';
import TableName from 'Types/shared/handler/TableName.js';
import DialogType from 'Types/renderer/dialog';
import FolderType from 'Types/shared/handler/FolderType';
import EMPLOYEE from 'Schemas/EmployeeSchema';
import DOCUMENT from 'Schemas/DocumentSchema';
import DOCUMENT_EMPLOYEE from 'Schemas/DocumentEmployeeSchema';

export default function EmployeeEdit() {
    const { id } = useParams();
    const [dataForm, setDataForm] = useState(null);
    const [dataTable, setDataTable] = useState(null);
    const empKeys = keys(TableName.EMPLOYEE);
    const docEmpKeys = keys(TableName.DOCUMENTEMPLOYEE);
    const docKeys = keys(TableName.DOCUMENT);

    useEffect(() => {
        if (id) {
            (async () => {
                const resultForm = await db[empKeys.GETONE](id);
                const resultDocEmp = await db[docEmpKeys.GETALL](id);
                const documentsId = resultDocEmp.map(de => de.document);
                const resultTable = await Promise.all(
                    documentsId.map(async docId => await db[docKeys.GETONE](docId))
                );

                setDataForm(resultForm);
                setDataTable(resultTable);
            })();
        }
    }, [id]);

    const handleInsert = async (data) => {
        const documentsId = await db[docKeys.INSERTALL](id, data.documents, FolderType.EMPLOYEES);
        Dialog('Información', 'Documento(s) añadido(s) correctamente.', DialogType.INFO);
        const newDocuments = await Promise.all(
            documentsId.map(async id => {
                const document = await db[docKeys.GETONE](id);
                return { ...document, id };
            })
        );
        setDataTable(prev => [...prev, ...newDocuments]);
    }

    const handleUpdate = async (data) => {
        data.id = id;
        const items = await db[empKeys.UPDATE](data);
        Dialog('Información', 'Empleado actualizado correctamente.', DialogType.INFO);
    }

    const handleDelete = async (itemId) => {
        await db[docKeys.DELETE](itemId);
        Dialog('Información', 'Documento eliminado correctamente.', DialogType.INFO);
        const key = DOCUMENT.find(col => col.identifier)?.key;
        setDataTable(prev => prev.filter(item => item[key] !== itemId));
    }

    return (
        <TemplateFormTable
            title={['Docmaen', 'Empleados', 'Editar']}
            titleTable={'Documentos'}
            backNav='/employee'
            columnsForm={EMPLOYEE}
            dataForm={dataForm}
            columnsTable={DOCUMENT}
            dataTable={dataTable}
            dbActionForm={handleUpdate}
            dbActionTable={handleDelete}
        >
            <Modal title='Nuevos documentos' textButtonOpen='Añadir Documentos'>
                {({ close }) => (
                    <Form
                        columns={DOCUMENT_EMPLOYEE}
                        embedded={true}
                        onSubmitSuccess={close}
                        dbAction={handleInsert}
                    />
                )}
            </Modal>
        </TemplateFormTable>
    );
}