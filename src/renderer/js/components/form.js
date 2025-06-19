import DataTable from 'datatables.net-dt';
import { CreateElement, AddElement, SendModalResponse, Dialog } from 'Components/controlAPI.js';
import FormType from 'Types/form.js';
import DIALOG_TYPE from 'Types/dialog.js';

export default class Fieldset {
    constructor(fieldset, data, type) {
        this.fieldset = fieldset;
        this.data = data;
        this.type = type;
    }

    init() {
        if (this.type === FormType.NORMAL) {
            Object.values(this._createForm(this.data)).forEach((element) => {
                AddElement(element['label'], this.fieldset);
                AddElement(element['input'], this.fieldset);
            });
        } else if(this.type === FormType.SELECTOR) {
            const idTable = this.fieldset.classList[0]+'-selector';
            const table = CreateElement('table', { id: idTable });
            const thead = CreateElement('thead');
            const tbody = CreateElement('tbody');
            const inputs = this._createInputs(this.data['object'][0]);

            const headerRow = CreateElement('tr');
            const th = CreateElement('th', {}, 'Empleados');
            headerRow.appendChild(th);
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const identifiers = Array.isArray(this.data['object']) 
                ? this.data['object'].map(obj => Object.keys(obj).find(key => obj[key].identifier))
                : [this.data['object'].identifier];

            const text = Array.isArray(this.data['object']) 
                ? this.data['object'].map(obj => Object.keys(obj).filter(key => obj[key].showFormSelectorText))
                : [Object.keys(this.data['object']).filter(key => this.data['object'][key].showFormSelectorText)];

            const state = Array.isArray(this.data['object']) 
                ? this.data['object'].map(obj => Object.keys(obj).filter(key => obj[key].showFormSelectorState))
                : [Object.keys(this.data['object']).filter(key => this.data['object'][key].showFormSelectorState)];

            Object.values(this.data['data']).forEach((value) => {
                const id = Object.keys(value).find(key => identifiers.includes(key.identifier));
                const values = Object.keys(value).filter(key => text.flat().includes(key)).map(key => value[key]);
                const conditions = Object.keys(value).filter(key => state.flat().includes(key)).map(key => value[key]);
                const newInputs = Object.values(inputs).map((node) => node.cloneNode(true));
                const inputGroup = this._createSelector(value[id], values.join(' '), conditions[0], newInputs);
                const row = CreateElement('tr');
                const tdCheck = CreateElement('td');

                tdCheck.appendChild(inputGroup);
                row.appendChild(tdCheck);
                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            AddElement(table, this.fieldset);

            return new DataTable('#'+idTable, {
                pageLength: 8,
                language: {
                    search: "Buscar:",
                    lengthMenu: "",
                    info: "Mostrando del _START_ al _END_ de _TOTAL_ registros",
                    infoEmpty: "No hay registros disponibles",
                    infoFiltered: "(filtrado de _MAX_ registros en total)",
                    loadingRecords: "Cargando...",
                    zeroRecords: "No se encontraron resultados",
                    emptyTable: "No hay datos disponibles en la tabla",
                    aria: {
                        sortAscending: ": Activar para ordenar la columna de manera ascendente",
                        sortDescending: ": Activar para ordenar la columna de manera descendente"
                    }
                }
            });
        }
    }
    
    _createInputs(object) {
        let skeleton = {};
        Object.keys(object).filter(key => object[key].showForm).forEach(key => {
            skeleton[key] = this._createInput(object[key], key);
        });
        return skeleton;
    }

    _createSelector(id, text, conditions, inputs) {
        let content;
        const label = CreateElement('label');
        const checkbox = CreateElement('input', { type: 'checkbox', name: id });
        const checkText = CreateElement('span', {title: id}, text);
        let finalInputs;
        const isValidCondition = this._isConditionValid(conditions);
        if(isValidCondition) {
            content = CreateElement('div', { class: 'option' });
            finalInputs = Object.values(inputs).map(input => { input.name = id+input.name; return input; });
        } else {
            content = CreateElement('div', { class: 'option errorCondition' });
            finalInputs = Object.values(inputs).map(input => { 
                input.name = id+input.name;
                input.readOnly = true;
                input.style.userSelect = 'none';
                input.style.pointerEvents = 'none';
                return input;
            });
        }

        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                finalInputs.forEach(() => {
                    const allFilled = finalInputs.every(input => input.value.trim() !== '');
                    if (!allFilled) {
                        event.target.checked = false;
                        if(isValidCondition)
                            Dialog('Advertencia','Por favor, llena todos los campos antes de seleccionarlo.', DIALOG_TYPE.WARNING);
                        else Dialog('Error','Este empleado tiene su información caducada.', DIALOG_TYPE.ERROR);
                    }
                });
            }
        });
        return AddElement([AddElement([checkbox, checkText], label), ...finalInputs], content);
    }

    _isConditionValid(conditions) {
        let valid = false;

        if (conditions) {
            const date = new Date(conditions);
            if (!isNaN(date.getTime())) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                valid = date >= today;
            } else {
                valid = true;
            }
        }

        return valid;
    }

    _createForm(object) {
        let skeleton = {};
        Object.keys(object).filter(key => object[key].showForm).forEach(key => {
            const data = object[key];
            skeleton[key] = {};
            skeleton[key]['label'] = CreateElement('label', { for: key }, data.name.toLowerCase().replace(/./, c => c.toUpperCase()));
            skeleton[key]['input'] = this._createInput(data, key);
        });
        return skeleton;
    }

    _createInput(element, key){
        let finalInput;
        const inputForm = CreateElement('input', { name: key, id: key, type: element.type });

        if (element.checkForm) inputForm.pattern = element.checkForm;
        if(element.requireForm) inputForm.required = true;

        if (element.type == 'file') {
            this.fieldset.form.enctype = 'multipart/form-data';
            inputForm.accept = element.accept;
            inputForm.multiple = true;
            inputForm.style = 'display: none';

            const contentInputFile = CreateElement('label', { for: key, class: 'btn btn-primary' });
            const textInputFile = CreateElement('span', {}, 'Añadir archivos');

            inputForm.addEventListener('change', (event) => {
                const files = event.target.files;
                const text = files.length > 0
                    ? `${files.length} archivo(s)`
                    : 'Añadir archivos';
                textInputFile.textContent = text;
            });

            finalInput = AddElement([textInputFile, inputForm], contentInputFile);
        } else finalInput = inputForm;

        return finalInput;
    }
};

