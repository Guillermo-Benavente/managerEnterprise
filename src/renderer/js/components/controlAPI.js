/**
 * Ejecuta un callback cuando el DOM ha sido completamente cargado.
 *
 * Esta función envuelve la API `controlAPI.dom` expuesta en el objeto global `window` mediante Electron 
 * `contextBridge`. La implementación real de esta función se basa en escuchar el evento `DOMContentLoaded`:
 * 
 * ```js
 * document.addEventListener('DOMContentLoaded', callback)
 * ```
 *
 * @param callback Función que se ejecuta cuando el DOM ha terminado de cargarse.
 *
 * @returns void No retorna ningún valor.
 *
 * @example
 * // Ejemplo de uso:
 * DOM(() => {
 *     console.log('El DOM ha sido cargado completamente.');
 * });
 *
 * @remarks
 * La función `dom` es parte de la API `controlAPI` expuesta en el `window` con `contextBridge.exposeInMainWorld`:
 * 
 * ```js
 * contextBridge.exposeInMainWorld('controlAPI', {
 *   dom: (callback) => document.addEventListener('DOMContentLoaded', callback)
 * });
 * ```
 *
 * @revision 0.0.0
 * @date 2025-04-10
 * @author guillermob
 */
export const DOM = (callback) => window.controlAPI.dom(callback);

/**
 * Navega a una página específica, enviando un mensaje a través de IPC usando la API `controlAPI.navigate(page, attr)`.
 *
 * Esta función expone la funcionalidad de navegación a través de Electron. Utiliza el `ipcRenderer` para enviar un mensaje 
 * al proceso principal (`main process`) para que cargue la página especificada en la ventana principal.
 * 
 * El comportamiento real de la navegación se maneja en el proceso principal a través de `ipcMain` y se carga una URL 
 * en la ventana principal (`mainWindow`).
 *
 * @param {string} page Nombre de la página a la que se debe navegar.
 * @param {any} [attr=null] Atributos opcionales que pueden ser enviados junto con la navegación. 
 *                          Pueden ser usados para agregar parámetros a la URL.
 * 
 * @returns {void} No retorna ningún valor, pero realiza la navegación.
 * 
 * @example
 * // Ejemplo de uso:
 * Navigate('home'); // Navega a la página 'home'
 * Navigate('profile', { userId: 123 }); // Navega a la página 'profile' con parámetros adicionales
 * 
 * @remarks
 * La función `navigate` expone la funcionalidad del proceso principal para navegar a una URL construida 
 * dinámicamente con los parámetros `page` y `attr`. La URL se carga en el `mainWindow` de la aplicación.
 * 
 * En el proceso principal, se maneja la navegación con `ipcMain.on('navigate', ...)` y la URL se construye 
 * usando el servidor local `http://localhost:3000`.
 *
 * @revision 0.0.0
 * @date 2025-04-10
 * @author guillermob
 */
export const Navigate = (page, attr = null) => window.controlAPI.navigate(page, attr);

/**
 * Abre una ventana modal que carga una página específica y espera una respuesta del usuario.
 * 
 * Esta función envuelve la API `controlAPI.modalWindow(page, attr)` para abrir una ventana modal, y 
 * luego resuelve la promesa con la respuesta del usuario cuando esta esté disponible.
 * 
 * La función utiliza la comunicación IPC entre el proceso principal y el proceso de renderizado 
 * para manejar la ventana modal. La ventana modal se carga con una URL basada en el parámetro `page` 
 * y puede recibir parámetros adicionales a través de `attr`. La respuesta de la modal se resuelve 
 * a través del `controlAPI.onModalResponse`.
 * 
 * @param {string} page Nombre de la página que debe cargarse en la ventana modal.
 * @param {any} attr Atributos opcionales que pueden ser enviados con la solicitud de la ventana modal.
 * 
 * @returns {Promise<any>} Una promesa que se resuelve con la respuesta enviada desde la ventana modal.
 * 
 * @example
 * // Ejemplo de uso:
 * Modal('userForm', { userId: 123 })
 *   .then(response => {
 *       console.log('Respuesta de la modal:', response);
 *   })
 *   .catch(error => {
 *       console.error('Error al abrir la modal:', error);
 *   });
 * 
 * @remarks
 * El proceso principal maneja la creación de la ventana modal y la comunicación con el proceso de renderizado
 * a través de los canales IPC (`modal-window`, `modal-response`, y `modal-send`).
 * 
 * La ventana modal es un `BrowserWindow` con características como el tamaño restringido a 800x600 píxeles y la
 * carga de una URL que puede incluir parámetros adicionales.
 * 
 * @revision 0.0.0
 * @date 2024-10-28
 * @author guillermob
 */
