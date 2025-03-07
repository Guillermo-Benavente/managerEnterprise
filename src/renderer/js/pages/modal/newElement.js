import { DOM, CreateElement, GetElement, AddElement, SendModalResponse, Dialog } from 'Components/controlAPI.js';

DOM(() => {
    const { title, dataType, windowType } = Object.fromEntries(new URLSearchParams(window.location.search));

    const newDataType = JSON.parse(dataType);

    AddElement(CreateElement('title', {}, title), document.head);

    GetElement('h1').textContent = title;
    
    const form = GetElement('form');

    const fieldset = GetElement('fieldset');

    Object.entries(newDataType).filter(([_, value]) => value.insertData).forEach(([key, _]) => {

        const label = CreateElement('label', { for: key }, 
            newDataType[key].name.toLowerCase().replace(/./, c => c.toUpperCase())
        );

        AddElement(label, fieldset);

        const inputForm = CreateElement('input', { name: key, id: key, type: newDataType[key].type });

        if (newDataType[key].type == 'file') {
            form.enctype = 'multipart/form-data';
            inputForm.accept = newDataType[key].accept;
            inputForm.multiple = true;
            inputForm.style = 'display: none';

            const contentInputFile = CreateElement('label', { for: key, class: 'btn btn-primary' });
            const textInputFile = CreateElement('span', {}, 'Añadir archivos');

            inputForm.addEventListener('change', (event) => {
                const files = event.target.files;
                const text = files.length > 0
                    ? `${files.length} archivo(s)`
                    : 'Añadir archivos';
                textInputFile.textContent = text;
            });

            AddElement(AddElement([textInputFile, inputForm], contentInputFile), fieldset);
        } else AddElement(inputForm, fieldset);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const values = Object.fromEntries(new FormData(form).entries());

        const fileProcessingPromises = [];

        form.querySelectorAll('input[type="file"]').forEach(input => {
            const filePromises = Array.from(input.files).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    reader.onloadend = () => resolve({name:file.name, data:reader.result.split(',')[1]});
                    reader.onerror = (error) => reject(error);

                    reader.readAsDataURL(file);
                });
            });
            const processedFilesPromise = Promise.all(filePromises).then((fileContents) => {
                values[input.name] = fileContents;
            });

            fileProcessingPromises.push(processedFilesPromise);
        });

        try {
            await Promise.all(fileProcessingPromises);
            SendModalResponse(values);
            window.close();
        } catch (error) { 
            Dialog('Error', 'No se ha podido añadir al empleado.', Alert.ERROR);
            console.error('Error al procesar los archivos:', error); 
        }
    });

    GetElement('button[type=button]').addEventListener('click', () => window.close());
});