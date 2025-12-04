import newSchema from 'Schemas/BaseSchema';

const DOCUMENT_PROFILE = newSchema([
    {
        key: 'document',
        name: 'Documento',
        reference: true,
        showTable: false,
        showForm: false,
    },
    {
        key: 'profile',
        name: 'Perfil',
        reference: true,
        showTable: false,
        showForm: false,
    }
]);

export default DOCUMENT_PROFILE;