export const Modal = (page, attr) => {
    return new Promise((resolve) => {
        window.controlAPI.modalWindow(page, attr);
        window.controlAPI.onModalResponse((response) => resolve(response));
    });
};

/**
 * Envía una respuesta desde el proceso de renderizado hacia el proceso principal para ser procesada en la ventana modal.
 *
 * Esta función envuelve la API `controlAPI.sendModalResponse(response)` para enviar una respuesta al proceso principal 
 * a través de IPC. El mensaje es enviado utilizando el canal `modal-send`, lo que permite al proceso principal recibir 
 * y procesar la respuesta dentro de la ventana modal.
 *
 * @param {any} response La respuesta que se enviará al proceso principal. Puede ser cualquier tipo de dato.
 * 
 * @returns {void} No retorna ningún valor, pero envía la respuesta al proceso principal.
 * 
 * @example
 * // Ejemplo de uso:
 * SendModalResponse({ success: true, message: 'Modal cerrada correctamente.' });
 * 
 * @remarks
 * Esta función utiliza la API `sendModalResponse` expuesta a través de `window.controlAPI`, la cual a su vez 
 * utiliza el canal IPC `modal-send` para enviar la respuesta al proceso principal.
 * 
 * En el proceso principal, la respuesta es recibida y enviada a la ventana principal mediante el canal `modal-response`.
 *
 * @revision 0.0.0
 * @date 2025-04-10
 * @author guillermob
 */
export const SendModalResponse = (response) => window.controlAPI.sendModalResponse(response);

/**
 * Muestra un cuadro de diálogo con diferentes tipos de mensajes (informativo, advertencia, error, etc.)
 * y espera una respuesta del usuario.
 * 
 * La función envuelve la API `controlAPI.dialogWindow(type, title, message)` para mostrar un cuadro de diálogo
 * y retorna una promesa que se resuelve con la respuesta del usuario. El valor de la respuesta será `true` 
 * si el usuario selecciona 'Yes' o 'OK', y `false` en otros casos.
 * 
 * Los tipos de diálogo se definen usando constantes en lugar de números. Los tipos disponibles son:
 * - `DIALOG_TYPE.INFO` para un cuadro de información.
 * - `DIALOG_TYPE.ERROR` para un cuadro de error.
 * - `DIALOG_TYPE.QUESTION` para un cuadro de pregunta.
 * - `DIALOG_TYPE.WARNING` para un cuadro de advertencia.
 *
 * @param {string} title Título del cuadro de diálogo.
 * @param {string} message Mensaje que será mostrado en el cuadro de diálogo.
 * @param {DIALOG_TYPE} [type=DIALOG_TYPE.INFO] Tipo de cuadro de diálogo.
 * 
 * @returns {Promise<boolean>} Una promesa que se resuelve con `true` si el usuario acepta el diálogo 
 *                             ('Yes' o 'OK'), o `false` si el usuario cancela o cierra el diálogo.
 * 
 * @example
 * // Ejemplo de uso:
 * Dialog('Confirmación', '¿Estás seguro de que quieres continuar?', DIALOG_TYPE.QUESTION)
 *   .then(response => {
 *       if (response) {
 *           console.log('El usuario aceptó.');
 *       } else {
 *           console.log('El usuario canceló.');
 *       }
 *   });
 * 
 * @remarks
 * El proceso principal maneja el cuadro de diálogo utilizando `ipcMain` y el módulo `dialog` de Electron. 
 * Dependiendo del tipo de mensaje, se muestra un cuadro de diálogo con diferentes botones y se espera la respuesta 
 * del usuario. 
 * 
 * La respuesta del usuario es enviada de vuelta al proceso de renderizado a través de IPC (`dialog-response`).
 * 
 * @revision 0.0.0
 * @date 2025-04-10
 * @author guillermob
 */
