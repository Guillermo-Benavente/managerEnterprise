import { DOM, CreateElement, GetElement, AddElement } from 'Components/controlAPI.js';
import { SubmitForm } from 'Components/form.js';
import Fieldset from 'Components/form.js';
import FromType from 'Types/form.js';

DOM(() => {
    const { title, dataType } = Object.fromEntries(new URLSearchParams(window.location.search));

    const newDataType = JSON.parse(dataType);

    AddElement(CreateElement('title', {}, title), document.head);

    GetElement('h1').textContent = title;

    new Fieldset(GetElement('fieldset'), newDataType, FromType.NORMAL).init();

    SubmitForm(GetElement('form'));

    GetElement('button[type=button]').addEventListener('click', () => window.close());
});