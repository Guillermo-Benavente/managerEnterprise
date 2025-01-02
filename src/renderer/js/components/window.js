import Alert from 'Types/alert.js';
/**
 * Crea y muestra una ventana emergente con un formulario generado dinámicamente basado en los datos proporcionados.
 * La ventana emergente incluye un título, un botón de cierre con un ícono SVG, y un formulario que se construye a partir de las claves del objeto `data`.
 * 
 * @param {string} title - El título que se mostrará en la parte superior de la ventana emergente.
 * @param {Array<Object>} data - Un array de objetos que se utiliza para generar dinámicamente los campos del formulario.
 *                               Cada clave del primer objeto en `data` será usada como una etiqueta (`label`) y tendrá un campo de entrada (`input`).
 * 
 * @returns {HTMLElement} - Devuelve el elemento `div` de la ventana emergente creada, que luego puede ser agregada al DOM.
 * 
 * @example
 * // Ejemplo de uso:
 * const data = [{ name: '', age: '', email: '' }];
 * const formWindow = CreateFormWindow('Registro de Usuario', data);
 * document.body.appendChild(formWindow);
 * 
 * // Esto creará una ventana emergente con un formulario de tres campos: Nombre, Edad y Correo.
 * // El popup incluirá un botón para cerrar la ventana.
 */
export function CreateFormWindow(title, dataType, onSubmitCallback, confirmText = null, cancelText = null) {
    
    const windowPopUp = document.createElement('div');
    windowPopUp.className = 'win-ctn';

    const popUp = document.createElement('form');
    popUp.className = 'win';

    const titlePopUp = document.createElement('h1');
    titlePopUp.className = 'win-tit header';
    titlePopUp.textContent = title;

    const closePopUp = document.createElement('span');
    closePopUp.className = 'btn-img win-cls';
    closePopUp.setAttribute('data-img', '../../assets/img/delete.svg');
    //closePopUp.setAttribute('data-clr', '#fdfdfd');
    //TODO arreglar para cambiar los colores del svg

    popUp.appendChild(closePopUp);
    popUp.appendChild(titlePopUp);

    const contentForm = document.createElement('table');

    Object.entries(dataType).filter(([_, value]) => value.insertData).forEach(([key, _]) => {
        let trForm = document.createElement('tr');
        let tdLabel = document.createElement('td');
        let tdInput = document.createElement('td');

        /*const sanitizedKey = value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/ñ/g, 'n')
            .replace(/\s+/g, '-')
            .toLowerCase();*/
        
        let labelForm = document.createElement('label');
        labelForm.textContent = 
            dataType[key].name.charAt(0).toUpperCase() 
            + dataType[key].name.slice(1).toLowerCase();

        labelForm.setAttribute('for', key);

        let inputForm = document.createElement('input');
        inputForm.name = key;
        inputForm.id = key;
        inputForm.type = dataType[key].type;
        if (dataType[key].type == 'file') {
            popUp.enctype = 'multipart/form-data';
            inputForm.accept = dataType[key].accept;
            inputForm.multiple = true;
            inputForm.style = 'display: none';

            let contentInputFile = document.createElement('label');
            contentInputFile.setAttribute('for', key);
            contentInputFile.className = 'btn btn-primary';

            let textInputFile = document.createElement('span');
            textInputFile.textContent = 'Añadir archivos';

            inputForm.addEventListener('change', (event) => {
                const files = event.target.files;
                const text = files.length > 0
                    ? `${files.length} archivo(s)`
                    : 'Añadir archivos';
                textInputFile.textContent = text;
            });

            contentInputFile.appendChild(textInputFile);
            contentInputFile.appendChild(inputForm);
            tdInput.appendChild(contentInputFile);
        } else {
            tdInput.appendChild(inputForm);
        }

        tdLabel.appendChild(labelForm);
        trForm.appendChild(tdLabel);
        trForm.appendChild(tdInput);
        contentForm.appendChild(trForm);
    });

    popUp.appendChild(contentForm);

    const options = document.createElement('div');
    options.className = 'btn-cnt-rigth';

    const confirmForm = document.createElement('input');
    confirmForm.className = 'btn btn-primary';
    confirmForm.type = 'submit';
    confirmForm.value = confirmText ?? 'Guardar';

    const closeForm = document.createElement('span');
    closeForm.className = 'btn btn-link';
    closeForm.textContent = cancelText ?? 'Cancelar';

    options.appendChild(closeForm);
    options.appendChild(confirmForm);
    popUp.appendChild(options);

    windowPopUp.appendChild(popUp);

    setTimeout(() => {
        windowPopUp.classList.add('visible');
    }, 10);

    popUp.addEventListener('click', (e) => { e.stopPropagation() });
    closeForm.addEventListener('click', () => { DeleteWindow(windowPopUp); });
    closePopUp.addEventListener('click', () => { DeleteWindow(windowPopUp); });
    windowPopUp.addEventListener('click', () => { DeleteWindow(windowPopUp); });

    popUp.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(popUp);  
        const values = Object.fromEntries(formData.entries());

        const fileProcessingPromises = [];

        popUp.querySelectorAll('input[type="file"]').forEach(input => {
            const filePromises = Array.from(input.files).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    reader.onloadend = () => resolve({name:file.name, data:reader.result.split(',')[1]});
                    reader.onerror = (error) => reject(error);

                    reader.readAsDataURL(file);
                });
            });
            const processedFilesPromise = Promise.all(filePromises).then((fileContents) => {
                console.log(`Archivos procesados para ${input.name}:`, fileContents);
                values[input.name] = fileContents;
            });

            fileProcessingPromises.push(processedFilesPromise);
        });

        try {
            await Promise.all(fileProcessingPromises);
            console.log('Todos los archivos han sido procesados:', values);
            if (onSubmitCallback) onSubmitCallback(values);
        } catch (error) { console.error('Error al procesar los archivos:', error); }
        finally { DeleteWindow(windowPopUp); }
    });

    return windowPopUp;
}

