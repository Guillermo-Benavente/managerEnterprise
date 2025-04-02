import { DOM, AddEvent, Navigate, GetPdf } from 'Components/controlAPI.js';

DOM(() => {
    const documentId = new URLSearchParams(window.location.search).get('id');
    const companyId = new URLSearchParams(window.location.search).get('backId');
    console.log(companyId)
    AddEvent('.pgBack', 'click', () => { Navigate('editcompanies', {id:companyId}); });

    GetPdf('documents',companyId, documentId).then(pdfPath => {
        document.getElementById('pdfFrame').src = `file://${pdfPath}`;
    });
});