import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import db, { keys } from 'Api/db';
import { Dialog } from 'Api/control';
import TemplateFormTable from 'Components/TemplateFormTable/TemplateFormTable';
import Modal from 'Components/Modal/Modal';
import Form from 'Components/Form/Form';
import TableName from 'Types/shared/handler/TableName.js';
import DialogType from 'Types/renderer/dialog';
import EMPLOYEE from 'Schemas/EmployeeSchema';
import EMPLOYEE_DOCUMENT from 'Schemas/EmployeeDocumentSchema';

export default function EmployeeEdit() {
    const { id } = useParams();
    const [dataForm, setDataForm] = useState(null);
    const [dataTable, setDataTable] = useState(null);
    const empKeys = keys(TableName.EMPLOYEE);
    const curKeys = keys(TableName.COURSE);

    useEffect(() => {
        if (id) {
            (async () => {
                const resultForm = await db[empKeys.GETONE](id);
                const resultTable = await db[curKeys.GETALL](id);

                setDataForm(resultForm);
                setDataTable(resultTable);
            })();
        }
    }, [id]);

    const handleInsert = async (data) => {
        const items = await db[curKeys.INSERT](id, data.courses);
        Dialog('Información', 'Documento(s) añadido(s) correctamente.', DialogType.INFO);
        const newCourses = await Promise.all(
            items.map(async id => {
                const course = await dbAPI[curKeys.GETONE](id);
                return { ...course, id };
            })
        );
        setDataTable(prev => [...prev, ...newCourses]);
    }

    const handleUpdate = async (data) => {
        const items = await db[empKeys.UPDATE](data);
        Dialog('Información', 'Empleado actualizado correctamente.', DialogType.INFO);
    }

    const handleDelete = async (itemId) => {
        await db[curKeys.DELETE](itemId);
        Dialog('Información', 'Documento eliminado correctamente.', DialogType.INFO);
        const key = EMPLOYEE_DOCUMENT.find(col => col.identifier)?.key;
        setDataTable(prev => prev.filter(item => item[key] !== itemId));
    }

    return (
        <TemplateFormTable
            title={['Docmaen', 'Empleados', 'Editar']}
            titleTable={'Documentos'}
            backNav='/employee'
            columnsForm={EMPLOYEE}
            dataForm={dataForm}
            columnsTable={EMPLOYEE_DOCUMENT}
            dataTable={dataTable}
            dbActionForm={handleUpdate}
            dbActionTable={handleDelete}
        >
            <Modal title='Nuevos documentos' textButtonOpen='Añadir Documentos' textButtonClose='X'>
                {({ close }) => (
                    <Form
                        columns={EMPLOYEE_DOCUMENT}
                        embedded={true}
                        onSubmitSuccess={close}
                        dbAction={handleInsert}
                    />
                )}
            </Modal>
        </TemplateFormTable>
    );
}