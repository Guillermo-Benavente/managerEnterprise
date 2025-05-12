/**
 * Objeto que define variables en línea para identificar entidades específicas dentro de los datos.
 *
 * Se utiliza para mapear claves a valores inmutables, facilitando la identificación de ciertos
 * campos en estructuras de datos.
 *
 * Las variables disponibles son:
 * - `VarInlineName.NONE`: Indica la ausencia de una variable específica.
 * - `VarInlineName.EMPLOYEE_NAME`: Representa el nombre del empleado.
 * - `VarInlineName.EMPLOYEE_SIGNATURE`: Representa la firma del empleado.
 * - `VarInlineName.COMPANY_NAME`: Representa el nombre de la compañía.
 * - `VarInlineName.DOCUMENT_DATE`: Representa la fecha del documento.
 *
 * @readonly
 * @revision 0.0.0
 * @date 2025-04-14
 * @author guillermob
 */
const VarInlineName = Object.freeze({
  NONE: 'none',
  EMPLOYEE_NAME: 'employee_name',
  EMPLOYEE_SIGNATURE: 'company_name',
  COMPANY_NAME: 'employee_signature',
  DOCUMENT_DATE: 'document_date',
});

export default VarInlineName;

