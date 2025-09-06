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
import COMPANY from 'Schemas/CompanySchema';

export default function Companies() {
    const [data, setData] = useState([]);
    const cmpKeys = keys(TableName.COMPANY);

    useEffect(() => {
        (async () => {
            const result = await db[cmpKeys.GETALL]();
            setData(result);
        })();
    }, []);

    const handleExportClick = () => {
        handleExport(() => db[cmpKeys.GETALL](), 'Empresas');
    };

    const handleInsert = async (data) => {
        const itemId = await db[cmpKeys.INSERT](data);
        Dialog('Información', 'Empresa añadida correctamente.', DialogType.INFO);
        setData(prev => [...prev, { ...data, itemId }]);
    }

    const handleDelete = async (itemId) => {
        await db[cmpKeys.DELETE](itemId);
        Dialog('Información', 'Empresa eliminada correctamente.', DialogType.INFO);
        const key = COMPANY.find(col => col.identifier)?.key;
        setData(prev => prev.filter(item => item[key] !== itemId));
    }

    return (
        <TemplateTable
            title={['Docmaen', 'Empresas']}
            titleTable={'Empresas'}
            backNav='/'
            columns={COMPANY}
            data={data}
            dbAction={handleDelete}
        >
            <Button type={ButtonType.SECONDARY} event={handleExportClick}>Exportar</Button>
            <Modal title='Nueva empresa' textButtonOpen='Añadir Empresa'>
                {({ close }) => (
                    <Form
                        columns={COMPANY}
                        embedded={true}
                        onSubmitSuccess={close}
                        dbAction={handleInsert}
                    />
                )}
            </Modal>
        </TemplateTable>
    );
}