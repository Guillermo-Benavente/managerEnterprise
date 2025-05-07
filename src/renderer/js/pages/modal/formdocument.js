import { DOM, GetElement, CreateElement, AddElement, SendModalResponse, Dialog} from 'Components/controlAPI.js';
import { DOCUMENT, DOCUMENTBYEMPLOYEES, EMPLOYEE, GetEmployees, GetEmployeesByDocument, GetDocument } from 'Components/dbAPI.js';
import Fieldset from 'Components/form.js';
import { formatDateForInput } from 'Components/time';
import DIALOG_TYPE from 'Types/dialog.js';
import FORM_TYPE from 'Types/form.js';

DOM(async() => {
    const { modeEdit, documentId } = Object.fromEntries(new URLSearchParams(window.location.search));

    init();
    if(modeEdit == 'true') loadDocument(documentId);
    submitForm();
});

async function init() {
    try {
        const employees = await GetEmployees();

        new Fieldset(GetElement('.document'), DOCUMENT, FORM_TYPE.NORMAL).init();
        new Fieldset(GetElement('.employees'), {object: [DOCUMENTBYEMPLOYEES, EMPLOYEE], data: employees}, FORM_TYPE.SELECTOR).init();

        GetElement('button[type=button]').addEventListener('click', () => window.close());
    } catch (error) {
        console.error('Error al inicializar el formulario:', error);
        Dialog('Error', 'No se ha podido cargar la información.', DIALOG_TYPE.ERROR);    
    }
}

async function loadDocument(documentId) {
    try {
        const document = await GetDocument(documentId);
        const employeesByDocument = await GetEmployeesByDocument(documentId);

        GetElement(`input[name='name']`).value = document.name;

        employeesByDocument.forEach((employeeByDocument) => {
            const hiddenInput = CreateElement('input', { type: 'hidden', name: `${employeeByDocument.employee}docId` });
            hiddenInput.setAttribute('data-id', employeeByDocument.id);

            AddElement(hiddenInput, GetElement('.employees'));

            GetElement(`input[name='${employeeByDocument.employee}']`).checked = true;
            GetElement(`input[name='${employeeByDocument.employee}date']`).value = formatDateForInput(employeeByDocument.date);            
        });
    } catch (error) {
        console.error('Error al cargar el documento:', error);
        Dialog('Error', 'No se ha podido cargar la información del documento.', DIALOG_TYPE.ERROR);    
    }
}

function submitForm() {
    const form = GetElement('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = { selector: {}, data: {} };

        Object.entries(Object.fromEntries(new FormData(form).entries())).forEach(([key, value]) => {
            
            const inputElement = GetElement(`input[name='${key}']`);

            if (inputElement.hasAttribute('data-id')) data.selector[key+'-data-id'] = inputElement.getAttribute('data-id');
            
            if (key.includes("date") || /^\d+[A-Z]$/.test(key)) data.selector[key] = value;
            else data.data[key] = value;
        });

        try {
            SendModalResponse(data);
            window.close();
        } catch (error) { 
            Dialog('Error', 'No se ha podido añadir el documento.', DIALOG_TYPE.ERROR);
            console.error('Error al procesar los archivos:', error); 
        }
    });
}