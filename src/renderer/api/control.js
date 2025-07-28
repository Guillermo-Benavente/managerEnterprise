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