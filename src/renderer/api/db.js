import IpcChannel from 'Types/shared/handler/IpcChannel.js';
import TableName from 'Types/shared/handler/TableName.js';

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

const db = makeDbApi();
db[keys(TableName.EMPLOYEE).INSERT] = SetEmployee;

export default db;