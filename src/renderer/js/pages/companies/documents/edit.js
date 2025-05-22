import { DOM, AddEvent, Navigate, Modal, GetPdf, Dialog } from 'Components/controlAPI.js';
import dbAPI, { keys } from 'Components/dbAPI';
import * as pdfjsLib from 'pdfjs-dist';
import TableName from 'Types/handler/TableName.js';
import DialogType from 'Types/dialog.js';
import EntryPointsType from 'Types/entryPoints.js';

const docKeys = keys(TableName.DOCUMENT);
const ebdKeys = keys(TableName.EMPLOYEEBYDOCUMENT);

DOM(() => {
    const documentId = new URLSearchParams(window.location.search).get('id');
    const companyId = new URLSearchParams(window.location.search).get('backId');

    registerBackHandler(companyId);
    registerEditHandler(companyId, documentId);
    init(companyId, documentId);
    registerCreateHandler(documentId);
});

function init(companyId, documentId){
    const url = GetPdf('documents', companyId, documentId);
    const pdfContainer = document.querySelector('.pdfContainer');

    pdfjsLib.GlobalWorkerOptions.workerSrc = '../assets/workers/pdf.worker.min.mjs';

    pdfjsLib.getDocument(url).promise.then(pdf => {
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(page => {
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                pdfContainer.appendChild(canvas);

                const context = canvas.getContext('2d');
                page.render({ canvasContext: context, viewport });
            });
        }
    });
}

function registerCreateHandler(documentId) {
    let isProcessing = false;

    AddEvent('.wininCreate', 'click', () => { 
        if (!isProcessing) {
            isProcessing = true;
            Modal(EntryPointsType.FORM_DOCUMENT, { modeEdit: true, documentId: documentId})
            .then(async (documentData) => {
                const tasks = [];

                try {
                    let document = await dbAPI[docKeys.GETONE](documentId);
                    if(documentData.data.name != document.name) {
                        document.name = documentData.data.name;

                        tasks.push(new Promise(async(resolve) => {
                            await dbAPI[docKeys.UPDATE](document);
                            resolve(true);
                        }));
                    }
                } catch (error) {
                    console.error('Error al actualizar el documento:', error);
                }

                //TODO mejorar la legibilidad de este codigo es un caos
                Object.keys(documentData.selector).forEach((key) => {
                    const value = documentData.selector[key];
                    const date = documentData.selector[key + 'date'] || null;
                    const ebdId = documentData.selector[key + 'docId-data-id'];

                    if (value?.toLowerCase?.() === 'on') {
                        if (ebdId) {
                            tasks.push(new Promise(async(resolve) => {
                                try {
                                    const ebd = await dbAPI[ebdKeys.GETONE](ebdId);
                                    ebd.date = date;
                                    await dbAPI[ebdKeys.UPDATE](ebd);
                                    resolve(true);
                                } catch (error) {
                                    console.error('Error al actualizar la referencia del empleado:', error);
                                }
                            }));
                        } else {
                            tasks.push(new Promise(async(resolve) => {
                                try {
                                    await dbAPI[ebdKeys.INSERT](key, documentId, date);
                                    resolve(true);
                                } catch (error) {
                                    console.error('Error al crear la referencia del empleado:', error);
                                }
                            }));
                        }
                    } else if (key.endsWith('docId-data-id') && !documentData.selector[key.slice(0, -13)]) {
                        tasks.push(new Promise(async(resolve) => {
                            try {
                                await dbAPI[ebdKeys.DELETE](value);
                                resolve(true);
                            } catch (error) {
                                console.error('Error al eliminar la referencia del empleado:', error);
                            }
                        }));
                    }
                });

                const results = await Promise.all(tasks);
                const allSuccess = results.every(success => success);

                if (allSuccess) Dialog('Información', 'Todos los cambios se han guardado correctamente.', DialogType.INFO);
                else Dialog('Error', 'Algunos cambios no se han podido aplicar.', DialogType.ERROR);
            });
        }
    });
}

function registerEditHandler(companyId, documentId) {
    AddEvent('.pgEdit', 'click', () => { Navigate(EntryPointsType.DOCUMENTS, {id:companyId, documentId: documentId}); });
}

function registerBackHandler(companyId) {
    AddEvent('.pgBack', 'click', () => { Navigate(EntryPointsType.EDIT_COMPANY, {id:companyId}); });
}