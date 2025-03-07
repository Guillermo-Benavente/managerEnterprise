import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('dbAPI', {
  /// TABLE METHODS EMPLOYED ///
  getEmployees: () => ipcRenderer.invoke('get-employees'),
  getEmployee: (dni) => ipcRenderer.invoke('get-employee', dni),
  insertEmployee: (employee) => ipcRenderer.invoke('insert-employee', employee),
  updateEmployee: (employee) => ipcRenderer.invoke('update-employee', employee),
  deleteEmployee: (dni) => ipcRenderer.invoke('delete-employee', dni),

  /// TABLE METHODS COMPANY ///
  getCompanies: () => ipcRenderer.invoke('get-companies'),
  getCompany: (nif) => ipcRenderer.invoke('get-company', nif),
  insertCompany: (company) => ipcRenderer.invoke('insert-company', company),
  updateCompany: (company) => ipcRenderer.invoke('update-company', company),
  deleteCompany: (nif) => ipcRenderer.invoke('delete-company', nif),

  /// TABLE METHODS COURSES ///
  getCourses: (dni) => ipcRenderer.invoke('get-courses', dni),
  insertCourses: (dni, courses) => ipcRenderer.invoke('insert-courses', dni, courses),

  /// TABLE METHODS DOCUMENTS ///
  getDocuments: (nif) => ipcRenderer.invoke('get-documets', nif),
  insertDocuments: (nif, documents) => ipcRenderer.invoke('insert-documents', nif, documents),
});

contextBridge.exposeInMainWorld('utilAPI', {
  modifySvgColor: (url, color) => ipcRenderer.invoke('modify-svg', url, color),
});

contextBridge.exposeInMainWorld('controlAPI', {
  dom: (callback) => document.addEventListener('DOMContentLoaded', callback),
  navigate: (page, attr) => ipcRenderer.send('navigate', page, attr),
  close: () => ipcRenderer.send('close-window'),
  modalWindow: (page, attr) => ipcRenderer.send('modal-window', page, attr),
  onModalResponse: (callback) => ipcRenderer.on('modal-response', (_, response) => callback(response)),
  sendModalResponse: (response) => ipcRenderer.send('modal-send', response),
  dialogWindow: (type, title, message) => ipcRenderer.send('dialog-window', type, title, message),
  onDialogResponse: (callback) => ipcRenderer.on('dialog-response', (_, response) => callback(response)),
  addEvent: (selector = document.defaultView, type, callback) => {
    if (selector == null) window.addEventListener(type, callback);
    else {
      const element = GetElement(selector);
      element.addEventListener(type, callback);
    }
  },
  getElement: (selector) => GetElement(selector),
  createElement: (tag, attributes = {}, content = '') => {
    const element = document.createElement(tag);

    for (let key in attributes) 
        if (attributes.hasOwnProperty(key)) 
          element.setAttribute(key, attributes[key]);
        
    if (typeof content === 'string') element.textContent = content;
    else if (content instanceof HTMLElement) element.appendChild(content);

    return element;
  },
  addElement: (children, parent = document.body) => { 
    if (Array.isArray(children)) children.forEach(child => parent.appendChild(child));
    else parent.appendChild(children);
    return parent; 
  },
  removeElement: (child, parent = document.body) => parent.removeChild(child),
});

function GetElement(selector) {
  const element = document.querySelector(selector);
  if (!element) throw new Error(`El elemento con el selector "${selector}" no se encontró en el DOM.`);
  return element;
}

