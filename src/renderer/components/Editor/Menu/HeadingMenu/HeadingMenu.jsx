import { useState, useRef, useEffect } from 'react';
import { Heading, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from 'lucide-react';
import style from './headingmenu.module.css';
import { useEditorState } from '@tiptap/react';
import EditorButton from 'Components/Editor/EditorButton';
import Button from "Components/Button/Button";
import ButtonType from 'Types/renderer/buttonType';


export default function HeadingMenu({ editor }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const levels = [1, 2, 3, 4, 5, 6];

    const { isHeading } = useEditorState({
        editor,
        selector: state => ({
            isHeading: state.editor?.isActive('heading'),
        }),
    });

    const icons = {
        1: (<><Heading1 size={18} /><span>Título</span></>),
        2: (<><Heading2 size={18} /><span>Subtítulo</span></>),
        3: (<><Heading3 size={18} /><span>Encabezado</span></>),
        4: (<><Heading4 size={18} /><span>Subencabezado</span></>),
        5: (<><Heading5 size={18} /><span>Sección</span></>),
        6: (<><Heading6 size={18} /><span>Subsección</span></>),
    };

    const toggleHeading = (level) => {
        editor.chain().focus().toggleHeading({ level }).run();
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={style.headingDropdown} ref={ref}>
            <EditorButton
                editor={editor}
                isActive={() => isHeading}
                onClick={() => setOpen(prev => !prev)}
                className={style.iconButton}
                activeClassName={style.activeHeading}
            >
                <Heading size={20} />
            </EditorButton>

            {open && (
                <div className={style.headingMenu}>
                    {levels.map(level => (
                        <EditorButton
                            key={level}
                            editor={editor}
                            isActive={ed => ed.isActive('heading', { level })}
                            command={ed => toggleHeading(level)}
                            activeClassName={style.activeHeading}
                        >
                            {icons[level]}
                        </EditorButton>
                    ))}
                </div>
            )}
        </div>
    );
}