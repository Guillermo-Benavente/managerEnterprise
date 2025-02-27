import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
                    },
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
    return pdf.output("arraybuffer");
    pdf.save(`${content.name || 'document'}.pdf`);
}

function decodeHtmlEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

function AddText(pdf, text, x, y) {
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(text, "text/html");
    const elements = parsedHtml.body.childNodes;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;

    const margin = 10; // Margen de la página
    const lineHeight = 10; // Altura de línea estimada
    let cursorX = x;

    const applyStyles = (node, baseStyle) => {
        const tagName = node.tagName?.toLowerCase() || "";
        let isBold = baseStyle.includes("bold");
        let isItalic = baseStyle.includes("italic");

        if (tagName === "b" || tagName === "strong") isBold = true;
        if (tagName === "i" || tagName === "em") isItalic = true;

        const combinedStyle = `${isBold ? "bold" : ""}${isItalic ? "italic" : ""}`;
        return combinedStyle || "normal";
    };

    const checkAndAddPageIfNeeded = (textHeight, y) => {
        if (y + textHeight > pageHeight - margin) {
            pdf.addPage();
            return { x: margin, y: margin }; // Reiniciar posiciones en nueva página
        }
        return { x: cursorX, y };
    };

    const renderNode = (node, baseStyle = "normal") => {
        if (node.nodeType === Node.TEXT_NODE) {
            const words = node.textContent.split(" "); // Dividir en palabras para un control granular
            words.forEach((word, index) => {
                const wordWithSpace = index < words.length - 1 ? word + " " : word;
                const textWidth = pdf.getTextWidth(wordWithSpace);

                if (cursorX + textWidth > pageWidth - margin) {
                    // Saltar a la siguiente línea si no cabe el texto
                    y += lineHeight;
                    cursorX = margin;

                    // Verificar si necesitamos agregar una nueva página
                    const positions = checkAndAddPageIfNeeded(lineHeight, y);
                    cursorX = positions.x;
                    y = positions.y;
                }

                // Dibujar la palabra
                pdf.setFont(undefined, baseStyle);
                pdf.text(wordWithSpace, cursorX, y);
                cursorX += textWidth;
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            const newStyle = applyStyles(node, baseStyle);

            if (tagName === "a") {
                const href = node.getAttribute("href");
                const textWidth = pdf.getTextWidth(node.textContent);

                if (cursorX + textWidth > pageWidth - margin) {
                    // Saltar a la siguiente línea si no cabe el enlace
                    y += lineHeight;
                    cursorX = margin;

                    // Verificar si necesitamos agregar una nueva página
                    const positions = checkAndAddPageIfNeeded(lineHeight, y);
                    cursorX = positions.x;
                    y = positions.y;
                }

                // Dibujar el enlace
                pdf.setFont(undefined, "normal");
                pdf.setTextColor(0, 0, 255);
                pdf.textWithLink(node.textContent, cursorX, y, { url: href });
                cursorX += textWidth;
                pdf.setTextColor(0, 0, 0);
            } else {
                node.childNodes.forEach(child => renderNode(child, newStyle));
            }
        }
    };

    elements.forEach(node => {
        renderNode(node);
    });

    return y + 10; // Retornar la posición actualizada de `y`
}