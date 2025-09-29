import newSchema from 'Schemas/BaseSchema';

const DOCUMENT = newSchema([
    {
        key: 'name',
        name: 'Nombre',
        pattern: '^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)*$',
        required: true,
        showVariable: false,
    },
    {
        key: 'content',
        name: 'Contenido',
        type: 'json',
        showTable: false,
        showForm: false,
        showVariable: false,
    },
    {
        key: 'url',
        name: 'Dirección',
        showTable: false,
        showForm: false,
        showVariable: false,
    },
]);

export default DOCUMENT;