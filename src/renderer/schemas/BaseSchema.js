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
    showEdit: true,
    showVariable: true,
    accept: null,
    pattern: null,
    required: false,
    ignoreInMapper: false,
};

function newField(customField) {
    return { ...BASE_SCHEMA_FIELDS, ...customField };
}

export default function newSchema(customSchema) {
    let schema = [];
    schema.push(newField({
        key: 'id',
        name: 'ID',
        identifier: true,
        showTable: false,
        showForm: false,
        showEdit: false,
        showVariable: false,
    }));
    for (const field of customSchema) schema.push(newField(field));
    return schema;
}