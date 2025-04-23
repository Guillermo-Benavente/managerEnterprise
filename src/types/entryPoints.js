/**
 * Objeto que define los puntos de entrada disponibles en la aplicación.
 * 
 * Este objeto agrupa constantes que representan los distintos orígenes o pantallas
 * desde las cuales se puede acceder a funcionalidades específicas del sistema.
 * Se utiliza para controlar flujos de navegación y renderizado condicional.
 * 
 * Los valores disponibles son:
 * - `ENTRY_POINTS_TYPE.NONE`: Sin punto de entrada definido.
 * - `ENTRY_POINTS_TYPE.MAIN`: Ventana principal.
 * - `ENTRY_POINTS_TYPE.FORM`: Formulario genérico.
 * - `ENTRY_POINTS_TYPE.FORM_DOCUMENT`: Formulario asociado a documentos.
 * - `ENTRY_POINTS_TYPE.EMPLOYEES`: Listado de empleados.
 * - `ENTRY_POINTS_TYPE.EDIT_EMPLOYEE`: Edición de empleados.
 * - `ENTRY_POINTS_TYPE.COURSES`: Listado de cursos.
 * - `ENTRY_POINTS_TYPE.VIEW_COURSE`: Visualización de un curso.
 * - `ENTRY_POINTS_TYPE.COMPANIES`: Listado de compañías.
 * - `ENTRY_POINTS_TYPE.EDIT_COMPANY`: Edición de compañías.
 * - `ENTRY_POINTS_TYPE.DOCUMENTS`: Creación de documentos.
 * - `ENTRY_POINTS_TYPE.EDIT_DOCUMENT`: Edición de documentos.
 * 
 * @readonly
 * @revision 0.0.0
 * @date 2025-04-23
 * @author guillermob
 */
const ENTRY_POINTS_TYPE = Object.freeze({
  NONE: 'none',
  MAIN: 'main_window',
  FORM: 'form',
  FORM_DOCUMENT: 'formdocument',
  EMPLOYEES: 'employees',
  EDIT_EMPLOYEE: 'editemployees',
  COURSES: 'courseemployees',
  VIEW_COURSE: 'viewcourse',
  COMPANIES: 'companies',
  EDIT_COMPANY: 'editcompanies',
  DOCUMENTS: 'createdocument',
  EDIT_DOCUMENT: 'editdocument',
});

module.exports = ENTRY_POINTS_TYPE;
exports.ENTRY_POINTS_TYPE = ENTRY_POINTS_TYPE;