import { AddEvent, DOM, GetPdf, Navigate } from "Components/controlAPI";
import * as pdfjsLib from 'pdfjs-dist';
import ENTRY_POINTS_TYPE from "Types/entryPoints.js";

DOM(() =>{
    const courseId = new URLSearchParams(window.location.search).get('id');
    const employeeId = new URLSearchParams(window.location.search).get('backId');

    registerBackHandler(employeeId);
    init(courseId, employeeId);
});

function init(courseId, employeeId) {
    const url = GetPdf('courses', employeeId, courseId);
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

function registerBackHandler(employeeId) {
    AddEvent('.pgBack', 'click', () => { Navigate(ENTRY_POINTS_TYPE.COURSES, {id:employeeId} ); });
}