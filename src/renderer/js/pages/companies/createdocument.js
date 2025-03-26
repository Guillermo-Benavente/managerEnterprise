import { DOM, AddEvent, GetElement, AddElement, Navigate, Modal, Dialog } from 'Components/controlAPI.js';
import { DOCUMENT, DOCUMENTBYEMPLOYEES, GetEmployees, UpdateCompany, SetDocuments, SetEmployeeByDocument, GetDocuments } from 'Components/dbAPI.js';
import { CreateForm } from 'Components/form.js';
import { CreateFormWindow } from 'Components/window.js';
import { newPdf } from 'Components/createPdf.js'
import Alert from 'Types/alert.js';
import Window from 'Types/window.js';
import EditorJS from '@editorjs/editorjs';
import Header from  '@editorjs/header' ; 
import List from  '@editorjs/list' ;
import Image from "@editorjs/image";
import Table from "@editorjs/table";
import Paragraph from '@editorjs/paragraph';
import { name } from 'file-loader';


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
            Modal('formdocument')
            .then((documentData) => {
                editor.save().then((outputData) => {
                    let document = { name: documentData.data.name };
                    document.content = outputData;
                    document.buffer = newPdf(outputData);

                    SetDocuments(companyId, [document], (success, documents) => {
                        if (success) {
                            if (documentData.selector != null) {
                                Object.keys(documentData.selector).forEach((employeeId) => {
                                    if (documentData.selector[employeeId].toLowerCase() === 'on') {
                                        const dateKey = Object.keys(documentData.selector).find(key => key.startsWith(employeeId) && key !== employeeId);
                                        const date = dateKey ? documentData.selector[dateKey] : null;
                                        SetEmployeeByDocument(employeeId, documents[0], date, (success) => {
                                            if(!success)
                                                Dialog('Error', 'No se ha podido guardar las referencias al usuario. Cree de nuevo las referencias en el documento.', Alert.ERROR);
                                        });
                                    }
                                });
                            }
                            Navigate('editcompanies', {id:companyId});
                        } else Dialog('Error', 'No se ha podido guardar el documento.', Alert.ERROR);
                    });
                }).catch((error) => {
                    console.log('Saving failed: ', error)
                });
            });
        });

            //const documentbyemployees = await Modal('form', { title: 'Empleados que necesitaran el documento', dataType: JSON.stringify(DOCUMENTBYEMPLOYEES) });


            /*editor.save().then((outputData) => {
                        document.content = outputData;
                        console.log(outputData);
                        document.buffer = newPdf(outputData);
                        SetDocuments(companyId, [document], (success) => {
                            if (success) {
                                
                                //AddEvent('.pgConfigDocument', 'click', () => { Navigate('selectdocumentemployee', {company:companyId,id:}); });
                            } else Dialog('Error', 'No se ha podido guardar el documento.', Alert.ERROR);
                        });
                    }).catch((error) => {
                        console.log('Saving failed: ', error)
                    });*/
            
            /*SetEmployee(FormatDbEmployee(employee), (success) => {
                    if (success) table.addRow(FormatEmployee(employee));
                    else Dialog('Error', 'No se ha podido añadir al empleado.', Alert.ERROR);
                });*/

            /*.then((document) => {
                Modal('newElement', { title: 'Empleados que necesitaran el documento', dataType: JSON.stringify(DOCUMENTBYEMPLOYEES) })
                .then((documentbyemployees) => {
                    
                    
                });
                
            });


            /*AddElement(CreateFormWindow('Documento', DOCUMENT,
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
                                    } else Dialog('Error', 'No se ha podido guardar el documento.', Alert.ERROR);
                                });
                            }).catch((error) => {
                                console.log('Saving failed: ', error)
                            });
                        }
                    , Window.SINGLE, 'Guardar Documento'));
                }
            , Window.MULTIPLE, 'Seleccionar Empleados'));*/
    }
});