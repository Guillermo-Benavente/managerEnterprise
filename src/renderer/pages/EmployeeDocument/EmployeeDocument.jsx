import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import db, { keys } from 'Api/db';
import { Dialog } from 'Api/control';
import { GetPdf } from 'Api/util';
import TableName from 'Types/shared/handler/TableName.js';
import TemplateBase from 'Components/TemplateBase/TemplateBase';
import Modal from 'Components/Modal/Modal';
import Form from 'Components/Form/Form';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';
import DialogType from 'Types/renderer/dialog';
import EMPLOYEE_DOCUMENT from 'Schemas/EmployeeDocumentSchema';
import PdfViewer from 'Components/PDFViewer/PDFViewer';

export default function EmployeeDocument() {
    const { id, documentId } = useParams();

    return (
        <TemplateBase
            title={['Docmaen', 'Empleados', 'Editar', 'Documento']}
            backNav={`/employee/${id}`}
        >
            <PdfViewer fileUrl={GetPdf('courses', id, documentId)} />
        </TemplateBase>
    );
}