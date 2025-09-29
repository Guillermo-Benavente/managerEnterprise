import newSchema from 'Schemas/BaseSchema';

const DOCUMENT_EMPLOYEE = newSchema([
    {
        key: 'document',
        name: 'Documento',
        reference: true,
        showTable: false,
        showForm: false,
        showVariable: false,
    },
    {
        key: 'employee',
        name: 'Empleado',
        reference: true,
        showTable: false,
        showForm: false,
    },
    {
        key: 'date',
        name: 'Fecha',
        type: 'date',
        showTable: false,
        showForm: false,
    },
    {
        key: 'documents',
        name: 'Documentos',
        type: 'file',
        showTable: false,
        showEdit: false,
        accept: '.pdf',
        ignoreInMapper: true,
        showVariable: false,
    }
]);

export default DOCUMENT_EMPLOYEE;