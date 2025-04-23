import { DOM, AddEvent, Navigate, Modal, GetPdf, Dialog } from 'Components/controlAPI.js';
import { SetEmployeeByDocument, UpdateEmployeeByDocument, DeleteEmployeeByDocument, GetDocument, UpdateDocument } from 'Components/dbAPI';
import * as pdfjsLib from 'pdfjs-dist';
import DIALOG_TYPE from 'Types/dialog.js';

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
    AddEvent('.wininCreate', 'click', () => { 
        Modal('formdocument', { modeEdit: true, documentId: documentId})
        .then(async (documentData) => {
            const tasks = [];

            try {
                const document = await GetDocument(documentId);
                if(documentData.data.name != document.name) {
                    const documentUpdate = { 
                        id: documentId,
                        name: documentData.data.name
                    };

                    tasks.push(new Promise(async(resolve) => {
                        await UpdateDocument(documentUpdate);
                        resolve(true);
                    }));
                }
            } catch (error) {
                console.error('Error al actualizar el documento:', error);
            }

            Object.keys(documentData.selector).forEach((key) => {
                const value = documentData.selector[key];
                const date = documentData.selector[key + 'date'] || null;
                const docId = documentData.selector[key + 'docId-data-id'];

                if (value?.toLowerCase?.() === 'on') {
                    if (docId) {
                        tasks.push(new Promise(async(resolve) => {
                            try {
                                await UpdateEmployeeByDocument({ id: docId, date});
                                resolve(true);
                            } catch (error) {
                                console.error('Error al actualizar la referencia del empleado:', error);
                            }
                        }));
                    } else {
                        tasks.push(new Promise(async(resolve) => {
                            try {
                                await SetEmployeeByDocument(key, documentId, date);
                                resolve(true);
                            } catch (error) {
                                console.error('Error al crear la referencia del empleado:', error);
                            }
                        }));
                    }
                } else if (key.endsWith('docId-data-id') && !documentData.selector[key.slice(0, -13)]) {
                    tasks.push(new Promise(async(resolve) => {
                        try {
                            await DeleteEmployeeByDocument(value);
                            resolve(true);
                        } catch (error) {
                            console.error('Error al eliminar la referencia del empleado:', error);
                        }
                    }));
                }
            });

            const results = await Promise.all(tasks);
            const allSuccess = results.every(success => success);

            if (allSuccess) Dialog('Información', 'Todos los cambios se han guardado correctamente.', DIALOG_TYPE.INFO);
            else Dialog('Error', 'Algunos cambios no se han podido aplicar.', DIALOG_TYPE.ERROR);
        });
    });
}

function registerEditHandler(companyId, documentId) {
    AddEvent('.pgEdit', 'click', () => { Navigate('createdocument', {id:companyId, documentId: documentId}); });
}

function registerBackHandler(companyId) {
    AddEvent('.pgBack', 'click', () => { Navigate('editcompanies', {id:companyId}); });
}