import newSchema from 'Schemas/BaseSchema';

const PROFILE = newSchema([
    {
        key: 'nif',
        name: 'NIF',
        required: true,
        showVariable: false,
    },
    {
        key: 'name',
        name: 'Nombre',
        pattern: '^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)*$',
        required: true,
    },
    {
        key: 'telephone',
        name: 'Teléfono',
    },
]);

export default PROFILE;
