import style from '../form.module.css';
import Button from "Components/Button/Button";
import ButtonType from 'Types/renderer/buttonType';

export default function InputFormat({ column, data, nav, embedded, spanRef }) {
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

    if (column.type === 'file') rowInput = (
        <span key={column.key} className={style.span}>
            <span className={style.valSpan}>
                {labelContent}
                <span className={style.numDocs}>{value}</span>
            </span>
            {buttonFile}
        </span>
    );
    else rowInput = (
        <span key={column.key} className={style.span}>
            <label className={style.label}>
                {labelContent}
                {input}
            </label>
        </span>
    );

    return rowInput;
}