/**
 * Elimina un elemento de ventana emergente (popup) del DOM de manera animada.
 * Primero, elimina la clase 'visible' del elemento para ocultarlo, y luego lo elimina del DOM después de un retardo.
 * 
 * @param {HTMLElement} windowPopUp - El elemento de la ventana emergente que se va a eliminar.
 * 
 * @returns {void}
 * 
 * @example
 * // Ejemplo de uso:
 * const popUp = document.querySelector('.popup');
 * DeleteWindow(popUp);
 * 
 * // Esto ocultará la ventana emergente quitando la clase 'visible', 
 * // y luego la eliminará del DOM después de 500ms.
 */
export function DeleteWindow(windowPopUp) {
    windowPopUp.classList.remove('visible');
    
    setTimeout(() => {
        document.body.removeChild(windowPopUp);
    }, 500);
}

export function AlertWindow(type, textMessage, callback) {
    const windowPopUp = document.createElement('div');
    windowPopUp.className = 'win-ctn';

    const popUp = document.createElement('form');
    popUp.className = 'win';

    const titlePopUp = document.createElement('h1');
    titlePopUp.className = 'win-tit header';
    switch (type) {
        case Alert.INFO: titlePopUp.textContent = 'Información';
            break;
        case Alert.WARNING: titlePopUp.textContent = 'Advertencia';
            break;
        case Alert.SUCCESS: titlePopUp.textContent = 'Éxito';
            break;
        case Alert.ERROR: titlePopUp.textContent = 'Error';
            break;
        default: titlePopUp.textContent = 'Información';
            break;
    }

    const closePopUp = document.createElement('span');
    closePopUp.className = 'btn-img win-cls';
    closePopUp.setAttribute('data-img', '../../assets/img/delete.svg');
    closePopUp.setAttribute('data-clr', '#fdfdfd');

    const message = document.createElement('span');
    message.textContent = textMessage;
    
    popUp.appendChild(closePopUp);
    popUp.appendChild(titlePopUp);
    popUp.appendChild(message);

    if(type != Alert.SUCCESS){
        const options = document.createElement('div');
        options.className = 'btn-cnt-rigth';

        const confirmForm = document.createElement('span');
        confirmForm.className = 'btn btn-primary';
        confirmForm.textContent = 'Aceptar';

        const closeForm = document.createElement('span');
        closeForm.className = 'btn btn-secondary';
        closeForm.textContent = 'Cancelar';

        options.appendChild(closeForm);
        options.appendChild(confirmForm);
        popUp.appendChild(options);

        closeForm.addEventListener('click', () => { 
            callback(false);
            DeleteWindow(windowPopUp);
        });
        confirmForm.addEventListener('click', () => { 
            callback(true);
            DeleteWindow(windowPopUp);
        });
    }

    windowPopUp.appendChild(popUp);

    setTimeout(() => {
        windowPopUp.classList.add('visible');
    }, 10);

    if (type == Alert.SUCCESS) {
        setTimeout(() => {
            DeleteWindow(windowPopUp);
        }, 1250);
    }

    return windowPopUp;
}