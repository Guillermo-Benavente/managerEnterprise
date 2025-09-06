import { useEffect, useRef, useState } from 'react';
import style from './form.module.css';
import { Dialog } from 'Api/control';
import Button from 'Components/Button/Button';
import DialogType from 'Types/renderer/dialog';
import ButtonType from 'Types/renderer/buttonType';
import InputFormat from './InputFormat/InputFormat';
import GroupOptions from 'Components/GroupOptions/GroupOptions';
import MemberOptions from 'Components/MemberOptions/MemberOptions';


export default function Form({ columns, data, selectColumns, selectData, selectDataSave, nav, embedded = false, onSubmitSuccess, dbAction }) {
    const spanRef = useRef();
    const formRef = useRef();
    let finalColumns = [];
    let isFile = columns?.some(column => column.type === 'file');
    const formstyle = !embedded ? style.form : style.formEmbedded;
    const formProps = {
        className: formstyle,
        ...(isFile && { encType: 'multipart/form-data' }),
    };
    const [selectDataAsync, setSelectDataAsync] = useState(null);

    useEffect(() => {
        if (selectData) {
            selectData().then((data) => {
                const options = data.map(item => ({
                    value: item.dni,
                    label: `${item.name} ${item.surnames}`
                }));
                setSelectDataAsync(options);
            });
        }
    }, [selectData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);

        // Convertir FormData a objeto respetando campos repetidos
        const values = {};
        for (const [key, value] of formData.entries()) {
            if (values[key] !== undefined) {
                // Si ya existe, convertir en array o añadir al array
                values[key] = Array.isArray(values[key])
                    ? [...values[key], value]
                    : [values[key], value];
            } else {
                values[key] = value;
            }
        }

        // Procesar archivos si los hay
        const fileInputs = formRef.current.querySelectorAll('input[type="file"]');
        const filePromises = [];
        fileInputs.forEach(input => {
            const files = Array.from(input.files).map(file =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve({ name: file.name, data: reader.result.split(',')[1] });
                    reader.onerror = () => reject(new Error('Error leyendo archivo'));
                    reader.readAsDataURL(file);
                })
            );
            filePromises.push(Promise.all(files).then(f => values[input.name] = f));
        });

        try {
            await Promise.all(filePromises);
            console.log('Valores finales del formulario:', values);
            if (dbAction) await dbAction(values);
            if (onSubmitSuccess) onSubmitSuccess();
        } catch (err) {
            Dialog('Error', 'No se ha podido procesar el formulario.', DialogType.ERROR);
            console.error(err);
        }
    };

    if (columns) {
        const filteredColumns = embedded
            ? columns.filter(column => column.showForm)
            : columns.filter(column => column.showEdit);

        filteredColumns.map((column) => {
            finalColumns.push(<InputFormat
                data={data}
                nav={nav}
                spanRef={spanRef}
                embedded={embedded}
                column={column}
            />);
        });
    } else {
        finalColumns.push(
            <span>
                Ha ocurrido un error al cargar el formulario.
            </span>
        );
    }

    let finalselectColumns;

    if (selectColumns && selectDataAsync?.length) {
        finalselectColumns = (
            <fieldset className={`${style.fieldset} ${style.options} selector`}>
                <MemberOptions options={selectDataAsync} value={selectDataSave} />
                <GroupOptions options={selectDataAsync} />
            </fieldset>
        );
    }

    return (
        <form {...formProps} ref={formRef} onSubmit={handleSubmit}>
            <fieldset className={style.fieldset}>
                {finalColumns}
            </fieldset>
            {finalselectColumns}
            <Button type={ButtonType.SUBMIT}>Guardar</Button>
        </form>
    );
}