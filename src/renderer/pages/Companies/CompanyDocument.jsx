import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetPdf } from 'Api/util';
import db, { keys } from 'Api/db';
import { Dialog } from 'Api/control';
import TemplateBase from 'Components/TemplateBase/TemplateBase';
import PdfViewer from 'Components/PDFViewer/PDFViewer';
import Modal from 'Components/Modal/Modal';
import Form from 'Components/Form/Form';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';
import DialogType from 'Types/renderer/dialog';
import FolderType from 'Types/shared/handler/FolderType';
import TableName from 'Types/shared/handler/TableName.js';
import COMPANY_DOCUMENT from 'Schemas/CompanyDocumentSchema';
import EMPLOYEE_BY_DOCUMENT from 'Schemas/EmployeeByDocumentSchema';

export default function CompanyDocument() {
    const { id, documentId } = useParams();
    const [data, setData] = useState(null);

    const empKeys = keys(TableName.EMPLOYEE);
    const docKeys = keys(TableName.DOCUMENT);
    const ebdKeys = keys(TableName.EMPLOYEEBYDOCUMENT);

    useEffect(() => {
        const loadData = async () => {
            const doc = await db[docKeys.GETONE](documentId);
            setData({ name: doc.name });
        };
        loadData();
    }, [documentId, docKeys]);

    const handleUpdate = async (data) => {
        const doc = await db[docKeys.GETONE](documentId);
        const employeesByDocument = await handleAllEBD();
        const groupData = {};
        const memberData = {};

        if (doc.name !== data.name) {
            doc.name = data.name;
            await db[docKeys.UPDATE](doc);
        }

        Object.entries(data).forEach(([key, value]) => {
            if (key.startsWith('group-') || key.startsWith('member-')) {
                const [_, id, field] = key.split('-');

                if (key.startsWith('group-')) {
                    if (!groupData[id]) groupData[id] = {};
                    groupData[id][field] = value;
                }
                if (key.startsWith('member-')) {
                    if (!memberData[id]) memberData[id] = {};
                    memberData[id][field] = value;
                }
            }
        });

        /*for (const [id, g] of Object.entries(groupData)) {
            await dbAPI.updateGroup(id, documentId, g);
        }*/

        for (const [id, data] of Object.entries(memberData)) {
            const ebd = employeesByDocument.find(ebd => ebd.employeeId === parseInt(id));
            if (ebd && ebd.date !== data.date) {
                ebd.date = data.date || null;
                await db[ebdKeys.UPDATE](ebd);
            } else await db[ebdKeys.INSERT](id, documentId, data.date || null);
        }

        employeesByDocument.forEach(async (ebd) => {
            if (!memberData[ebd.employeeId]) await db[ebdKeys.DELETE](ebd.id);
        });

        Dialog('Información', 'Documento actualizado correctamente.', DialogType.INFO);
    }

    const handleAllEmployees = async () => { return await db[empKeys.GETALL](); }
    const handleAllEBD = async () => { return await dbAPI[ebdKeys.GETALL](documentId); }

    return (
        <TemplateBase
            title={['Docmaen', 'Empresas', 'Documento']}
            backNav={`/company/${id}`}
            options={
                <>
                    <Modal
                        title='Nuevo documento'
                        textButtonOpen='Editar Grupos'
                        typeButton={ButtonType.SECONDARY}
                    >
                        {({ close }) => (
                            <Form
                                columns={COMPANY_DOCUMENT}
                                data={data}
                                selectColumns={EMPLOYEE_BY_DOCUMENT}
                                selectData={handleAllEmployees}
                                selectDataSave={handleAllEBD}
                                dbAction={handleUpdate}
                                embedded={true}
                                onSubmitSuccess={close}
                            />
                        )}
                    </Modal>
                    <Button type={ButtonType.PRIMARY} nav={`/company/${id}/${documentId}/edit`}>Editar Documento</Button>
                </>
            }
        >
            <PdfViewer fileUrl={GetPdf(FolderType.DOCUMENTS, id, documentId)} showOptions={true} />
        </TemplateBase>
    );
}