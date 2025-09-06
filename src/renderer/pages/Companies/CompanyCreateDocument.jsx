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
import EntryPointsType from 'Types/shared/entryPoints';
import COMPANY_DOCUMENT from 'Schemas/CompanyDocumentSchema';
import EMPLOYEE_BY_DOCUMENT from 'Schemas/EmployeeByDocumentSchema';
import PROFILE from 'Schemas/ProfileSchema';

export default function CompanyCreateDocument() {
    const { id } = useParams();
    const navigate = useNavigate();

    const editorRef = useRef(null);
    const empKeys = keys(TableName.EMPLOYEE);
    const docKeys = keys(TableName.DOCUMENT);
    const ebdKeys = keys(TableName.EMPLOYEEBYDOCUMENT);

    const handleInsert = async (data) => {
        if (editorRef.current) {
            const html = editorRef.current.getHTML();
            const pdfBuffer = await ConvertHTMLToPDF(html);

            let document = {
                name: data.name,
                content: html,
                buffer: pdfBuffer
            };

            const items = await db[docKeys.INSERT](id, [document], EntryPointsType.EDIT_COMPANY);
            const groupData = {};
            const memberData = {};

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
            
            for (const [id, data] of Object.entries(memberData))
                await db[ebdKeys.INSERT](id, items[0], data.date || null);

            navigate(`/company/${id}`);
            setTimeout(() => {
                Dialog('Información', 'Documento añadido correctamente.', DialogType.INFO);
            }, 100);
        }
    }

    const handleAllData = async () => { return await db[empKeys.GETALL](); }

    return (
        <TemplateBase
            title={['Docmaen', 'Empresas', 'Documento', 'Nuevo']}
            backNav={`/company/${id}`}
            question={true}
        >
            <Editor
                onReady={(editor) => (editorRef.current = editor)}
                variableMenu={[
                    ['Empresas', 'red', COMPANY_DOCUMENT],
                    ['Empleados', 'blue', EMPLOYEE_BY_DOCUMENT],
                    ['Perfil', 'purple', PROFILE]
                ]}
            >
                <Modal title='Nuevo documento' textButtonOpen='Guardar'>
                    {({ close }) => (
                        <Form
                            columns={COMPANY_DOCUMENT}
                            selectColumns={EMPLOYEE_BY_DOCUMENT}
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