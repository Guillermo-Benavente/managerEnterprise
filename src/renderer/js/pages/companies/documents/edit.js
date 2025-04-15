import { DOM, AddEvent, Navigate, Modal, GetPdf, Dialog } from 'Components/controlAPI.js';
import { SetEmployeeByDocument, UpdateEmployeeByDocument, DeleteEmployeeByDocument, GetDocument, UpdateDocument } from 'Components/dbAPI';
import * as pdfjsLib from 'pdfjs-dist';
import DIALOG_TYPE from 'Types/dialog.js';

DOM(() => {
    const documentId = new URLSearchParams(window.location.search).get('id');
    const companyId = new URLSearchParams(window.location.search).get('backId');
    AddEvent('.pgBack', 'click', () => { Navigate('editcompanies', {id:companyId}); });
    AddEvent('.pgEdit', 'click', () => { Navigate('createdocument', {id:companyId, documentId: documentId}); });

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

    AddEvent('.wininCreate', 'click', () => { 
        Modal('formdocument', { modeEdit: true, documentId: documentId})
        .then(async (documentData) => {
            const tasks = [];

            GetDocument(documentId, (success, data) => {
                if(success && documentData.data.name != data.name) {
                    const document = { 
                        id: documentId,
                        name: documentData.data.name
                    };

                    tasks.push(new Promise(resolve => {
                        UpdateDocument(document, success => resolve(success));
                    }));
                }
            });

            Object.keys(documentData.selector).forEach((key) => {
                const value = documentData.selector[key];
                const date = documentData.selector[key + 'date'] || null;
                const docId = documentData.selector[key + 'docId-data-id'];

                if (value?.toLowerCase?.() === 'on') {
                    if (docId) {
                        tasks.push(new Promise(resolve => {
                            UpdateEmployeeByDocument({ id: docId, date }, success => resolve(success));
                        }));
                    } else {
                        tasks.push(new Promise(resolve => {
                            SetEmployeeByDocument(key, documentId, date, success => resolve(success));
                        }));
                    }
                } else if (key.endsWith('docId-data-id') && !documentData.selector[key.slice(0, -13)]) {
                    tasks.push(new Promise(resolve => {
                        DeleteEmployeeByDocument(value, success => resolve(success));
                    }));
                }
            });

            const results = await Promise.all(tasks);
            const allSuccess = results.every(success => success);

            if (allSuccess) Dialog('Información', 'Todos los cambios se han guardado correctamente.', DIALOG_TYPE.INFO);
            else Dialog('Error', 'Algunos cambios no se han podido aplicar.', DIALOG_TYPE.ERROR);
        });
    });
});