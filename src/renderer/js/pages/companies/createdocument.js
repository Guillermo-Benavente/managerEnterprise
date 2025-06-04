import { DOM, AddEvent, Navigate, Modal, Dialog } from 'Components/controlAPI.js';
import dbAPI, { keys } from 'Components/dbAPI.js';
import { newPdf } from 'Components/createPdf.js'
import VariableInline from 'Components/editor/variableInline.js'
import TableName from 'Types/handler/TableName.js';
import DialogType from 'Types/dialog.js';
import VarInlineName from 'Types/varInlineName';
import EntryPointsType from 'Types/entryPoints.js';
import EditorJS from '@editorjs/editorjs';
import Header from  '@editorjs/header' ; 
import List from  '@editorjs/list' ;
import Image from "@editorjs/image";
import Table from "@editorjs/table";
import Paragraph from '@editorjs/paragraph';

const docKeys = keys(TableName.DOCUMENT);
const ebdKeys = keys(TableName.EMPLOYEEBYDOCUMENT);

DOM(async() => {
    const companyId = new URLSearchParams(window.location.search).get('id');
    const documentId = new URLSearchParams(window.location.search).get('documentId');

    registerBackHandler(documentId, companyId);
    try {
        const document = documentId ? await dbAPI[docKeys.GETONE](documentId) : null;
        const editor = await init(document, configEditorTools());
        registerCreateHandler(documentId, document, companyId, editor);
    } catch (error) {
        console.error('Error al obtener el documento:', error);
        Dialog('Error', 'No se ha podido cargar el documento.', DialogType.ERROR);
    }
    
});

async function init(document, tools) {
    const editor = new EditorJS({
        holder: 'edt',
        spellcheck: false,
        tools,
        placeholder: 'Escribe tu contenido aquí...',
        autofocus: true,
        onReady: () => { if (document) editor.render(document.content); }
    });

    return editor;
}

function configEditorTools() {
    return {
        variable: {
            class: VariableInline,
            config: {
                variables: [
                { key: VarInlineName.EMPLOYEE_NAME, label: 'Nombre del Empleado' },
                { key: VarInlineName.COMPANY_NAME, label: 'Nombre de la Empresa' },
                { key: VarInlineName.EMPLOYEE_SIGNATURE, label: 'Firma del empleado' },
                { key: VarInlineName.DOCUMENT_DATE, label: 'Fecha del documento' }
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
    let isProcessing = false;

    AddEvent('.wininCreate', 'click', async() => {
        if (!isProcessing) {
            isProcessing = true;
            if (document) {
                try {
                    const outputData = await editor.save();

                    const documentUpdate = { 
                        id: documentId, 
                        company: companyId, 
                        name: document.name, 
                        content: outputData,
                        url: document.url,
                        buffer: newPdf(outputData),
                    };

                    await dbAPI[docKeys.UPDATE](documentUpdate);

                    Dialog('Informacion', 'El documento ha sido actualizado correctamente.', DialogType.INFO);
                    Navigate(EntryPointsType.EDIT_DOCUMENT, {id:documentId, backId: companyId});
                } catch (error) {
                    console.error('Error al actualizar el documento:', error);
                    Dialog('Error', 'No se ha podido actualizar el documento.', DialogType.ERROR);
                }
                isProcessing = false;
            } else {
                Modal(EntryPointsType.FORM_DOCUMENT, { modeEdit: false })
                .then(async(documentData) => {
                    if (documentData){
                        try {
                            const outputData = await editor.save();
                            let document = { 
                                name: documentData.data.name,
                                content: outputData,
                                buffer: newPdf(outputData)
                            };
                            const documentId = (await dbAPI[docKeys.INSERT](companyId, [document]))[0];
                            
                            if (documentData.selector != null) {
                                Object.keys(documentData.selector).forEach((employeeId) => {
                                    if (documentData.selector[employeeId].toLowerCase() === 'on') {
                                        const dateKey = Object.keys(documentData.selector).find(key => key.startsWith(employeeId) && key !== employeeId);
                                        const date = dateKey ? documentData.selector[dateKey] : null;
                                        dbAPI[ebdKeys.INSERT](employeeId, documentId, date);
                                    }
                                });
                            }
                            Navigate(EntryPointsType.EDIT_COMPANY, {id:companyId});
                        } catch (error) {
                            console.error('Error al guardar el documento:', error);
                            Dialog('Error', 'No se ha podido guardar el documento.', DialogType.ERROR);
                        }
                    }
                    isProcessing = false;
                });
            }
        }
    });
}

function registerBackHandler(documentId, companyId) {
    if(documentId) AddEvent('.pgBack', 'click', () => { Navigate(EntryPointsType.EDIT_DOCUMENT, {id:documentId, backId: companyId}); });
    else AddEvent('.pgBack', 'click', () => { Navigate(EntryPointsType.EDIT_COMPANY, {id:companyId}); });
}