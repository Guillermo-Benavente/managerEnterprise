/*
export const DOCUMENT = {
    'id': {
        'name':'id',
        'type':'string',
        'showTable':false
    },
    'name':{
        'name':'nombre',
        'type':'string',
        'showForm':true,
        'showTable':true,
        'requireForm':true
    },
    'company':{
        'name':'empresa',
        'type':'string',
        'refrence':true,
        'showTable':false
    },
    'content':{
        'name':'contenido',
        'type':'string',
        'showTable':false
    },
    'url':{
        'name':'dirección',
        'type':'string',
        'showTable':false
    }
}
*/
import newField from 'Schemas/BaseSchema';

const COMPANY_DOCUMENT = [
    newField({
        key: 'id',
        name: 'ID',
        identifier: true,
        showTable: false,
        showForm: false,
    }),
    newField({
        key: 'name',
        name: 'Nombre',
        pattern: '^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)*$',
        showForm: false,
    }),
    newField({
        key: 'company',
        name: 'Empresa',
        reference: true,
        showTable: false,
        showForm: false,
    }),
    newField({
        key: 'content',
        name: 'Contenido',
        showTable: false,
        showForm: false,
    }),
    newField({
        key: 'url',
        name: 'Dirección',
        type: 'date',
        showTable: false,
        showForm: false,
    }),
    newField({
        key: 'courses',
        name: 'Cursos',
        type: 'file',
        showTable: false,
        accept: '.pdf',
        required: true,
    }),
]

export default COMPANY_DOCUMENT;
