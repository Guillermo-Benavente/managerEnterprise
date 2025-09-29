import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetPdf } from 'Api/util';
import db, { keys } from 'Api/db';
import TemplateBase from 'Components/TemplateBase/TemplateBase';
import PdfViewer from 'Components/PDFViewer/PDFViewer';
import FolderType from 'Types/shared/handler/FolderType';
import TableName from 'Types/shared/handler/TableName.js';

export default function EmployeeDocument() {
    const { id, documentId } = useParams();
    const [fileName, setfileName] = useState(null);

    const docKeys = keys(TableName.DOCUMENT);

    useEffect(() => {
        if (documentId) {
            (async () => {
                const document = await db[docKeys.GETONE](documentId);
                const filePath = document.url;
                const fileName = filePath.split("\\").pop().replace(/\.pdf$/, '');
                setfileName(fileName);
            })();
        }
    }, [documentId]);

    return (
        <TemplateBase
            title={['Docmaen', 'Empleados', 'Editar', 'Documento']}
            backNav={`/employee/${id}`}
        >
            <PdfViewer fileUrl={GetPdf(FolderType.EMPLOYEES, id, fileName)} />
        </TemplateBase>
    );
}