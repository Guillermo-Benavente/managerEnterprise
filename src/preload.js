import { contextBridge } from 'electron';
import ipc from './main/ipc';
import IpcChannel from './types/handler/IpcChannel.js';
import TableName from './types/handler/TableName.js';

let server = null;
ipc.invoke(IpcChannel.GET_SERVER)().then(serverUrl => { server = serverUrl; });

const dbActions = [
  IpcChannel.GETALL, 
  IpcChannel.GETONE,
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
});

contextBridge.exposeInMainWorld('controlAPI', {
  dom: (callback) => document.addEventListener('DOMContentLoaded', callback),
  navigate: ipc.send(IpcChannel.NAVIGATE),
  modalWindow: ipc.send(IpcChannel.MODAL),
  onModalResponse: ipc.on(IpcChannel.MODAL_RESPONSE),
  sendModalResponse: ipc.send(IpcChannel.MODAL_SEND),
  dialogWindow: ipc.send(IpcChannel.DIALOG),
  onDialogResponse: ipc.on(IpcChannel.DIALOG_RESPONSE),
  saveDialog: ipc.invoke(IpcChannel.DIALOG_SAVE),
  openDialog: ipc.invoke(IpcChannel.DIALOG_OPEN),
  saveFile: ipc.invoke(IpcChannel.FILE_SAVE),
  getPdfUrl: (type, user, name) => `${server}/pdf/${type}/${user}/${name}`,
  addEvent: function (selector = document.defaultView, type, callback) {
    if (selector == null) window.addEventListener(type, callback);
    else {
      const element = this.getElement(selector);
      element.addEventListener(type, callback);
    }
  },
  getElement: function (selector, element = document) {
    const elementSelected = element.querySelector(selector);
    if (!elementSelected) throw new Error(`El elemento con el selector "${selector}" no se encontró en el DOM.`);
    return elementSelected;
  },
  createElement: function (tag, attributes = {}, content = '') {
    const element = document.createElement(tag);

    for (let key in attributes) 
        if (attributes.hasOwnProperty(key)) 
          element.setAttribute(key, attributes[key]);
        
    if (typeof content === 'string') element.textContent = content;
    else if (content instanceof HTMLElement) this.addElement(content, element);

    return element;
  },
  addElement: function (children, parent = document.body) {
    if (Array.isArray(children)) children.forEach(child => parent.appendChild(child));
    else parent.appendChild(children);
    return parent;
  },
  removeElement: (child, parent = document.body) => parent.removeChild(child),
});