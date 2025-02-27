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

            const text = document.createElement('span');
            text.textContent = value;

            const button = document.createElement('span');
            button.textContent = 'Ver '+ label.textContent;
            button.className = 'btn btn-primary pgCourse';

            input.appendChild(text);
            input.appendChild(button);
        } else {
            input = document.createElement('input');
            input.name = key;
            input.id = key;
            input.type = dataType[key].type;
            input.value = value;
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

export function CreateChangeDateForm(data, dataType, confirmText = null){
    const form = document.createElement('form');
    form.className = 'frm';

    const AddRow = document.createElement('span');
    AddRow.className = 'btn btn-secondary pgCreateDocument';
    AddRow.textContent = 'Añadir Documento';

    const contentForm = document.createElement('table');
    contentForm.className = 'frm-row-btn';

    Object.entries(data).forEach(([key, value]) => {
        const row = document.createElement('tr');
        const contentLabel = document.createElement('td');
        const contentInput = document.createElement('td');

        const label = document.createElement('label');
        label.setAttribute('for', key);
        label.textContent = value.name;

        /*const dateForm = document.createElement('input');
        dateForm.type = 'date';
        dateForm.id = key;
        dateForm.name = key;*/

        const editButton = document.createElement('span');
        editButton.className = 'btn btn-primary';
        editButton.name = key;
        editButton.id = key;
        editButton.textContent = 'Editar';

        const deleteButton = document.createElement('span');
        deleteButton.className = 'btn btn-secondary';
        deleteButton.name = key;
        deleteButton.id = key;
        deleteButton.textContent = 'Eliminar';

        contentLabel.appendChild(label);
        //contentInput.appendChild(dateForm);
        contentInput.appendChild(editButton);
        contentInput.appendChild(deleteButton);

        row.appendChild(contentLabel);
        row.appendChild(contentInput);
        contentForm.appendChild(row);
    });

    form.appendChild(contentForm);
    form.appendChild(AddRow);

    return form;
}