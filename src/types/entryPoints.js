/**
 * Objeto que define los puntos de entrada disponibles en la aplicación.
 * 
 * Este objeto agrupa constantes que representan los distintos orígenes o pantallas
 * desde las cuales se puede acceder a funcionalidades específicas del sistema.
 * Se utiliza para controlar flujos de navegación y renderizado condicional.
 * 
 * Los valores disponibles son:
 * - `EntryPointsType.NONE`: Sin punto de entrada definido.
 * - `EntryPointsType.MAIN`: Ventana principal.
 * - `EntryPointsType.FORM`: Formulario genérico.
 * - `EntryPointsType.FORM_DOCUMENT`: Formulario asociado a documentos.
 * - `EntryPointsType.EMPLOYEES`: Listado de empleados.
 * - `EntryPointsType.EDIT_EMPLOYEE`: Edición de empleados.
 * - `EntryPointsType.COURSES`: Listado de cursos.
 * - `EntryPointsType.VIEW_COURSE`: Visualización de un curso.
 * - `EntryPointsType.COMPANIES`: Listado de compañías.
 * - `EntryPointsType.EDIT_COMPANY`: Edición de compañías.
 * - `EntryPointsType.DOCUMENTS`: Creación de documentos.
 * - `EntryPointsType.EDIT_DOCUMENT`: Edición de documentos.
 * 
 * @readonly
 * @revision 0.0.0
 * @date 2025-04-23
 * @author guillermob
 */
const EntryPointsType = Object.freeze({
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

module.exports = EntryPointsType;
exports.EntryPointsType = EntryPointsType;