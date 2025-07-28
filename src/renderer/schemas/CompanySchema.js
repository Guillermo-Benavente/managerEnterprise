/*
//[{ 'nif': '','nombre': '','teléfono': '','email': '','domicilio fiscal':''}];
export const COMPANY = { 
    'nif': {
        'name':'nif',
        'type':'string',
        'showForm':true,
        'showTable':true,
        'requireForm':true,
        'checkForm': '^\\d{8}[A-HJ-NP-TV-Z]$'
    },
    'name': {
        'name':'nombre',
        'type':'string',
        'showForm':true,
        'showTable':true,
        'requireForm':true,
        'checkForm': '^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)*$'
    },
    'telephone': {
        'name':'teléfono',
        'type':'string',
        'showForm':true,
        'showTable':true
    },
    'registration_date':{
        'name':'fecha de registro',
        'type':'date',
        'showForm':true,
        'showTable':true
    }
};
*/
import newField from 'Schemas/BaseSchema';

const COMPANY = [
    newField({
        key: 'nif',
        name: 'NIF',
        identifier: true,
        required: true,
    }),
    newField({
        key: 'name',
        name: 'Nombre',
        required: true,
    }),
    newField({
        key: 'telephone',
        name: 'Teléfono',
    }),
    newField({
        key: 'registration_date',
        name: 'Fecha de Registro',
        type: 'date',
    }),
]

export default COMPANY;