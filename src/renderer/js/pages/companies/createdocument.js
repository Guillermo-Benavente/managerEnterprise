import { DOM, AddEvent, Navigate, Modal, Dialog } from 'Components/controlAPI.js';
import { SetDocuments, SetEmployeeByDocument, GetDocument, UpdateDocument } from 'Components/dbAPI.js';
import { newPdf } from 'Components/createPdf.js'
import VariableInline from 'Components/editor/variableInline.js'
import DIALOG_TYPE from 'Types/dialog.js';
import EditorJS from '@editorjs/editorjs';
import Header from  '@editorjs/header' ; 
import List from  '@editorjs/list' ;
import Image from "@editorjs/image";
import Table from "@editorjs/table";
import Paragraph from '@editorjs/paragraph';
import VAR_INLINE_NAME from 'Types/varInlineName';


DOM(() => {
    const companyId = new URLSearchParams(window.location.search).get('id');
    const documentId = new URLSearchParams(window.location.search).get('documentId');

    const tools = {
        variable: {
            class: VariableInline,
            config: {
                variables: [
                { key: VAR_INLINE_NAME.EMPLOYEE_NAME, label: 'Nombre del Empleado' },
                { key: VAR_INLINE_NAME.COMPANY_NAME, label: 'Nombre de la Empresa' },
                { key: VAR_INLINE_NAME.EMPLOYEE_SIGNATURE, label: 'Firma del empleado' }
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
    let editor;

    if(documentId) {
        AddEvent('.pgBack', 'click', () => { Navigate('editdocument', {id:documentId, backId: companyId}); });
        
        GetDocument(documentId, (success, data) => {
            if(success){
                editor = new EditorJS({
                    holder: 'edt',
                    spellcheck: false,
                    tools: tools,
                    placeholder: 'Escribe tu contenido aquí...',
                    autofocus: true,
                    onReady: () => editor.render(JSON.parse(data.content))
                });

                AddEvent('.wininCreate', 'click', () => {
                    editor.save().then((outputData) => {
                        let document = { 
                            id: documentId, 
                            nif: companyId, 
                            name: data.name, 
                            content: outputData,
                            buffer: newPdf(outputData)
                        };

                        UpdateDocument(document, (success) => {
                            if(success){
                                Dialog('Informacion', 'El documento ha sido actualizado correctamente.', DIALOG_TYPE.INFO);
                                Navigate('editdocument', {id:documentId, backId: companyId});
                            } else Dialog('Error', 'No se ha podido actualizar el documento.', DIALOG_TYPE.ERROR);
                        });
                    }).catch((error) => {
                        console.log('Saving failed: ', error)
                    });
                });
            }
        });
    } 
    else {
        AddEvent('.pgBack', 'click', () => { Navigate('editcompanies', {id:companyId}); });

        editor = new EditorJS({
            holder: 'edt',
            spellcheck: false,
            tools: tools,
            placeholder: 'Escribe tu contenido aquí...',
            autofocus: true
        });

        AddEvent('.wininCreate', 'click', () => { 
            Modal('formdocument', { modeEdit: false })
            .then((documentData) => {
                editor.save().then((outputData) => {
                    let document = { 
                        name: documentData.data.name,
                        conent: outputData,
                        buffer: newPdf(outputData)
                    };

                    SetDocuments(companyId, [document], (success, documents) => {
                        if (success) {
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
                        } else Dialog('Error', 'No se ha podido guardar el documento.', DIALOG_TYPE.ERROR);
                    });
                }).catch((error) => {
                    console.log('Saving failed: ', error)
                });
            });
        });
    }
});