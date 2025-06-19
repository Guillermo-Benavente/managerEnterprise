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

async function safeTask(fn) {
  try {
    await fn();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function registerCreateHandler(documentId) {
    let isProcessing = false;

    AddEvent('click', () => { 
        if (!isProcessing) {
            isProcessing = true;
            Modal(EntryPointsType.FORM_DOCUMENT, { modeEdit: true, documentId: documentId})
            .then(async (documentData) => {
                if (documentData) {
                    const tasks = [];

                    try {
                        let document = await dbAPI[docKeys.GETONE](documentId);
                        if(documentData.data.name != document.name) {
                            document.name = documentData.data.name;

                            tasks.push(safeTask(async () => {
                                await dbAPI[docKeys.UPDATE](document);
                            }));
                        }
                    } catch (error) {
                        console.error('Error al actualizar el documento:', error);
                    }

                    Object.entries(documentData.selector).forEach(([key, data]) => {
                        const checkbox = data.value?.toLowerCase();

                        if (checkbox === 'on') {
                            if (data.docId) {
                                tasks.push(safeTask(async () => {
                                    const ebd = await dbAPI[ebdKeys.GETONE](data.docId);
                                    ebd.date = data.date || null;
                                    await dbAPI[ebdKeys.UPDATE](ebd);
                                }));
                            } else tasks.push(
                                safeTask(async () => await dbAPI[ebdKeys.INSERT](key, documentId, data.date || null))
                            );
                        } else if (data.docId && checkbox !== 'on') tasks.push(
                            safeTask(async () => await dbAPI[ebdKeys.DELETE](data.docId))
                        );
                    });

                    const results = await Promise.all(tasks);
                    const allSuccess = results.every(success => success);

                    if (allSuccess) Dialog('Información', 'Todos los cambios se han guardado correctamente.', DialogType.INFO);
                    else Dialog('Error', 'Algunos cambios no se han podido aplicar.', DialogType.ERROR);
                }
                isProcessing = false;
            });
        }
    }, '.wininCreate');
}

function registerEditHandler(companyId, documentId) {
    AddEvent('click', () => { Navigate(EntryPointsType.DOCUMENTS, {id:companyId, documentId: documentId}); }, '.pgEdit');
}

function registerBackHandler(companyId) {
    AddEvent('click', () => { Navigate(EntryPointsType.EDIT_COMPANY, {id:companyId}); }, '.pgBack');
}