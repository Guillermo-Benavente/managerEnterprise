/**
 * Objeto que define los tipos de diálogos disponibles.
 * 
 * Este objeto agrupa los diferentes tipos de cuadros de diálogo, donde cada tipo está asociado a un valor constante.
 * Estos valores se usan para determinar el comportamiento y estilo de los cuadros de diálogo en la aplicación.
 * 
 * Los valores disponibles son:
 * - `DialogType.NONE`: Representa un cuadro de diálogo sin tipo específico.
 * - `DialogType.INFO`: Cuadro de diálogo de tipo informativo.
 * - `DialogType.ERROR`: Cuadro de diálogo de tipo error.
 * - `DialogType.QUESTION`: Cuadro de diálogo de tipo pregunta.
 * - `DialogType.WARNING`: Cuadro de diálogo de tipo advertencia.
 * 
 * @readonly
 * @revision 0.0.0
 * @date 2025-04-10
 * @author guillermob
 */
const DialogType = Object.freeze({
  NONE: 'none',
  INFO: 'info',
  ERROR: 'error',
  QUESTION: 'question',
  WARNING: 'warning'
});

export default DialogType;