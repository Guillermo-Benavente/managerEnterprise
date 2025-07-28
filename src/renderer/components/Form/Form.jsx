import { useRef } from 'react';
import style from './form.module.css';
import { Dialog } from 'Api/control';
import Button from "Components/Button/Button";
import DialogType from 'Types/renderer/dialog';
import ButtonType from 'Types/renderer/buttonType';

export default function Form({ columns, data, nav, embedded = false, onSubmitSuccess, dbAction }) {
    const spanRef = useRef();
    const formRef = useRef();
    let finalColumns = [];
    let isFile = columns?.some(column => column.type === 'file');
    const formstyle = !embedded ? style.form : style.formEmbedded;
    const formProps = {
        className: formstyle,
        ...(isFile && { encType: 'multipart/form-data' }),
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        const formData = new FormData(formRef.current);
        const values = Object.fromEntries(formData.entries());

        const fileProcessingPromises = [];

        formRef.current.querySelectorAll('input[type="file"]').forEach(input => {
            const filePromises = Array.from(input.files).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                        resolve({ name: file.name, data: reader.result.split(',')[1] });
                    reader.onerror = () => reject(new Error('Error leyendo archivo'));
                    reader.readAsDataURL(file);
                });
            });

            const processedFilesPromise = Promise.all(filePromises).then(fileContents => {
                values[input.name] = fileContents;
            });

            fileProcessingPromises.push(processedFilesPromise);
        });

        try {
            await Promise.all(fileProcessingPromises);
            await dbAction(values);
            if (onSubmitSuccess) onSubmitSuccess();
        } catch (error) {
            Dialog('Error', 'No se ha podido añadir los nuevos datos.', DialogType.ERROR);
            console.error('Error al procesar los archivos:', error);
        }
    };

    const inputFormat = (column) => {
        const value = data?.[column.key] ?? '';
        const input = (
            <input
                className={style.input}
                name={column.key}
                type={column.type}
                accept={column.accept}
                multiple={column.type === 'file'}
                defaultValue={column.type !== 'file' ? value : undefined}
                pattern={column.pattern}
                required={!!column.required}
            />
        );

        let buttonFile = <Button className={style.button} type={ButtonType.PRIMARY} nav={nav}>Ver Documentos</Button>;
        if (embedded) buttonFile = <Button className={style.button} type={ButtonType.FILE} event={
            (event) => {
                const files = event.target.files;
                const text = files.length > 0
                    ? files.length > 1
                        ? `${files.length} archivos`
                        : '1 archivo'
                    : 'Añadir archivos';
                if (spanRef.current) spanRef.current.textContent = text;
            }
        }>
            <span ref={spanRef}>Añadir archivos</span>
            {input}
        </Button>;


        const labelContent = (
            <span>
                {column.required && <small title='Campo Requerido' className={style.required}>*</small>} {column.name}
            </span>
        );

        let rowInput;

        if (column.type === 'file') {
            rowInput = (
                <span key={column.key} className={style.span}>
                    <span className={style.valSpan}>
                        {labelContent}
                        <span className={style.numDocs}>{value}</span>
                    </span>
                    {buttonFile}
                </span>
            );
        } else {
            rowInput = (
                <span key={column.key} className={style.span}>
                    <label className={style.label}>
                        {labelContent}
                        {input}
                    </label>
                </span>
            );
        }

        return rowInput;
    }

    if (columns) {
        const filteredColumns = embedded
            ? columns.filter(column => column.showForm)
            : columns;

        filteredColumns.map((column) => {
            finalColumns.push(inputFormat(column));
        });
    } else {
        finalColumns.push(
            <span>
                Ha ocurrido un error al cargar el formulario.
            </span>
        );
    }

    return (
        <form {...formProps} ref={formRef} onSubmit={handleSubmit}>
            <fieldset className={style.fieldset}>
                {finalColumns}
            </fieldset>
            <Button type={ButtonType.SUBMIT}>Guardar</Button>
        </form>
    );
}