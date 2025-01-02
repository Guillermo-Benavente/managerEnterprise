export function CreateForm(data, dataType, onSubmitCallback, confirmText = null) {
    const form = document.createElement('form');
    form.className = 'frm';
    const contentForm = document.createElement('table');

    const confirmForm = document.createElement('input');
    confirmForm.className = 'btn btn-primary';
    confirmForm.type = 'submit';
    confirmForm.value = confirmText ?? 'Guardar';

    console.log(dataType);

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

    const confirmForm = document.createElement('input');
    confirmForm.className = 'btn btn-primary';
    confirmForm.type = 'submit';
    confirmForm.value = confirmText ?? 'Guardar';

    const contentForm = document.createElement('table');
    contentForm.className = 'frm-row-btn';
    Object.entries(data).forEach(([key, value]) => {

        const row = document.createElement('tr');
        const contentLabel = document.createElement('td');
        const contentInput = document.createElement('td');

        const label = document.createElement('label');
        label.setAttribute('for', key);
        label.textContent = value;

        const dateForm = document.createElement('input');
        dateForm.type = 'date';
        dateForm.id = key;
        dateForm.name = key;

        const button = document.createElement('span');
        button.className = 'btn btn-primary';
        button.name = key;
        button.id = key;
        button.textContent = 'Ver';

        contentLabel.appendChild(label);
        contentInput.appendChild(dateForm);
        contentInput.appendChild(button);

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