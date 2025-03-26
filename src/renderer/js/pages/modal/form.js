import { DOM, CreateElement, GetElement, AddElement } from 'Components/controlAPI.js';
import { CreateInputs, SubmitForm } from 'Components/form.js';
import Fieldset from 'Components/form.js';

DOM(() => {
    const { title, dataType } = Object.fromEntries(new URLSearchParams(window.location.search));

    const newDataType = JSON.parse(dataType);

    AddElement(CreateElement('title', {}, title), document.head);

    GetElement('h1').textContent = title;
    
    const form = GetElement('form');

    const fieldset = GetElement('fieldset');

    //TODO Implementar esto para simplificar codigo
    //new Fieldset(GetElement('fieldset'), newDataType, FormType.NORMAL).init();

    CreateInputs(newDataType, fieldset, form);

    SubmitForm(form);

    GetElement('button[type=button]').addEventListener('click', () => window.close());
});