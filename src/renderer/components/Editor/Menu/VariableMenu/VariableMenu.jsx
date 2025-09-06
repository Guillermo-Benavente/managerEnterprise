import { useState, useRef, useEffect } from 'react';
import { Variable } from 'lucide-react';
import style from './variablemenu.module.css';
import EditorButton from 'Components/Editor/EditorButton';

export default function VariableMenu({ editor, variables }) {
    const [show, setShow] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShow(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const insertVariable = (field, color) => {
        if (!editor) return;

        editor.commands.insertVariable({
            key: field.key,
            name: field.name,
            color,
        });

        setShow(false);
    }

    return (
        <div className={style.tableMenuWrapper} ref={menuRef}>
            <EditorButton
                editor={editor}
                isActive={() => false} // no tiene estado activo
                onClick={() => setShow(prev => !prev)}
                className={style.iconButton}
            >
                <Variable size={20} />
            </EditorButton>

            {show && (
                <div className={style.floatingMenu}>
                    {variables.map(([title, color, fields]) => (
                        <div key={title} className={style.group}>
                            {/* Cabecera */}
                            <div
                                className={style.groupTitle}
                                style={{ color }}
                            >
                                {title}
                            </div>

                            {/* Variables */}
                            {fields.filter(column => column.showVariable).map((field) => (
                                <div
                                    key={field.key}
                                    className={style.row}
                                    style={{ borderLeft: `4px solid ${color}` }}
                                    onClick={() => insertVariable(field, color)}
                                >
                                    {field.name} {field.type !== 'text' ? `(${field.type})` : ''}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}