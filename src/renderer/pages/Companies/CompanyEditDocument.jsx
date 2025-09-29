import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import db, { keys } from 'Api/db';
import { ConvertHTMLToPDF } from 'Api/util';
import { Dialog } from 'Api/control';
import TemplateBase from 'Components/TemplateBase/TemplateBase';
import Editor from 'Components/Editor/Editor';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';
import DialogType from 'Types/renderer/dialog';
import TableName from 'Types/shared/handler/TableName.js';
import EntryPointsType from 'Types/shared/entryPoints';
import DOCUMENT from 'Schemas/DocumentSchema';
import DOCUMENT_EMPLOYEE from 'Schemas/DocumentEmployeeSchema';
import PROFILE from 'Schemas/ProfileSchema';

export default function CompanyEditDocument() {
    const { id, documentId } = useParams();
    const navigate = useNavigate();

    const editorRef = useRef(null);
    const empKeys = keys(TableName.EMPLOYEE);
    const docKeys = keys(TableName.DOCUMENT);

    const handleUpdate = async () => {
        if (editorRef.current) {
            const doc = await db[docKeys.GETONE](documentId);
            const html = editorRef.current.getHTML();
            const pdfBuffer = await ConvertHTMLToPDF(html);

            const document = {
                id: documentId,
                name: doc.name,
                content: html,
                url: doc.url,
                data: pdfBuffer
            };

            await db[docKeys.UPDATE](document);

            navigate(`/company/${id}/${documentId}`);
            setTimeout(() => {
                Dialog('Información', 'Documento actualizado correctamente.', DialogType.INFO);
            }, 100);
        }
    }
    const handleData = async () => {
        const doc = await db[docKeys.GETONE](documentId);
        return doc.content;
    }

    return (
        <TemplateBase
            title={['Docmaen', 'Empresas', 'Documento', 'Editar']}
            backNav={`/company/${id}/${documentId}`}
            question={true}
        >
            <Editor
                titleSave={'Nuevo documento'}
                content={handleData}
                onReady={(editor) => (editorRef.current = editor)}
                variableMenu={[
                    ['Empresas', 'red', DOCUMENT],
                    ['Empleados', 'blue', DOCUMENT_EMPLOYEE],
                    ['Perfil', 'purple', PROFILE]
                ]}
            >
                <Button type={ButtonType.PRIMARY} event={handleUpdate}>Guardar</Button>
            </Editor>
        </TemplateBase>
    );
}