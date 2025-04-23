import { DOM, AddEvent, Navigate, Modal, Dialog } from 'Components/controlAPI.js';
import { SetDocuments, SetEmployeeByDocument, GetDocument, UpdateDocument } from 'Components/dbAPI.js';
import { newPdf } from 'Components/createPdf.js'
import VariableInline from 'Components/editor/variableInline.js'
import DIALOG_TYPE from 'Types/dialog.js';
import VAR_INLINE_NAME from 'Types/varInlineName';
import ENTRY_POINTS_TYPE from 'Types/entryPoints.js';
import EditorJS from '@editorjs/editorjs';
import Header from  '@editorjs/header' ; 
import List from  '@editorjs/list' ;
import Image from "@editorjs/image";
import Table from "@editorjs/table";
import Paragraph from '@editorjs/paragraph';


DOM(async() => {
    const companyId = new URLSearchParams(window.location.search).get('id');
    const documentId = new URLSearchParams(window.location.search).get('documentId');

    registerBackHandler(documentId, companyId);
    try {
        const document = await GetDocument(documentId);
        const editor = await init(document, configEditorTools());
        registerCreateHandler(documentId, document, companyId, editor);
    } catch (error) {
        console.error('Error al obtener el documento:', error);
        Dialog('Error', 'No se ha podido cargar el documento.', DIALOG_TYPE.ERROR);
    }
    
});

async function init(document, tools) {
    let content = null;

    if (document) content = JSON.parse(document.content);

    const editor = new EditorJS({
        holder: 'edt',
        spellcheck: false,
        tools,
        placeholder: 'Escribe tu contenido aquí...',
        autofocus: true,
        onReady: () => { if (content) editor.render(content); }
    });

    return editor;
}

function configEditorTools() {
    return {
        variable: {
            class: VariableInline,
            config: {
                variables: [
                { key: VAR_INLINE_NAME.EMPLOYEE_NAME, label: 'Nombre del Empleado' },
                { key: VAR_INLINE_NAME.COMPANY_NAME, label: 'Nombre de la Empresa' },
                { key: VAR_INLINE_NAME.EMPLOYEE_SIGNATURE, label: 'Firma del empleado' },
                { key: VAR_INLINE_NAME.DOCUMENT_DATE, label: 'Fecha del documento' }
                ]
            }
        },
        header: {
            class: Header,
            inlineToolbar: ['link'],
            config: {
                placeholder: 'Ingrese un encabezado',
                defaultLevel: 3
            }
        },
        paragraph: {
            class: Paragraph,
            config: {
                preserveBlank: true,
            },
        },
        list: {
            class: List,
            inlineToolbar: true
        },
        table: {
            class: Table,
            inlineToolbar: true,
            config: {
                rows: 2,
                cols: 3
            }
        },
        image: {
            class: Image,
            config: {
                uploader: {
                    uploadByFile(file) {
                        return new Promise((resolve, reject) => {
                        if (!file.type.startsWith('image/')) {
                            reject('El archivo no es una imagen');
                            return;
                        }

                        const reader = new FileReader();

                        reader.onload = () => {
                            resolve({
                            success: 1,
                            file: {
                                url: reader.result
                            }
                            });
                        };

                        reader.onerror = () => {
                            reject('Error al cargar la imagen');
                        };

                        reader.readAsDataURL(file);
                        });
                    }
                }
            }
        }
    };
}

function registerCreateHandler(documentId, document, companyId, editor) {
    if (document) {
        AddEvent('.wininCreate', 'click', async() => {
            try {
                const outputData = await editor.save();

                let documentUpdate = { 
                    id: documentId, 
                    nif: companyId, 
                    name: document.name, 
                    content: outputData,
                    buffer: newPdf(outputData)
                };

                await UpdateDocument(documentUpdate);

                Dialog('Informacion', 'El documento ha sido actualizado correctamente.', DIALOG_TYPE.INFO);
                Navigate('editdocument', {id:documentId, backId: companyId});
            } catch (error) {
                console.error('Error al actualizar el documento:', error);
                Dialog('Error', 'No se ha podido actualizar el documento.', DIALOG_TYPE.ERROR);
            }
        });
    } else {
        AddEvent('.wininCreate', 'click', () => { 
            Modal('formdocument', { modeEdit: false })
            .then(async(documentData) => {
                try {
                    const outputData = await editor.save();
                    let document = { 
                        name: documentData.data.name,
                        content: outputData,
                        buffer: newPdf(outputData)
                    };
                    const documents = await SetDocuments(companyId, [document]);

                    if (documentData.selector != null) {
                        Object.keys(documentData.selector).forEach((employeeId) => {
                            if (documentData.selector[employeeId].toLowerCase() === 'on') {
                                const dateKey = Object.keys(documentData.selector).find(key => key.startsWith(employeeId) && key !== employeeId);
                                const date = dateKey ? documentData.selector[dateKey] : null;
                                SetEmployeeByDocument(employeeId, documents[0], date, (success) => {
                                    if(!success)
                                        Dialog('Error', 'No se ha podido guardar las referencias al usuario. Cree de nuevo las referencias en el documento.', DIALOG_TYPE.ERROR);
                                });
                            }
                        });
                    }
                    Navigate('editcompanies', {id:companyId});
                } catch (error) {
                    console.error('Error al guardar el documento:', error);
                    Dialog('Error', 'No se ha podido guardar el documento.', DIALOG_TYPE.ERROR);
                }
            });
        });
    }
}

function registerBackHandler(documentId, companyId) {
    if(documentId) AddEvent('.pgBack', 'click', () => { Navigate(ENTRY_POINTS_TYPE.EDIT_DOCUMENT, {id:documentId, backId: companyId}); });
    else AddEvent('.pgBack', 'click', () => { Navigate(ENTRY_POINTS_TYPE.EDIT_COMPANY, {id:companyId}); });
}