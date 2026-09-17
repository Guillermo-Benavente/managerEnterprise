import { useState, useRef, useEffect } from 'react';
import { ImagePlus } from 'lucide-react';
import style from './imagemenu.module.css';
import EditorButton from "Components/Editor/EditorButton";
import Button from "Components/Button/Button";
import ButtonType from 'Types/renderer/buttonType';

export default function ImageMenu({ editor }) {
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState(null);
    const [imgUrl, setImgUrl] = useState('');
    const [_, forceUpdate] = useState(0);
    const menuRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) reset();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!editor) return;
        const update = () => forceUpdate(n => n + 1);
        editor.on('selectionUpdate', update);
        return () => editor.off('selectionUpdate', update);
    }, [editor]);

    useEffect(() => {
        const node = editor.view.state.selection.node;
        if (node?.type.name === 'image') {
            const src = node.attrs.src;
            setImgUrl(src);
        }
    }, [editor.view.state.selection]);

    const insertImage = (src) => {
        if (!src) return;
        editor.chain().focus().setImage({ src }).run();
        reset();
    };

    const handleInsertUrl = () => {
        insertImage(imgUrl);
        setImgUrl('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => insertImage(reader.result);
        reader.readAsDataURL(file);
    };

    const reset = () => {
        setShow(false);
        setMode(null);
        setImgUrl('');
    };

    const renderMenuContent = () => {
        if (!show) return null;
        if (!mode) {
            return (
                <>
                    <Button className={style.buttonFile} type={ButtonType.FILE}>
                        <span>Subir archivo</span>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            autoFocus
                        />
                    </Button>
                    <Button type={ButtonType.SECONDARY} onClick={() => setMode('url')}>Insertar por URL</Button>
                </>
            );
        }
        if (mode === 'url') {
            return (
                <div className={style.urlInput}>
                    <input
                        type="search"
                        placeholder="URL de imagen"
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                        autoFocus
                    />
                    <Button type={ButtonType.PRIMARY} onClick={handleInsertUrl}>Insertar</Button>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={style.imageMenuWrapper} ref={menuRef}>
            <EditorButton
                editor={editor}
                isActive={ed => ed.isActive('image')}
                onClick={() => setShow(prev => !prev)}
                className={style.iconButton}
            >
                <ImagePlus size={20} />
            </EditorButton>
            {show && <div className={style.floatingMenu}>{renderMenuContent()}</div>}
        </div>
    );
}