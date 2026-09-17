import newSchema from 'Schemas/BaseSchema';

const DOCUMENT_COMPANY = newSchema([
    {
        key: 'document',
        name: 'Documento',
        reference: true,
        showTable: false,
        showForm: false,
    },
    {
        key: 'company',
        name: 'Empresa',
        reference: true,
        showTable: false,
        showForm: false,
    }
]);

export default DOCUMENT_COMPANY;