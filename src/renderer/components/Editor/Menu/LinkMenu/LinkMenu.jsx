import { useState, useRef, useEffect } from 'react';
import { Link2 } from 'lucide-react';
import style from './linkmenu.module.css';
import EditorButton from 'Components/Editor/EditorButton';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';

export default function LinkMenu({ editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [_, forceUpdate] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
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
    if (!editor) return;

    if (editor.isActive('link')) {
      const attrs = editor.getAttributes('link');
      setUrl(attrs.href || '');
    } else {
      setUrl('');
    }
  }, [editor?.state.selection]);

  const applyLink = () => {
    if (!url) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setOpen(false);
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setUrl('');
    setOpen(false);
  };

  return (
    <div className={style.linkMenuWrapper} ref={ref}>
      <EditorButton
        editor={editor}
        isActive={(ed) => ed.isActive('link')}
        onClick={() => setOpen(prev => !prev)}
        className={style.iconButton}
      >
        <Link2 size={20} />
      </EditorButton>

      {open && (
        <div className={style.floatingMenu}>
          <input
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoFocus
          />
          <div className={style.linkButtons}>
            <Button type={ButtonType.PRIMARY} event={applyLink}>Aplicar</Button>
            <Button type={ButtonType.SECONDARY} event={removeLink}>Quitar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
