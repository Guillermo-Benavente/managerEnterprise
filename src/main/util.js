/**
 * Modifica el color de un SVG dado su URL y el color deseado.
 *
 * @param {string} url - URL del SVG.
 * @param {string} color - Color que se aplicará al SVG.
 * @returns {Promise<string>} - Retorna el SVG modificado.
 */
async function ModifySvgColor(url, color) {
    try {
        const response = await fetch(url);
        const svgContent = await response.text();
        const coloredSvg = svgContent.replace(/currentColor|fill="[^"]+"/g, `fill="${color}"`);
        return `url('data:image/svg+xml;utf8,${encodeURIComponent(coloredSvg)}')`;
    } catch (error) {
        console.error('Error al cargar el SVG:', error);
        throw new Error('No se pudo modificar el SVG');
    }
}

module.exports = { ModifySvgColor };