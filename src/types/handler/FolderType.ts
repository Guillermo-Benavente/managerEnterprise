/**
 * Objeto que define las carpetas válidas del sistema dentro del espacio de usuario.
 * 
 * Este objeto agrupa constantes que representan las rutas relativas utilizadas
 * para almacenar distintos tipos de datos de la aplicación en el sistema de archivos.
 * Se emplea para acceder de forma segura y tipada a directorios conocidos.
 * 
 * Los valores disponibles son:
 * - `Folder.Courses`: Carpeta de cursos.
 * - `Folder.Documents`: Carpeta de documentos.
 * 
 * @readonly
 * @revision 0.0.0
 * @date 2025-06-04
 * @author guillermob
 */
export const FolderType = {
  Courses: 'courses',
  Documents: 'documents',
} as const;

export type FolderType = typeof FolderType[keyof typeof FolderType];