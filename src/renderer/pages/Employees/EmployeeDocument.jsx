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
    //const [folderName, setfolderName] = useState(null);
    //const [fileId, setfileId] = useState(null);

    const docKeys = keys(TableName.DOCUMENT);
    //const docPrfKeys = keys(TableName.DOCUMENTPROFILE);

    useEffect(() => {
        if (documentId) {
            (async () => {
                const document = await db[docKeys.GETONE](documentId);
                const filePath = document.url;
                //const folderName = filePath.split("\\").find(p => p === FolderType.EMPLOYEES || p === FolderType.PROFILES);
                const fileName = filePath.split("\\").pop().replace(/\.pdf$/, '');

                /*if (folderName == FolderType.PROFILES) {
                    const prfdocument = await db[docPrfKeys.GETONE](documentId);
                    setfileId(prfdocument.profile);
                } else setfileId(id);*/
                
                setfileName(fileName);
                //setfolderName(folderName);
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