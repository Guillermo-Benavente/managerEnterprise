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
import DOCUMENT from 'Schemas/DocumentSchema';
import DOCUMENT_EMPLOYEE from 'Schemas/DocumentEmployeeSchema';

export default function CompanyDocument() {
    const { id, documentId } = useParams();
    const [data, setData] = useState(null);
    const [fileName, setfileName] = useState(null);

    const empKeys = keys(TableName.EMPLOYEE);
    const docKeys = keys(TableName.DOCUMENT);
    const docEmpKeys = keys(TableName.DOCUMENTEMPLOYEE);

    useEffect(() => {
        const loadData = async () => {
            const document = await db[docKeys.GETONE](documentId);
            const filePath = document.url;
            const fileName = filePath.split("\\").pop().replace(/\.pdf$/, '');
            setData({ name: document.name });
            setfileName(fileName);
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
                const prefixLength = key.startsWith('group-') ? 6 : 7;
                const lastDash = key.lastIndexOf('-');
                const id = key.slice(prefixLength, lastDash);
                const field = key.slice(lastDash + 1);

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
                await db[docEmpKeys.UPDATE](ebd);
            } else await db[docEmpKeys.INSERT]({ document: documentId, employee: id, date: data.date || null });
        }

        employeesByDocument.forEach(async (ebd) => {
            if (!memberData[ebd.employeeId]) await db[docEmpKeys.DELETE](ebd.id);
        });

        Dialog('Información', 'Documento actualizado correctamente.', DialogType.INFO);
    }

    const handleAllEmployees = async () => { return await db[empKeys.GETALL](); }
    const handleAllEBD = async () => { return await dbAPI[docEmpKeys.GETALL](documentId); }

    return (
        <TemplateBase
            title={['Docmaen', 'Empresas', 'Documento']}
            backNav={`/company/${id}`}
            options={
                <>
                    <Modal
                        title='Modificar documento'
                        textButtonOpen='Otras Modificaciones'
                        typeButton={ButtonType.SECONDARY}
                    >
                        {({ close }) => (
                            <Form
                                columns={DOCUMENT}
                                data={data}
                                selectColumns={DOCUMENT_EMPLOYEE}
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
            <PdfViewer fileUrl={GetPdf(FolderType.COMPANIES, id, fileName)} showOptions={true} />
        </TemplateBase>
    );
}