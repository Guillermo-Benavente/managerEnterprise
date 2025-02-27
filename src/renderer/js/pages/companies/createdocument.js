import { DOM, AddEvent, GetElement, AddElement, Navigate } from 'Components/controlAPI.js';
import { DOCUMENT, UpdateCompany, SetDocuments, GetDocuments } from 'Components/dbAPI.js';
import { CreateForm, CreateChangeDateForm } from 'Components/form.js';
import { CreateFormWindow, AlertWindow } from 'Components/window.js';
import { newPdf } from 'Components/createPdf.js'
import Alert from 'Types/alert.js';
import Window from 'Types/window.js';
import EditorJS from '@editorjs/editorjs';
import Header from  '@editorjs/header' ; 
import List from  '@editorjs/list' ;
import Image from "@editorjs/image";
import Table from "@editorjs/table";
import Paragraph from '@editorjs/paragraph';


DOM(() => {
    const companyId = new URLSearchParams(window.location.search).get('id');

    AddEvent('.pgBack', 'click', () => { Navigate('editcompanies', {id:companyId}); });

    window.onload = () => {
        const editor = new EditorJS({
            holder: 'edt',
            spellcheck: false,
            tools: {
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
            },
            placeholder: 'Escribe tu contenido aquí...',
            autofocus: true
        });

        AddEvent('.wininCreate', 'click', () => {
            AddElement(CreateFormWindow('Documento', DOCUMENT,
                (document) => {
                    AddElement(CreateFormWindow('Nombre del documento', DOCUMENTBYEMPLOYEES,
                        (documentbyemployees) => {
                            editor.save().then((outputData) => {
                                document.content = outputData;
                                console.log(outputData);
                                document.buffer = newPdf(outputData);
                                SetDocuments(companyId, [document], (success) => {
                                    if (success) {
                                        
                                        //AddEvent('.pgConfigDocument', 'click', () => { Navigate('selectdocumentemployee', {company:companyId,id:}); });
                                    } else AddElement(AlertWindow('error','No se ha podido guardar el documento'));
                                });
                            }).catch((error) => {
                                console.log('Saving failed: ', error)
                            });
                        }
                    , Window.SINGLE, 'Guardar Documento'));
                }
            , Window.MULTIPLE, 'Seleccionar Empleados'));
        });
    }
});