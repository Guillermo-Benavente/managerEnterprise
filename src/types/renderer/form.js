/**
 * Objeto que define los tipos de formulario disponibles.
 * 
 * Este objeto agrupa los diferentes tipos de formulario, donde cada tipo está asociado a un valor constante.
 * Estos valores se usan para determinar el comportamiento y estilo de los formularios en la aplicación.
 * 
 * Los valores disponibles son:
 * - `FromType.NONE`: Representa un formulario sin tipo específico.
 * - `FromType.NORMAL`: Este tipo de formulario solamente representara el campo asociado al esqueleto consecuente.
 * - `FromType.SELECTOR`: Este tipo de formulario creara un selector.
 * 
 * @readonly
 * @revision 0.0.0
 * @date 2025-04-21
 * @author guillermob
 */
const FromType = Object.freeze({
  NONE: 0,
  NORMAL: 1,
  SELECTOR: 2,
});

export default FromType;