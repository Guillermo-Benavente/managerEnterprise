import newSchema from 'Schemas/BaseSchema';

const EMPLOYEE = newSchema([
    {
        key: 'dni',
        name: 'DNI',
        pattern: '^\\d{8}[A-HJ-NP-TV-Z]$',
        required: true,
    },
    {
        key: 'name',
        name: 'Nombre',
        pattern: '^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)*$',
        required: true,
    },
    {
        key: 'surnames',
        name: 'Apellidos',
        pattern: '^[A-ZÁÉÍÓÚÑa-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑa-záéíóúñ]+)?$',
        required: true,
    },
    {
        key: 'discharge_date',
        name: 'Fecha de alta',
        type: 'date',
        showTable: false,
        required: true,
    },
    {
        key: 'leave_date',
        name: 'Fecha de baja',
        type: 'date',
        showTable: false,
        showForm: false,
    },
    {
        key: 'medical_leave_date',
        name: 'Fecha de alta médica',
        type: 'date',
        showTable: false,
        showForm: false,
    },
    {
        key: 'medical_discharge_date',
        name: 'Fecha de baja médica',
        type: 'date',
        showTable: false,
        showForm: false,
    },
    {
        key: 'dni_date',
        name: 'Validez del DNI',
        type: 'date',
        showTable: false,
        required: true,
    },
    {
        key: 'documents',
        name: 'Documentos',
        type: 'file',
        showTable: false,
        showEdit: false,
        accept: '.pdf',
    }
]);

export default EMPLOYEE;