import { contextBridge, ipcRenderer } from 'electron';
import IpcChannel from './types/handler/IpcChannel.js';
import TableName from './types/handler/TableName.js';
import IpcRendererType from './types/handler/IpcRendererType.js';

let server = null;
ipcRenderer.invoke(IpcChannel.GET_SERVER).then(serverUrl => { server = serverUrl; });

const Renderer = (type) => (channel) => (...args) => {
  if (type === IpcRendererType.ON) ipcRenderer.on(channel, (_, data) => args[0](data)); 
  else return ipcRenderer[type](channel, ...args);
};
const invoke = Renderer(IpcRendererType.INVOKE);
const send = Renderer(IpcRendererType.SEND);
const on = Renderer(IpcRendererType.ON);

const dbActions = [
  IpcChannel.GETALL, 
  IpcChannel.GETONE,
  IpcChannel.INSERT,
  IpcChannel.UPDATE,
  IpcChannel.DELETE
];

const dbMethods = Object.values(TableName).reduce((methods, tableName) => {
  dbActions.forEach((action) => methods[action+tableName] = invoke(`${action}-${tableName}`));
  return methods;
}, {});

contextBridge.exposeInMainWorld('dbAPI', dbMethods);

contextBridge.exposeInMainWorld('utilAPI', {
  modifySvgColor: invoke(IpcChannel.SVG_MODIFY),
});

contextBridge.exposeInMainWorld('controlAPI', {
  dom: (callback) => document.addEventListener('DOMContentLoaded', callback),
  navigate: send(IpcChannel.NAVIGATE),
  modalWindow: send(IpcChannel.MODAL),
  onModalResponse: on(IpcChannel.MODAL_RESPONSE),
  sendModalResponse: send(IpcChannel.MODAL_SEND),
  dialogWindow: send(IpcChannel.DIALOG),
  onDialogResponse: on(IpcChannel.DIALOG_RESPONSE),
  saveDialog: invoke(IpcChannel.DIALOG_SAVE),
  openDialog: invoke(IpcChannel.DIALOG_OPEN),
  saveFile: invoke(IpcChannel.FILE_SAVE),
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