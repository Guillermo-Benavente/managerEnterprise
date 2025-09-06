import { useParams } from 'react-router-dom';
import { GetPdf } from 'Api/util';
import TemplateBase from 'Components/TemplateBase/TemplateBase';
import PdfViewer from 'Components/PDFViewer/PDFViewer';
import FolderType from 'Types/shared/handler/FolderType';

export default function EmployeeDocument() {
    const { id, documentId } = useParams();

    return (
        <TemplateBase
            title={['Docmaen', 'Empleados', 'Editar', 'Documento']}
            backNav={`/employee/${id}`}
        >
            <PdfViewer fileUrl={GetPdf(FolderType.COURSES, id, documentId)} />
        </TemplateBase>
    );
}