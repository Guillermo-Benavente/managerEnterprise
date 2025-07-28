import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useInView } from 'react-intersection-observer';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import style from './pdfViewer.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = '../assets/workers/pdf.worker.min.mjs';

function LazyPage({ pageNumber, scale }) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px 0px' });

  return (
    <div ref={ref} style={{ minHeight: `${scale * 800}px`, marginBottom: '1rem' }}>
      {inView && <Page pageNumber={pageNumber} scale={scale} />}
    </div>
  );
}

export default function PdfViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className={style.document}>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Cargando PDF..."
      >
        {Array.from(new Array(numPages), (_, index) => (
          <LazyPage key={index + 1} pageNumber={index + 1} scale={1.25} />
        ))}
      </Document>
    </div>
  );
}