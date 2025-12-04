/**
 * Objeto que define las carpetas válidas del sistema dentro del espacio de usuario.
 * 
 * Este objeto agrupa constantes que representan las rutas relativas utilizadas
 * para almacenar distintos tipos de datos de la aplicación en el sistema de archivos.
 * Se emplea para acceder de forma segura y tipada a directorios conocidos.
 * 
 * Los valores disponibles son:
 * - `Folder.EMPLOYEES`: Carpeta de documentos de empleados.
 * - `Folder.COMPANIES`: Carpeta de documentos de empresas.
 * - `Folder.PROFILES`: Carpeta de documentos del perfil.
 * 
 * @readonly
 * @revision 0.0.0
 * @date 2025-07-29
 * @author guillermob
 */
const FolderType = Object.freeze({
  EMPLOYEES: 'employees',
  COMPANIES: 'companies',
  PROFILES: 'profiles',
});

module.exports = FolderType;
exports.FolderType = FolderType;