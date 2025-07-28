/*const EMPLOYEE = {
    'dni': {
        'name':'dni',
        'type':'text',
        'identifier':true,
        'showForm':true,
        'showTable':true,
        'requireForm':true,
        'checkForm': '^\\d{8}[A-HJ-NP-TV-Z]$'
    },
    'name': {
        'name':'nombre',
        'type':'text',
        'showForm':true,
        'showTable':true,
        'showFormSelectorText':true,
        'requireForm':true,
        'checkForm': '^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)*$'
    },
    'surnames': {
        'name':'apellidos',
        'type':'text',
        'showForm':true,
        'showTable':true,
        'showFormSelectorText':true,
        'requireForm':true,
        'checkForm': '^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)?$'
    },
    'discharge_date': {
        'name':'alta',
        'type':'date',
        'showForm':true,
        'showTable':true,
        'requireForm':true
    },
    'leave_date': {
        'name':'baja',
        'type':'date',
        'showTable':true
    },
    'medical_leave_date': {
        'name':'alta médica',
        'type':'date',
        'showTable':true
    },
    'medical_discharge_date': {
        'name':'baja médica',
        'type':'date',
        'showTable':true
    },
    'dni_date': {
        'name':'validez del dni',
        'type':'date',
        'showForm':true,
        'showTable':true,
        'showFormSelectorState':true
    },
    'courses': {
        'name':'cursos',
        'type':'file',
        'accept':'.pdf',
        'showForm':true,
        'showTable':false
    }
}*/
import newField from 'Schemas/BaseSchema';

const EMPLOYEE = [
    newField({
        key: 'dni',
        name: 'DNI',
        identifier: true,
        pattern: '^\\d{8}[A-HJ-NP-TV-Z]$',
        required: true,
    }),
    newField({
        key: 'name',
        name: 'Nombre',
        pattern: '^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)*$',
        required: true,
    }),
    newField({
        key: 'surnames',
        name: 'Apellidos',
        pattern: '^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)?$',
        required: true,
    }),
    newField({
        key: 'discharge_date',
        name: 'Fecha de alta',
        type: 'date',
        showTable: false,
        required: true,
    }),
    newField({
        key: 'leave_date',
        name: 'Fecha de baja',
        type: 'date',
        showTable: false,
        showForm: false,
    }),
    newField({
        key: 'medical_leave_date',
        name: 'Fecha de alta médica',
        type: 'date',
        showTable: false,
        showForm: false,
    }),
    newField({
        key: 'medical_discharge_date',
        name: 'Fecha de baja médica',
        type: 'date',
        showTable: false,
        showForm: false,
    }),
    newField({
        key: 'dni_date',
        name: 'Validez del DNI',
        type: 'date',
        showTable: false,
        required: true,
    }),
    /*newField({
        key: 'courses',
        name: 'Cursos',
        type: 'file',
        showTable: false,
        accept: '.pdf',
    }),*/
]

export default EMPLOYEE;