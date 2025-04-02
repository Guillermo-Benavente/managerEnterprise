import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('dbAPI', {
  /// TABLE METHODS EMPLOYEE ///
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
  deleteDocument: (id) => ipcRenderer.invoke('delete-document', id),

  /// TABLE METHODS EMPLOYEEBYDOCUMENT///
  insertEmployeeByDocument: (employee, document, date) => ipcRenderer.invoke('insert-employee-document', employee, document, date),
});

contextBridge.exposeInMainWorld('utilAPI', {
  modifySvgColor: (url, color) => ipcRenderer.invoke('modify-svg', url, color),
});

contextBridge.exposeInMainWorld('controlAPI', {
  dom: (callback) => document.addEventListener('DOMContentLoaded', callback),
  navigate: (page, attr) => ipcRenderer.send('navigate', page, attr),
  modalWindow: (page, attr) => ipcRenderer.send('modal-window', page, attr),
  onModalResponse: (callback) => ipcRenderer.on('modal-response', (_, response) => callback(response)),
  sendModalResponse: (response) => ipcRenderer.send('modal-send', response),
  dialogWindow: (type, title, message) => ipcRenderer.send('dialog-window', type, title, message),
  onDialogResponse: (callback) => ipcRenderer.on('dialog-response', (_, response) => callback(response)),
  getPdf: (type, user, name) => ipcRenderer.invoke('get-pdf', type, user, name),
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