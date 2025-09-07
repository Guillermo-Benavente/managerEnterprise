import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useInView } from 'react-intersection-observer';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import style from './pdfViewer.module.css';
import { ZoomIn, ZoomOut } from 'lucide-react';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';

pdfjs.GlobalWorkerOptions.workerSrc = '../assets/workers/pdf.worker.min.mjs';

function LazyPage({ pageNumber, scale }) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px 0px' });

  return (
    <div ref={ref} style={{ minHeight: `${scale * 800}px`, marginBottom: '1rem' }}>
      {inView && <Page pageNumber={pageNumber} scale={scale} />}
    </div>
  );
}

export default function PdfViewer({ fileUrl, showOptions = false }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.25);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  //TODO: Arreglar el zoom, al parecer los botones al hacer scroll lateral no funcionan bien
  return (
    <div className={`${style.document} ${showOptions ? style.documentMinus : ''}`}>
      <div className={style.options}>
        <Button type={ButtonType.FLOAT} onClick={() => setScale(prev => prev + 0.25)}><ZoomIn /></Button>
        <Button type={ButtonType.FLOAT} onClick={() => setScale(prev => Math.max(prev - 0.25, 0.25))}><ZoomOut /></Button>
      </div>
      <div className={style.pages}>
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading="Cargando PDF..."
        >
          {Array.from(new Array(numPages), (_, index) => (
            <LazyPage key={index + 1} pageNumber={index + 1} scale={scale} />
          ))}
        </Document>
      </div>
    </div>
  );
} 