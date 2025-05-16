/**
 * La función UploadImages selecciona todos los botones con la clase 'btn-img' en el DOM 
 * y les asigna una imagen de fondo basándose en el atributo 'data-img' de cada elemento.
 * Si el atributo 'data-clr' está presente, se asume que la imagen es un SVG, 
 * se carga y modifica su color basándose en el valor de 'data-clr'.
 * 
 * @example
 * <!-- Ejemplo de uso en HTML con imagen JPG -->
 * <span class="btn-img" data-img="path/to/image.jpg"></span>
 * 
 * <!-- Ejemplo de uso en HTML con SVG dinámico -->
 * <span class="btn-img" data-img="path/to/image.svg" data-clr="#FF0000"></span>
 * 
 * // Al ejecutar la función UploadImages():
 * // - Si es un JPG/PNG, la imagen se aplicará como fondo del elemento.
 * // - Si es un SVG y 'data-clr' está presente, se cargará el SVG y su color será modificado.
 */
//TODO cambiar comentario
export function UploadImages() {
    document.querySelectorAll('.btn-img').forEach(button => {
        const imgUrl = button.getAttribute('data-img');
        const svgColor = button.getAttribute('data-clr');
        button.style.backgroundImage = `url('${imgUrl}')`;
    });
}