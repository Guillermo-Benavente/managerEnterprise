/*
export const PROFILE = { 
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
    }
};
*/
import newField from 'Schemas/BaseSchema';

const PROFILE = [
    newField({
        key: 'nif',
        name: 'NIF',
        identifier: true,
        required: true,
        showVariable: false,
    }),
    newField({
        key: 'name',
        name: 'Nombre',
        pattern: '^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)*$',
        required: true,
    }),
    newField({
        key: 'telephone',
        name: 'Teléfono',
    }),
]

export default PROFILE;
