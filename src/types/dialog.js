/**
 * Objeto que define los tipos de diálogos disponibles.
 * 
 * Este objeto agrupa los diferentes tipos de cuadros de diálogo, donde cada tipo está asociado a un valor constante.
 * Estos valores se usan para determinar el comportamiento y estilo de los cuadros de diálogo en la aplicación.
 * 
 * Los valores disponibles son:
 * - `DIALOG_TYPE.NONE`: Representa un cuadro de diálogo sin tipo específico.
 * - `DIALOG_TYPE.INFO`: Cuadro de diálogo de tipo informativo.
 * - `DIALOG_TYPE.ERROR`: Cuadro de diálogo de tipo error.
 * - `DIALOG_TYPE.QUESTION`: Cuadro de diálogo de tipo pregunta.
 * - `DIALOG_TYPE.WARNING`: Cuadro de diálogo de tipo advertencia.
 * 
 * @readonly
 * @revision 0.0.0
 * @date 2025-04-10
 * @author guillermob
 */
const DIALOG_TYPE = Object.freeze({
  NONE: 'none',
  INFO: 'info',
  ERROR: 'error',
  QUESTION: 'question',
  WARNING: 'warning'
});

export default DIALOG_TYPE;