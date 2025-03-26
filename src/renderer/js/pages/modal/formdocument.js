import { DOM, GetElement, SendModalResponse, Dialog} from 'Components/controlAPI.js';
import { DOCUMENT, DOCUMENTBYEMPLOYEES, EMPLOYEE, FormatEmployee, GetEmployees } from 'Components/dbAPI.js';
import Alert from 'Types/alert.js';
import Fieldset from 'Components/form.js';
import FormType from 'Types/form.js';

DOM(() => {
    const form = GetElement('form');

    new Fieldset(GetElement('.document'), DOCUMENT, FormType.NORMAL).init();
    GetEmployees((success, data) => {
        if (success) new Fieldset(GetElement('.employees'), {object: [DOCUMENTBYEMPLOYEES, EMPLOYEE], data: FormatEmployee(data)}, FormType.SELECTOR).init();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = { selector: {}, data: {} };

        Object.entries(Object.fromEntries(new FormData(form).entries().filter(([_, v]) => v !== ""))).forEach(([key, value]) => {
            if (key.includes("date") || /^\d+[A-Z]$/.test(key)) data.selector[key] = value;
            else data.data[key] = value;
        });

        try {
            SendModalResponse(data);
            window.close();
        } catch (error) { 
            Dialog('Error', 'No se ha podido añadir el documento.', Alert.ERROR);
            console.error('Error al procesar los archivos:', error); 
        }
    });

    GetElement('button[type=button]').addEventListener('click', () => window.close());
});