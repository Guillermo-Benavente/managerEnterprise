import { contextBridge } from 'electron';
import ipc from './main/ipc';
import IpcChannel from './types/shared/handler/IpcChannel.js';
import TableName from './types/shared/handler/TableName.js';

window.addEventListener('DOMContentLoaded', () => {
  if (window.navigator && window.navigator.spellcheck !== undefined) {
    window.navigator.spellcheck = true;
  }
});

let server = null;
ipc.invoke(IpcChannel.GET_SERVER)().then(serverUrl => { server = serverUrl; });

const dbActions = [
  IpcChannel.GETALL, 
  IpcChannel.GETONE,
  IpcChannel.INSERTALL,
  IpcChannel.INSERT,
  IpcChannel.UPDATE,
  IpcChannel.DELETE
];

const dbMethods = Object.values(TableName).reduce((methods, tableName) => {
  dbActions.forEach((action) => methods[action+tableName] = ipc.invoke(`${action}-${tableName}`));
  return methods;
}, {});

contextBridge.exposeInMainWorld('dbAPI', dbMethods);

contextBridge.exposeInMainWorld('utilAPI', {
  formatDate: ipc.invoke(IpcChannel.FORMAT_LOCAL_DATE),
  formatObjectLD: ipc.invoke(IpcChannel.FORMAT_OBJECT_LD),
  exportCSV: ipc.invoke(IpcChannel.EXPORT_CSV),
  convertHTMLToPDF: ipc.invoke(IpcChannel.HTML_TO_PDF),
  getPdfUrl: (type, user, name) => `${server}/pdf/${type}/${user}/${name}`,
});

contextBridge.exposeInMainWorld('controlAPI', {
  modalWindow: ipc.send(IpcChannel.MODAL),
  onModalResponse: ipc.on(IpcChannel.MODAL_RESPONSE),
  sendModalResponse: ipc.send(IpcChannel.MODAL_SEND),
  dialogWindow: ipc.send(IpcChannel.DIALOG),
  onDialogResponse: ipc.on(IpcChannel.DIALOG_RESPONSE),
  saveDialog: ipc.invoke(IpcChannel.DIALOG_SAVE),
  openDialog: ipc.invoke(IpcChannel.DIALOG_OPEN),
  saveFile: ipc.invoke(IpcChannel.FILE_SAVE),
});