export const Dialog = (title, message, type = 0) => {
    return new Promise((resolve) => {
        window.controlAPI.dialogWindow(type, title, message);

        window.controlAPI.onDialogResponse((response) => {
            let resut = false;
            if (response === 'Yes' || response === 'OK') resut = true;
            resolve(resut);
        });
    });
};

// TODO crear comentario
export const SaveDialog = (title, documentName, type) => window.controlAPI.saveDialog({ title, defaultPath: documentName + '.' + type,filters: [{ name: type, extensions: [type] }]});

// TODO crear comentario
export const OpenDialog = (title) => window.controlAPI.openDialog({ title, properties: ['openDirectory', 'createDirectory']});

//TODO crear comantario
export const SaveFile = (filePath, data) => window.controlAPI.saveFile(filePath, data);

/**
 * Obtiene la URL de un archivo PDF específico en el servidor.
 * 
 * La función envuelve la API `controlAPI.getPdfUrl(type, user, name)` y genera una URL para acceder a un PDF
 * basado en el tipo, el usuario y el nombre del archivo. La URL generada es la ruta completa hacia el archivo PDF
 * en el servidor.
 * 
 * @param {string} type El tipo de documento PDF que se desea obtener (por ejemplo, 'invoices', 'reports').
 * @param {string} user El nombre de usuario asociado con el archivo PDF.
 * @param {string} name El nombre del archivo PDF (sin la extensión `.pdf`).
 * 
 * @returns {string} La URL completa que apunta al archivo PDF solicitado en el servidor.
 * 
 * @example
 * // Ejemplo de uso:
 * const pdfUrl = GetPdf('invoices', 'john_doe', 'invoice123');
 * console.log(pdfUrl); // "http://localhost:3500/pdf/invoices/john_doe/invoice123"
 * 
 * @remarks
 * La URL generada es una ruta relativa al servidor en ejecución. El servidor debe estar configurado y en funcionamiento 
 * para poder acceder al archivo PDF.
 * 
 * La URL utiliza una ruta del tipo `http://<server-url>/pdf/<type>/<user>/<name>.pdf`, donde el servidor proporciona
 * acceso al archivo PDF correspondiente.
 * 
 * @revision 0.0.0
 * @date 2025-04-10
 * @author guillermob
 */
export const GetPdf = (type, user, name) => window.controlAPI.getPdfUrl(type, user, name);

/**
 * Añade un manejador de evento a un elemento del DOM identificado por un selector.
 * 
 * @param {string} selector Selector CSS para identificar el elemento al cual se le agregará el evento.
 *                          Puede ser una clase (`'.miClase'`), un id (`'#miId'`), o cualquier selector compatible con `querySelector`.
 * @param {string} type Tipo de evento a manejar, como `'click'`, `'mouseover'`, etc.
 * @param {Function} callback Función que se ejecutará cuando ocurra el evento. Define la acción a realizar.
 * @throws {Error} Si no se encuentra un elemento que coincida con el selector, se lanza un error con un mensaje descriptivo.
 * 
 * @example
 * // Ejemplo de uso básico con manejo de errores:
 * try {
 *     AddEvent('.boton', 'click', () => {
 *         alert('Botón clickeado');
 *     });
 * } catch (error) {
 *     console.error(error.message); // Maneja el error si el elemento no se encuentra.
 * }
 * 
 * @revision 0.0.0
 * @date 2024-11-04
 * @author guillermob
 */
//TODO cambiar comentario
export const AddEvent = (selector, type, callback) => window.controlAPI.addEvent(selector, type, callback);

/**
 * Obtiene un elemento del DOM basado en un selector.
 * 
 * @param {string} selector El selector del elemento (por id, clase, etc.).
 * @throws {Error} Si no se encuentra un elemento que coincida con el selector proporcionado, se lanza un error con un
 *                 mensaje descriptivo.
 * @returns {HTMLElement} Devuelve el elemento encontrado.
 * 
 * @example
 * // Ejemplo de uso:
 * try {
 *     const table = GetElement('#myTable');
 *     console.log(table); // Realiza operaciones sobre el elemento
 * } catch (error) {
 *     console.error(error.message); // Maneja el error si el elemento no se encuentra.
 * }
 * 
 * @revision 0.0.0
 * @date 2024-10-26
 * @author guillermob
 */
