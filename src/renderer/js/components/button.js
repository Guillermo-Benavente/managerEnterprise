import { ModifySvgColor } from "./utilAPI.js";
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
export function UploadImages() {
    document.querySelectorAll('.btn-img').forEach(button => {
        const imgUrl = button.getAttribute('data-img');
        const svgColor = button.getAttribute('data-clr');

        if (svgColor != null) {
            console.log('Tiene color');
            ModifySvgColor(imgUrl, svgColor, (success, svg) => {
                console.log('Vamos a poner color');
                if(success) { 
                    console.log(svg);
                    button.style.backgroundImage = svg;
                    console.log('Color puesto')
                }
            });
            /*fetch(imgUrl)
                .then(response => response.text())
                .then(svgContent => {
                    const coloredSvg = svgContent.replace(/currentColor|fill="[^"]+"/g, `fill="${svgColor}"`);
                    button.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(coloredSvg)}')`;
                })
                .catch(error => console.error('Error al cargar el SVG:', error));*/
        } else {
            button.style.backgroundImage = `url('${imgUrl}')`;
        }
    });
}