import IpcChannel from 'Types/handler/IpcChannel';
import TableName from 'Types/handler/TableName';

export const EMPLOYEE = {
    'dni': {
        'name':'dni',
        'type':'text',
        'identifier':true,
        'showForm':true,
        'showTable':true
    },
    'name': {
        'name':'nombre',
        'type':'text',
        'showForm':true,
        'showTable':true,
        'showFormSelectorText':true
    },
    'surnames': {
        'name':'apellidos',
        'type':'text',
        'showForm':true,
        'showTable':true,
        'showFormSelectorText':true
    },
    'discharge_date': {
        'name':'alta',
        'type':'date',
        'showForm':true,
        'showTable':true
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
}

//[{ 'nif': '','nombre': '','teléfono': '','email': '','domicilio fiscal':''}];
export const COMPANY = { 
    'nif': {
        'name':'nif',
        'type':'string',
        'showForm':true,
        'showTable':true
    },
    'name': {
        'name':'nombre',
        'type':'string',
        'showForm':true,
        'showTable':true
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

export const COURSES = {
    'courses': {
        'name':'cursos',
        'type':'file',
        'accept':'.pdf',
        'showForm':true
    }
}

export const COURSE = {
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
}

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
        'showTable':true
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

//TOOD crear comentarios
async function responseDb(apiMethod, params = []) {
  try {
    return await window.dbAPI[apiMethod](...params);
  } catch (error) {
    console.error(`Error en ${apiMethod}:`, error);
    throw error;
  }
}

export const keys = table => ({
  GETALL:  IpcChannel.GETALL  + table,
  GETONE:  IpcChannel.GETONE  + table,
  INSERT:  IpcChannel.INSERT  + table,
  UPDATE:  IpcChannel.UPDATE  + table,
  DELETE:  IpcChannel.DELETE  + table,
});

const makeDbApi = () => {
  const api = {};

  Object.values(TableName).forEach(table => {
    const k = keys(table);
    api[k.GETALL] = id        => responseDb(k.GETALL, id != null ? [id] : []);
    api[k.GETONE] = id        => responseDb(k.GETONE, [id]);
    api[k.INSERT] = (...args) => responseDb(k.INSERT, args);
    api[k.UPDATE] = payload   => responseDb(k.UPDATE, [payload]);
    api[k.DELETE] = id        => responseDb(k.DELETE, [id]);
  });

  return api;
}

async function SetEmployee(employee) {
  try {
    const courses = employee.courses;
    employee.courses = courses.length;

    await responseDb(IpcChannel.INSERT + TableName.EMPLOYEE, [employee]);
    await responseDb(IpcChannel.INSERT + TableName.COURSE,   [employee.dni, courses]);

    return true;
  } catch (err) {
    console.error('Error en SetEmployee:', err);
    return false;
  }
}

const dbAPI = makeDbApi();
dbAPI[keys(TableName.EMPLOYEE).INSERT] = SetEmployee;

export default dbAPI;