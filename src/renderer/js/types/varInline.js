/**
 * Objeto que define variables en línea para identificar entidades específicas dentro de los datos.
 *
 * Se utiliza para mapear claves a valores inmutables, facilitando la identificación de ciertos
 * campos en estructuras de datos.
 *
 * Las variables disponibles son:
 * - `VAR_INLINE.NONE`: Indica la ausencia de una variable específica.
 * - `VAR_INLINE.CLASS_NAME`: Representa el nombre de la clase utilizada para identificar variables.
 * - `VAR_INLINE.DATA_KEY`: Representa la clave de datos que identifica la variable.
 *
 * @readonly
 * @revision 0.0.0
 * @date 2025-04-14
 * @author guillermob
 */
const VAR_INLINE = Object.freeze({
  NONE: 'none',
  CLASS_NAME: 'editor-variable',
  DATA_KEY: 'data-variable-key',
});

export default VAR_INLINE;