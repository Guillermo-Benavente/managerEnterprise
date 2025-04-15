// @ts-check

/**
 * Objeto que define variables en línea para identificar entidades específicas dentro de los datos.
 *
 * Se utiliza para mapear claves a valores inmutables, facilitando la identificación de ciertos
 * campos en estructuras de datos.
 *
 * Las variables disponibles son:
 * - `VAR_INLINE_NAME.NONE`: Indica la ausencia de una variable específica.
 * - `VAR_INLINE_NAME.EMPLOYEE_NAME`: Representa el nombre del empleado.
 * - `VAR_INLINE_NAME.EMPLOYEE_SIGNATURE`: Representa el nombre de la compañía.
 * - `VAR_INLINE_NAME.COMPANY_NAME`: Representa la firma del empleado.
 *
 * @readonly
 * @revision 0.0.0
 * @date 2025-04-14
 * @author guillermob
 */
const VAR_INLINE_NAME = Object.freeze({
  NONE: 'none',
  EMPLOYEE_NAME: 'employee_name',
  EMPLOYEE_SIGNATURE: 'company_name',
  COMPANY_NAME: 'employee_signature',
});

export default VAR_INLINE_NAME;

