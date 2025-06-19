import { DOM, GetElement, CreateElement, AddElement, SendModalResponse, Dialog } from 'Components/controlAPI.js';
import dbAPI, { keys, DOCUMENT, DOCUMENTBYEMPLOYEES, EMPLOYEE } from 'Components/dbAPI.js';
import Fieldset from 'Components/form.js';
import TableName from 'Types/handler/TableName.js';
import DialogType from 'Types/dialog.js';
import FormType from 'Types/form.js';

const empKeys = keys(TableName.EMPLOYEE);
const docKeys = keys(TableName.DOCUMENT);
const ebdKeys = keys(TableName.EMPLOYEEBYDOCUMENT);
let loadedEmployeeData = [];
let table;

DOM(async() => {
    GetElement('button[type=button]').addEventListener('click', () => window.close());
    const { modeEdit, documentId } = Object.fromEntries(new URLSearchParams(window.location.search));

    await init();
    if(modeEdit == 'true') await loadDocument(documentId);
    submitForm();
});

async function init() {
    try {
        const employees = await dbAPI[empKeys.GETALL]();

        new Fieldset(GetElement('.document'), DOCUMENT, FormType.NORMAL).init();
        table = new Fieldset(GetElement('.employees'), {object: [DOCUMENTBYEMPLOYEES, EMPLOYEE], data: employees}, FormType.SELECTOR).init();
    } catch (error) {
        console.error('Error al inicializar el formulario:', error);
        Dialog('Error', 'No se ha podido cargar la información.', DialogType.ERROR);
    }
}

async function loadDocument(documentId) {
    try {
        const documentt = await dbAPI[docKeys.GETONE](documentId);
        loadedEmployeeData = await dbAPI[ebdKeys.GETALL](documentId);

        GetElement(`input[name='name']`).value = documentt.name;

        loadedEmployeeData.forEach(({ employee, date, id }) => {
            const row = table.rows().nodes().toArray().find(row => {
                return row.querySelector(`input[name='${employee}']`);
            });

            const checkbox = row.querySelector(`input[name='${employee}']`);
            const dateInput = row.querySelector(`input[name='${employee}date']`);
            const container = checkbox.closest('div');
            const hiddenInput = CreateElement('input', {
                type: 'hidden',
                name: `${employee}docId`,
                'data-id': id
            });
            AddElement(hiddenInput, container);

            if (container.classList.contains('errorCondition')) {
                checkbox.checked = false;
                checkbox.disabled = true;
            } else checkbox.checked = true;

            dateInput.value = date;
        });
    } catch (error) {
        console.error('Error al cargar el documento:', error);
        Dialog('Error', 'No se ha podido cargar la información del documento.', DialogType.ERROR);    
    }
}

function submitForm() {
    const form = GetElement('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const sendData = { selector: {}, data: {} };

        const allInputs = table.rows().nodes().toArray()
        .flatMap(row => 
            Array.from(row.querySelectorAll('input, select, textarea'))
        );

        allInputs.forEach(input => {
            const { name, value, dataset, type, checked } = input;
            const match = name.match(/^(\d+[A-Z])/);
            const baseKey = match ? match[1] : name;

            if (!sendData.selector[baseKey]) sendData.selector[baseKey] = {};

            if (name === baseKey && type === 'checkbox' && checked) sendData.selector[baseKey].value = value;
            else if (name.includes("date")) sendData.selector[baseKey].date = value;
            
            if (dataset.id) sendData.selector[baseKey].docId = dataset.id;
        });

        sendData.data['name'] = GetElement(`input[name='name']`).value;
        
        try {
            SendModalResponse(sendData);
            window.close();
        } catch (error) { 
            Dialog('Error', 'No se ha podido añadir el documento.', DialogType.ERROR);
            console.error('Error al procesar los archivos:', error); 
        }
    });
}