export function SubmitForm(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const values = Object.fromEntries(new FormData(form).entries());

        const fileProcessingPromises = [];

        form.querySelectorAll('input[type="file"]').forEach(input => {
            const filePromises = Array.from(input.files).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    reader.onloadend = () => resolve({name:file.name, data:reader.result.split(',')[1]});
                    reader.onerror = (error) => reject(new Error('Error leyendo archivo'));

                    reader.readAsDataURL(file);
                });
            });
            const processedFilesPromise = Promise.all(filePromises).then((fileContents) => {
                values[input.name] = fileContents;
            });

            fileProcessingPromises.push(processedFilesPromise);
        });

        try {
            await Promise.all(fileProcessingPromises);
            SendModalResponse(values);
            window.close();
        } catch (error) { 
            Dialog('Error', 'No se ha podido añadir los nuevos datos.', DIALOG_TYPE.ERROR);
            console.error('Error al procesar los archivos:', error); 
        }
    });
}

export function CreateForm(data, dataType, onSubmitCallback, confirmText = null) {
    const form = document.createElement('form');
    form.className = 'frm';
    const contentForm = document.createElement('table');

    const confirmForm = document.createElement('input');
    confirmForm.className = 'btn btn-primary';
    confirmForm.type = 'submit';
    confirmForm.value = confirmText ?? 'Guardar';

    Object.entries(data).forEach(([key, value]) => {
        
        const row = document.createElement('tr');
        const contentLabel = document.createElement('td');
        const contentInput = document.createElement('td');

        const label = document.createElement('label');
        label.setAttribute('for', key);
        label.textContent = 
            dataType[key].name.charAt(0).toUpperCase() 
            + dataType[key].name.slice(1).toLowerCase();

        let input;

        if(dataType[key].type === 'file') {
            input = document.createElement('span');
            input.className = 'frmFile';

            const inputHidden = document.createElement('input');
            inputHidden.name = key;
            inputHidden.id = key;
            inputHidden.type = 'hidden';
            inputHidden.value = (value != '' && value != null) ? value : '0';

            const text = document.createElement('span');
            text.textContent = value;

            const button = document.createElement('span');
            button.textContent = 'Ver '+ label.textContent;
            button.className = 'btn btn-primary pgCourse';

            input.appendChild(text);
            input.appendChild(button);
            input.appendChild(inputHidden);
        } else {
            input = document.createElement('input');
            input.name = key;
            input.id = key;
            input.type = dataType[key].type;
            if (dataType[key].type === 'date' && value) input.value = value;
            else input.value = value !== null && value !== undefined ? value : '';
        }

        contentLabel.appendChild(label);
        contentInput.appendChild(input);

        row.appendChild(contentLabel);
        row.appendChild(contentInput);
        contentForm.appendChild(row);
    });

    form.appendChild(contentForm);
    form.appendChild(confirmForm);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());

        if (onSubmitCallback) {
            onSubmitCallback(values);
        }
    });

    return form;
}