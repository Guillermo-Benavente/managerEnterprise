/*export const COURSE = {
    'id': {
        'name':'id',
        'type':'string',
        'showTable':false
    },
    'name':{
        'name':'nombre',
        'type':'string',
        'showTable':true
    },
    'employee':{
        'name':'empleado',
        'type':'string',
        'refrence':true,
        'showTable':false
    },
    'url':{
        'name':'dirección',
        'type':'string',
        'showTable':false
    }
}*/
import newField from 'Schemas/BaseSchema';

const EMPLOYEE_DOCUMENT = [
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
        key: 'employee',
        name: 'Empleado',
        reference: true,
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

export default EMPLOYEE_DOCUMENT;