//TODO cambiar comentario
export const GetElement = (selector, element) => window.controlAPI.getElement(selector, element);

/**
 * Crea un nuevo elemento del DOM con los atributos y contenido especificado.
 * 
 * @param {string} tag El nombre de la etiqueta del elemento a crear (por ejemplo, 'div', 'span', 'img').
 * @param {Object} [attributes={}] Un objeto que contiene los atributos a asignar al elemento (por ejemplo, { id: 'miDiv', class: 'clase' }).
 * @param {string|HTMLElement} [content] El contenido interno del elemento. Puede ser texto o un elemento HTML.
 * @returns {HTMLElement} Devuelve el nuevo elemento creado.
 * 
 * @example
 * // Crear un div con atributos y contenido de texto
 * const newDiv = CreateElement('div', { id: 'miDiv', class: 'clase' }, 'Contenido del div');
 * document.body.appendChild(newDiv); // Añadir el div al cuerpo del documento
 * 
 * @example
 * // Crear una imagen y añadirla a un contenedor
 * const newImage = CreateElement('img', { src: 'ruta/a/imagen.jpg', alt: 'Descripción de la imagen' });
 * const container = document.getElementById('miContenedor');
 * container.appendChild(newImage);
 * 
 * @revision 0.0.0
 * @date 2024-10-26
 * @author guillermob
 */
export const CreateElement = (tag, attributes, content) => window.controlAPI.createElement(tag, attributes, content);

/**
 * Añade un elemento hijo al final de un elemento padre en el DOM.
 * 
 * @param {HTMLElement} child El elemento hijo que se desea añadir.
 * @param {HTMLElement} [parent=document.body] El elemento padre al cual se añadirá el hijo. Por defecto, es el <body> del documento.
 * @returns {void} No retorna un valor, simplemente añade el elemento hijo al DOM.
 * 
 * @example
 * const newDiv = document.createElement('div');
 * AddElement(newDiv, document.getElementById('container'));
 * 
 * @revision 0.0.0
 * @date 2024-10-26
 * @author guillermob
 */
export const AddElement = (child, parent) => window.controlAPI.addElement(child, parent);

/**
 * Añade un elemento hijo al DOM de manera temporal.
 *
 * Este método añade un elemento hijo a un elemento padre en el DOM y lo elimina 
 * después de un tiempo especificado. Es útil para mostrar mensajes temporales o 
 * notificaciones sin requerir la intervención del usuario.
 *
 * @param {HTMLElement} element El elemento hijo que se desea añadir.
 * @param {number} time El tiempo en milisegundos después del cual se eliminará el elemento.
 * @param {HTMLElement} [parent=document.body] El elemento padre al cual se añadirá el hijo. 
 *                                                Por defecto, es el <body> del documento.
 * @returns {void} No retorna un valor, simplemente añade y luego elimina el elemento del DOM.
 *
 * @example
 * const tempDiv = document.createElement('div');
 * tempDiv.textContent = 'Este mensaje desaparecerá en 3 segundos.';
 * AddTemporaryElement(tempDiv, 3000, document.getElementById('notifications'));
 *
 * @revision 0.0.0
 * @date 2024-10-26
 * @author guillermob
 */
export function AddTemporaryElement(element, time, parent) {
    AddElement(element, parent);
    setTimeout(() => { RemoveElement(element, parent); }, time);
}

/**
 * Elimina un elemento hijo de un elemento padre en el DOM.
 * 
 * @param {HTMLElement} child El elemento hijo que se desea eliminar del DOM.
 * @param {HTMLElement} [parent=document.body] El elemento padre del cual se eliminará el hijo. Por defecto, es el <body> del documento.
 * @returns {void} No retorna un valor, simplemente elimina el elemento hijo del DOM.
 * 
 * @example
 * const elementToRemove = document.getElementById('myElement');
 * RemoveElement(elementToRemove, document.getElementById('container'));
 * 
 * @revision 0.0.0
 * @date 2024-12-12
 * @author guillermob
 */
export const RemoveElement = (child, parent) => window.controlAPI.removeElement(child, parent);