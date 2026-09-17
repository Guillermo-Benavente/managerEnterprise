/*
//[{ 'nif': '','nombre': '','teléfono': '','email': '','domicilio fiscal':''}];
*/
import newSchema from 'Schemas/BaseSchema';

const COMPANY = newSchema([
    {
        key: 'nif',
        name: 'NIF',
        required: true,
    },
    {
        key: 'name',
        name: 'Nombre',
        required: true,
    },
    {
        key: 'telephone',
        name: 'Teléfono',
    },
    {
        key: 'registration_date',
        name: 'Fecha de Registro',
        type: 'date',
        showVariable: false,
    },
]);

export default COMPANY;