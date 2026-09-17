import { useEffect, useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import style from './alignmenu.module.css';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';

export default function AlignMenu({ editor }) {
  const [_, forceUpdate] = useState(0);
  if (!editor) return null;

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const { from, to } = editor.state.selection;

      const isTextNode = editor.isActive('paragraph') || editor.isActive('heading');
      const hasAlign =
        editor.isActive({ textAlign: 'left' }) ||
        editor.isActive({ textAlign: 'center' }) ||
        editor.isActive({ textAlign: 'right' }) ||
        editor.isActive({ textAlign: 'justify' });

      if (isTextNode && !hasAlign && from === to) {
        editor.chain().focus().setTextAlign('left').run();
      }

      forceUpdate(n => n + 1);
    };

    editor.on('selectionUpdate', update);
    editor.on('transaction', update);

    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  const setAlign = (alignment) => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  return (
    <div className={style.wrapper}>
      <Button
        type={ButtonType.LINK}
        active={editor.isActive({ textAlign: 'left' })}
        event={() => setAlign('left')}
      >
        <AlignLeft />
      </Button>
      <Button
        type={ButtonType.LINK}
        active={editor.isActive({ textAlign: 'center' })}
        event={() => setAlign('center')}
      >
        <AlignCenter />
      </Button>
      <Button
        type={ButtonType.LINK}
        active={editor.isActive({ textAlign: 'right' })}
        event={() => setAlign('right')}
      >
        <AlignRight />
      </Button>
      <Button
        type={ButtonType.LINK}
        active={editor.isActive({ textAlign: 'justify' })}
        event={() => setAlign('justify')}
      >
        <AlignJustify />
      </Button>
    </div>
  );
}