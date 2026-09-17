import { useEffect, useState } from 'react';
import db, { keys } from 'Api/db';
import { Dialog } from 'Api/control';
import handleExport from 'Util/handleExport';
import TemplateTable from 'Components/TemplateTable/TemplateTable';
import Modal from 'Components/Modal/Modal';
import Form from 'Components/Form/Form';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';
import TableName from 'Types/shared/handler/TableName.js';
import DialogType from 'Types/renderer/dialog';
import FolderType from 'Types/shared/handler/FolderType';
import EMPLOYEE from 'Schemas/EmployeeSchema';

export default function Employees() {
    const [data, setData] = useState([]);
    const docKeys = keys(TableName.DOCUMENT);
    const empKeys = keys(TableName.EMPLOYEE);

    useEffect(() => {
        (async () => {
            const result = await db[empKeys.GETALL]();
            setData(result);
        })();
    }, []);

    const handleExportClick = () => {
        handleExport(() => db[empKeys.GETALL](), 'Empleados');
    };

    const handleInsert = async (data) => {
        const itemId = await db[empKeys.INSERT](data);
        await db[docKeys.INSERTALL](itemId, data.documents, FolderType.EMPLOYEES);
        Dialog('Información', 'Usuario añadido correctamente.', DialogType.INFO);
        setData(prev => [...prev, { ...data, id: itemId }]);
    }

    const handleDelete = async (itemId) => {
        await db[empKeys.DELETE](itemId);
        Dialog('Información', 'Usuario eliminado correctamente.', DialogType.INFO);
        const key = EMPLOYEE.find(col => col.identifier)?.key;
        setData(prev => prev.filter(item => item[key] !== itemId));
    }

    return (
        <TemplateTable
            title={['Docmaen', 'Empleados']}
            titleTable={'Empleados'}
            backNav='/'
            columns={EMPLOYEE}
            data={data}
            dbAction={handleDelete}
        >
            <Button type={ButtonType.SECONDARY} event={handleExportClick}>Exportar</Button>
            <Modal title='Nuevo empleado' textButtonOpen='Añadir Empleado'>
                {({ close }) => (
                    <Form
                        columns={EMPLOYEE}
                        embedded={true}
                        onSubmitSuccess={close}
                        dbAction={handleInsert}
                    />
                )}
            </Modal>
        </TemplateTable>
    );
}