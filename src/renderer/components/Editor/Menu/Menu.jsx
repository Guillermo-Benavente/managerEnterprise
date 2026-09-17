import { Bold, Italic, Underline, Strikethrough, Variable, Undo, Redo } from 'lucide-react';
import { useEditorState } from '@tiptap/react';
import style from './menu.module.css';
import Button from "Components/Button/Button";
import ButtonType from 'Types/renderer/buttonType';
import ImageMenu from './ImageMenu/ImageMenu';
import HeadingMenu from './HeadingMenu/HeadingMenu';
import LinkMenu from './LinkMenu/LinkMenu';
import TableMenu from './TableMenu/TableMenu';
import AlignMenu from './AlignMenu/AlignMenu';
import FontMenu from './FontMenu/FontMenu';
import VariableMenu from './VariableMenu/VariableMenu';
import EditorButton from '../EditorButton';

export default function Menu({ editor, variableMenu }) {
  const editorState = useEditorState({
    editor,
    selector: ctx => ({
      isBold: ctx.editor.isActive('bold'),
      isItalic: ctx.editor.isActive('italic'),
      isUnderline: ctx.editor.isActive('underline'),
      isStrike: ctx.editor.isActive('strike'),
    }),
  });

  return (
    <div className={style.menu}>
      <div className={style.section}>
        <HeadingMenu editor={editor} />
        <FontMenu editor={editor} />
      </div>
      <div className={style.section}>
        <EditorButton editor={editor} mark="bold"><Bold strokeWidth="2.5px" /></EditorButton>
        <EditorButton editor={editor} mark="italic"><Italic /></EditorButton>
        <EditorButton editor={editor} mark="underline"><Underline /></EditorButton>
        <EditorButton editor={editor} mark="strike"><Strikethrough /></EditorButton>
      </div>
      <div className={style.section}>
        <VariableMenu editor={editor} variables={variableMenu} />{/* <Button type={ButtonType.LINK}><Variable /></Button> */}
        <LinkMenu editor={editor} />
        <ImageMenu editor={editor} />
        <TableMenu editor={editor} />
        <AlignMenu editor={editor} />
      </div>
      <div className={style.section}>
        <Button type={ButtonType.LINK} event={() => editor.chain().focus().undo().run()}><Undo /></Button>
        <Button type={ButtonType.LINK} event={() => editor.chain().focus().redo().run()}><Redo /></Button>
      </div>
    </div>
  );
}