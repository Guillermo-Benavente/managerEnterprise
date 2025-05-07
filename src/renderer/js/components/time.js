function _parseDate(dateStr) {
    // Si ya es un objeto Date, devolverlo
    if (dateStr instanceof Date) return dateStr;
    
    // Si es null o undefined, devolver null
    if (!dateStr) return null;
    
    // Si es un string en formato DD/MM/AAAA
    if (typeof dateStr === 'string') {
        // Verificar si es formato español DD/MM/AAAA
        if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
            const [day, month, year] = dateStr.split('/').map(part => parseInt(part, 10));
            // Crear fecha especificando año, mes (0-indexado) y día
            return new Date(year, month - 1, day);
        }
        // Intentar parsear como fecha ISO o cualquier otro formato
        return new Date(dateStr);
    }
    
    return null;
}

// Función para formatear una fecha para un input[type=date]
export function formatDateForInput(date) {
    if (!date) return '';
    
    const d = _parseDate(date);
    if (!d || isNaN(d.getTime())) return '';
    
    // Formatear correctamente como AAAA-MM-DD para input[type=date]
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}