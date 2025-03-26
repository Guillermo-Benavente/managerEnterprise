/**
 * Ejecuta una función cuando el DOM esté completamente cargado.
 * 
 * @param {Function} callback La función a ejecutar una vez que el contenido del DOM se haya cargado por completo. 
 *                              Este parámetro debe ser una función que contenga la lógica que se desea ejecutar después 
 *                              de que el DOM esté listo.
 * 
 * @example
 * // Ejemplo de uso:
 * DOM(() => {
 *     console.log('El DOM está listo');
 *     // Aquí puedes inicializar eventos o manipular el DOM.
 * });
 * 
 * @revision 0.0.0
 * @date 2024-10-26
 * @author guillermob
 */
export const DOM = (callback) => window.controlAPI.dom(callback);

//TODO crear comentario
export const Navigate = (page, attr = null) => window.controlAPI.navigate(page, attr);

//TODO crear comentario
export const Modal = (page, attr) => {
    return new Promise((resolve) => {
        window.controlAPI.modalWindow(page, attr);
        window.controlAPI.onModalResponse((response) => resolve(response));
    });
};

//TODO crear comentario
export const SendModalResponse = (response) => window.controlAPI.sendModalResponse(response);

//TODO crear comentario
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