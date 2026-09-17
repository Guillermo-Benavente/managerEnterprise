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
  INSERTALL:  IpcChannel.INSERTALL  + table,
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
    api[k.INSERTALL] = (...args) => responseDb(k.INSERTALL, args);
    api[k.INSERT] = (...args) => responseDb(k.INSERT, args);
    api[k.UPDATE] = payload   => responseDb(k.UPDATE, [payload]);
    api[k.DELETE] = id        => responseDb(k.DELETE, [id]);
  });

  return api;
}

const db = makeDbApi();

export default db;