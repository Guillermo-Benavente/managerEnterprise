import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import db, { keys } from 'Api/db';
import { ConvertHTMLToPDF } from 'Api/util';
import { Dialog } from 'Api/control';
import TemplateBase from 'Components/TemplateBase/TemplateBase';
import Editor from 'Components/Editor/Editor';
import Modal from 'Components/Modal/Modal';
import Form from 'Components/Form/Form';
import DialogType from 'Types/renderer/dialog';
import TableName from 'Types/shared/handler/TableName.js';
import FolderType from 'Types/shared/handler/FolderType';
import DOCUMENT from 'Schemas/DocumentSchema';
import COMPANY from 'Schemas/CompanySchema';
import DOCUMENT_EMPLOYEE from 'Schemas/DocumentEmployeeSchema';
import PROFILE from 'Schemas/ProfileSchema';

export default function ProfileCreateDocument() {
    const { id } = useParams();
    const navigate = useNavigate();

    const editorRef = useRef(null);
    const empKeys = keys(TableName.EMPLOYEE);
    const docKeys = keys(TableName.DOCUMENT);
    const docEmpKeys = keys(TableName.DOCUMENTEMPLOYEE);

    const handleInsert = async (data) => {
        if (editorRef.current) {
            const html = editorRef.current.getHTML();
            const pdfBuffer = await ConvertHTMLToPDF(html);

            let document = {
                name: data.name,
                content: html,
                data: pdfBuffer
            };

            const documentId = await db[docKeys.INSERT](id, document, FolderType.PROFILES);
            const groupData = {};
            const memberData = {};

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
            for (const [id, data] of Object.entries(memberData))
                await db[docEmpKeys.INSERT]({ document: documentId, employee: id, date: data.date || null });

            navigate(`/profile`);
            setTimeout(() => {
                Dialog('Información', 'Documento añadido correctamente.', DialogType.INFO);
            }, 100);
        }
    }

    const handleAllData = async () => { return await db[empKeys.GETALL](); }

    return (
        <TemplateBase
            title={['Docmaen', 'Perfil', 'Documento', 'Nuevo']}
            backNav={`/profile`}
            question={true}
        >
            <Editor
                onReady={(editor) => (editorRef.current = editor)}
                variableMenu={[
                    ['Empresas', 'red', COMPANY],
                    ['Empleados', 'blue', DOCUMENT_EMPLOYEE],
                    ['Perfil', 'purple', PROFILE]
                ]}
            >
                <Modal title='Nuevo documento' textButtonOpen='Guardar'>
                    {({ close }) => (
                        <Form
                            columns={DOCUMENT}
                            selectColumns={DOCUMENT_EMPLOYEE}
                            selectData={handleAllData}
                            dbAction={handleInsert}
                            embedded={true}
                            onSubmitSuccess={close}
                        />
                    )}
                </Modal>
            </Editor>
        </TemplateBase>
    );
}