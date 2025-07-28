/*
name: '',
    type: 'string',
    identifier: false,
    showForm: true,
    showTable: true,
    requireForm: false,
    checkForm: null,
    accept: null,
    reference: false,
    showFormSelectorText: false,
    showFormSelectorState: false
 */
const BASE_SCHEMA_FIELDS = {
    key: '',
    name: '',
    type: 'text',
    identifier: false,
    reference: false,
    showTable: true,
    showForm: true,
    accept: null,
    pattern: null,
    required: false,
};

export default function newField(customField) {
    return { ...BASE_SCHEMA_FIELDS, ...customField };
}