import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';

// Registra el plugin con jsPDF
applyPlugin(jsPDF);

export function newPdf(content){
    const pdf = new jsPDF();
    let cursorY = 10;
    const pageHeight = pdf.internal.pageSize.height;
    content.blocks.forEach((block) => {
        switch (block.type) {
            case 'header': {
                const { text, level } = block.data;
                const fontSizes = [24, 20, 18, 16, 14, 12];
                const fontSize = fontSizes[level - 1] || 18;

                pdf.setFontSize(fontSize);
                cursorY = AddText(pdf, text, 10, cursorY);
                break;
            }
            case 'paragraph': {
                const { text } = block.data;
                pdf.setFontSize(12);
                cursorY = AddText(pdf, text, 10, cursorY);
                break;
            }
            case 'list': {
                const { items, style } = block.data;
                const bullet = style === 'ordered' ? (i) => `${i + 1}.` : () => '•';
                items.forEach((item, index) => {
                    cursorY = AddText(pdf, `${bullet(index)} ${item.content}`, 10, cursorY);
                });
                break;
            }
            case 'table': {
                const { content, withHeadings } = block.data;
                const head = withHeadings ? [content[0]] : [];
                const body = withHeadings ? content.slice(1) : content;
                pdf.autoTable({
                    startY: cursorY,
                    head: head,
                    body: body,
                    theme: 'grid',
                    styles: {
                        lineColor: 0,
                        textColor: 0,
                    },
                    headStyles: {
                        fillColor: 50,
                        textColor: 255,
                        fontStyle: 'bold'
                    },
                    didParseCell: (data) => {
                        // Si detectamos HTML en la celda, lo marcamos para procesar manualmente
                        data.cell.text = ''; // Evita que autoTable dibuje el texto
                    },
                    didDrawCell: (data) => {
                        const { x, y, width, height } = data.cell;

                        // Ajustamos la posición del texto en la celda
                        const adjustedX = x + 2;
                        const adjustedY = y + height / 2 + 2; // Centrado vertical aproximado

                        AddText(pdf, data.cell.raw, adjustedX, adjustedY, width);
                    }
                });
                cursorY = pdf.lastAutoTable.finalY + 10;
                break;
            }
            case 'image': {
                const { file, caption, stretched, withBackground, withBorder } = block.data;
                const imageUrl = file?.url;
                if (imageUrl) {
                    const imageWidth = stretched ? pdf.internal.pageSize.width - 20 : 50;
                    const imageHeight = stretched ? (imageWidth * 1) / 1 : 50;

                    if (cursorY + imageHeight + 10 > pageHeight) {
                        pdf.addPage();
                        cursorY = 10;
                    }

                    if (withBackground) {
                        pdf.setFillColor(220, 220, 220);
                        pdf.rect(10, cursorY, imageWidth, imageHeight, 'F');
                    }

                    if (withBorder) {
                        pdf.setDrawColor(0, 0, 0);
                        pdf.setLineWidth(1);
                        pdf.rect(10, cursorY, imageWidth, imageHeight);
                    }

                    pdf.addImage(imageUrl, 'WEBP', 10, cursorY, imageWidth, imageHeight);
                    cursorY += imageHeight + 10;

                    if (caption) {
                        cursorY = AddText(pdf, caption, 10, cursorY);
                    }
                }
                break;
            }
            default:
                console.warn(`Tipo no soportado: ${block.type}`);
                break;
        }
    });
    return pdf.output('arraybuffer');
}

function decodeHtmlEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

function AddText(pdf, text, x, y) {
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(text, 'text/html');
    const elements = parsedHtml.body.childNodes;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;

    const margin = 10; // Margen de la página
    const lineHeight = 10; // Altura de línea estimada
    let cursorX = x;
    let cursorY = y;

    const applyStyles = (node, baseStyle) => {
        const tagName = node.tagName?.toLowerCase() || '';
        let isBold = baseStyle.includes('bold');
        let isItalic = baseStyle.includes('italic');

        if (tagName === 'b' || tagName === 'strong') isBold = true;
        if (tagName === 'i' || tagName === 'em') isItalic = true;

        const combinedStyle = `${isBold ? 'bold' : ''}${isItalic ? 'italic' : ''}`;
        return combinedStyle || 'normal';
    };

    const checkPositionOfText = (text, x, y) => {
        const textWidth = pdf.getTextWidth(text || '');
        let newX = x;
        let newY = y;

        // Verificar si el texto cabe en la línea actual
        if (newX + textWidth > pageWidth - margin) {
            newX = margin;
            newY += lineHeight;
        }
        
        // Verificar si se sobrepasa el alto de la página
        if (newY + lineHeight > pageHeight - margin) {
            pdf.addPage();
            newX = margin;
            newY = margin;
        }
        
        return { x: newX, y: newY, withText: textWidth };
    }

    const renderNode = (node, baseStyle = 'normal') => {
        if (node.nodeType === Node.TEXT_NODE) {
            const words = node.textContent.match(/(\s+|\S+)/g) || [];
            words.forEach((word, _) => {
                const positions = checkPositionOfText(word, cursorX, cursorY);
                
                cursorX = positions.x;
                cursorY = positions.y;

                // Dibujar la palabra
                pdf.setFont(undefined, baseStyle);
                pdf.text(word, cursorX, cursorY);
                // TODO mirar como mejorar el comportamiento del espacio 
                const addcursor = word === ' ' && baseStyle != 'normal' ? pdf.getTextWidth(' ') + positions.withText : positions.withText
                cursorX += addcursor;
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            const newStyle = applyStyles(node, baseStyle);

            if (tagName === 'a') {
                const href = node.getAttribute('href');
                const positions = checkPositionOfText(node.textContent, cursorX, cursorY);
                
                cursorX = positions.x;
                cursorY = positions.y;

                // Dibujar el enlace
                pdf.setFont(undefined, 'normal');
                pdf.setTextColor(0, 0, 255);
                pdf.textWithLink(node.textContent, cursorX, cursorY, { url: href });
                cursorX += positions.withText;
                pdf.setTextColor(0, 0, 0);
            } else if(tagName === 'span') {
                const child = node.firstChild;
                child.textContent = `{${child.textContent}}`;
                renderNode(child, newStyle);
            } else {
                node.childNodes.forEach(child => renderNode(child, newStyle));
            }
        }
    };

    elements.forEach(node => {
        renderNode(node);
    });

    return cursorY + 10; // Retornar la posición actualizada de `y`
}