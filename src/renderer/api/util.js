export const FormatDate = (date) => window.utilAPI.formatDate(date);
export const FormatObjectLD = (obj) => window.utilAPI.formatObjectLD(obj);
export const ExportCSV = (data, filePath) => window.utilAPI.exportCSV(data, filePath);
/**
 * Obtiene la URL de un archivo PDF específico en el servidor.
 * 
 * La función envuelve la API `controlAPI.getPdfUrl(type, user, name)` y genera una URL para acceder a un PDF
 * basado en el tipo, el usuario y el nombre del archivo. La URL generada es la ruta completa hacia el archivo PDF
 * en el servidor.
 * 
 * @param {string} type El tipo de documento PDF que se desea obtener (por ejemplo, 'invoices', 'reports').
 * @param {string} user El nombre de usuario asociado con el archivo PDF.
 * @param {string} name El nombre del archivo PDF (sin la extensión `.pdf`).
 * 
 * @returns {string} La URL completa que apunta al archivo PDF solicitado en el servidor.
 * 
 * @example
 * // Ejemplo de uso:
 * const pdfUrl = GetPdf('invoices', 'john_doe', 'invoice123');
 * console.log(pdfUrl); // "http://localhost:3500/pdf/invoices/john_doe/invoice123"
 * 
 * @remarks
 * La URL generada es una ruta relativa al servidor en ejecución. El servidor debe estar configurado y en funcionamiento 
 * para poder acceder al archivo PDF.
 * 
 * La URL utiliza una ruta del tipo `http://<server-url>/pdf/<type>/<user>/<name>.pdf`, donde el servidor proporciona
 * acceso al archivo PDF correspondiente.
 * 
 * @revision 0.0.0
 * @date 2025-04-10
 * @author guillermob
 */
export const GetPdf = (type, user, name) => window.utilAPI.getPdfUrl(type, user, name);