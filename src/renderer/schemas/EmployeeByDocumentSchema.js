/*
export const DOCUMENTBYEMPLOYEES = {
    'id': {
        'name':'id',
        'type':'string'
    },
    'employee':{
        'name':'empleado',
        'type':'string',
        'refrence':true
    },
    'document':{
        'name':'documento',
        'type':'string',
        'refrence':true
    },
    'date':{
        'name':'fecha',
        'type':'date',
        'showForm':true
    }
}
*/
import newField from 'Schemas/BaseSchema';

const EMPLOYEE_BY_DOCUMENT = [
    newField({
        key: 'id',
        name: 'ID',
        identifier: true,
        showTable: false,
        showForm: false,
        showVariable: false,
    }),
    newField({
        key: 'employee',
        name: 'Empleado',
        reference: true,
        showTable: false,
        showForm: false,
    }),
    newField({
        key: 'document',
        name: 'Documento',
        reference: true,
        showTable: false,
        showForm: false,
        showVariable: false,
    }),
    newField({
        key: 'date',
        name: 'Fecha',
        type: 'date',
        showTable: false,
    }),
]

export default EMPLOYEE_BY_DOCUMENT;
