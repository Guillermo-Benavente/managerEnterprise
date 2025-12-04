import newSchema from 'Schemas/BaseSchema';

const GRUOP_DOCUMENT = newSchema([
    {
        key: 'name',
        name: 'Nombre',
        pattern: '^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)*$',
        required: true,
    },
    {
        key: 'document',
        name: 'Documento',
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
]);

export default GRUOP_DOCUMENT;