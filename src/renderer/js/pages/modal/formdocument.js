import { DOM, GetElement, CreateElement, AddElement, SendModalResponse, Dialog} from 'Components/controlAPI.js';
import { DOCUMENT, DOCUMENTBYEMPLOYEES, EMPLOYEE, FormatEmployee, GetEmployees, GetEmployeesByDocument, GetDocument } from 'Components/dbAPI.js';
import DIALOG_TYPE from 'Types/dialog.js';
import Fieldset from 'Components/form.js';
import FormType from 'Types/form.js';

DOM(() => {
    const { modeEdit, documentId } = Object.fromEntries(new URLSearchParams(window.location.search));

    const form = GetElement('form');

    new Fieldset(GetElement('.document'), DOCUMENT, FormType.NORMAL).init();
    GetEmployees((success, data) => {
        if (success) new Fieldset(GetElement('.employees'), {object: [DOCUMENTBYEMPLOYEES, EMPLOYEE], data: FormatEmployee(data)}, FormType.SELECTOR).init();
    });

    if(modeEdit == 'true') {
        GetDocument(documentId, (success, data) => {if (success) GetElement(`input[name='name']`).value = data.name;});

        GetEmployeesByDocument( documentId, (success, data) => {
            if (success) {
                data.forEach((employeeByDocument) => {
                    const inputCheck = GetElement(`input[name='${employeeByDocument.employee}']`);
                    const inputDate = GetElement(`input[name='${employeeByDocument.employee}date']`);
                    const hiddenInput = CreateElement('input', { type: 'hidden', name: `${employeeByDocument.employee}docId` });
                    inputCheck.checked = true;
                    hiddenInput.setAttribute('data-id', employeeByDocument.id);
                    inputDate.value = employeeByDocument.date;

                    AddElement(hiddenInput, GetElement('.employees'));
                });
            }
        });
    }

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

    GetElement('button[type=button]').addEventListener('click', () => window.close());
});