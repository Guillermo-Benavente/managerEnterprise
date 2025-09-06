import { useEffect } from 'react';
import style from './editor.module.css'
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TableKit } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import { Mark, Node, mergeAttributes } from '@tiptap/core'
import ImageResize from 'tiptap-extension-resize-image';
import Menu from 'Components/Editor/Menu/Menu';


export default function Editor({ onReady, variableMenu, content = null, children }) {
  const FontSize = Mark.create({
    name: 'fontSize',

    addAttributes() {
      return {
        size: {
          default: null,
          parseHTML: el => el.style.fontSize || null,
          renderHTML: attrs =>
            attrs.size ? { style: `font-size: ${attrs.size}` } : {},
        },
      }
    },

    parseHTML() {
      return [{ style: 'font-size' }]
    },

    renderHTML({ HTMLAttributes }) {
      return ['span', mergeAttributes(HTMLAttributes), 0]
    },

    addCommands() {
      return {
        setFontSize:
          size =>
            ({ commands }) =>
              commands.setMark(this.name, { size }),
        unsetFontSize:
          () =>
            ({ commands }) =>
              commands.unsetMark(this.name),
      }
    },
  });

  const FontFamily = Mark.create({
    name: 'fontFamily',

    addAttributes() {
      return {
        family: {
          default: null,
          parseHTML: el => el.style.fontFamily?.replace(/['"]/g, ''),
          renderHTML: attrs =>
            attrs.family ? { style: `font-family: '${attrs.family}'` } : {},
        },
      }
    },

    parseHTML() {
      return [{ style: 'font-family' }]
    },

    renderHTML({ HTMLAttributes }) {
      return ['span', mergeAttributes(HTMLAttributes), 0]
    },

    addCommands() {
      return {
        setFontFamily:
          family =>
            ({ commands }) =>
              commands.setMark(this.name, { family }),
        unsetFontFamily:
          () =>
            ({ commands }) =>
              commands.unsetMark(this.name),
      }
    },
  });

  const Variable = Node.create({
    name: 'variable',
    group: 'inline',
    inline: true,
    atom: true,

    addAttributes() {
      return {
        key: {
          default: '',
          parseHTML: el => el.getAttribute('data-variable') || '',
        },
        name: {
          default: '',
          parseHTML: el => el.textContent || '',
        },
        color: {
          default: 'gray',
          parseHTML: el => el.style.color || 'gray',
        },
      }
    },

    parseHTML() {
      return [{ tag: 'span[data-variable]' }]
    },

    renderHTML({ HTMLAttributes }) {
      return [
        'span',
        {
          'data-variable': HTMLAttributes.key,
          class: 'tiptap-variable',
          style: `
          background-color: ${HTMLAttributes.color}20;
          color: ${HTMLAttributes.color};
          border: 1px solid ${HTMLAttributes.color};
        `,
        },
        HTMLAttributes.name,
      ]
    },

    addCommands() {
      return {
        insertVariable:
          (attrs) =>
            ({ chain }) => {
              return chain()
                .focus()
                .insertContent({
                  type: this.name,
                  attrs,
                })
                .run()
            },
      }
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Image,
      ImageResize.configure({
        inline: true,
      }),
      TableKit.configure({
        table: { resizable: true },
        tableRow: true,
        tableCell: true,
        tableHeader: true,
      }),
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      FontSize,
      FontFamily,
      Variable
    ],
    editorProps: {
      handleClick(view, pos, event) {
        if (event.target.tagName === 'A') {
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && onReady) onReady(editor);
  }, [editor]);

  useEffect(() => {
    const loadContent = async () => {
      if (editor && typeof content === "function") {
        const data = await content();
        editor.commands.setContent(data);
      }
    };
    loadContent();
  }, [editor, content]);

  return (
    <>
      <div className={style.editor}>
        <Menu editor={editor} variableMenu={variableMenu} />
        <EditorContent editor={editor} className={style.content} spellCheck={true} />
      </div>
      <div className={style.actions}>
        {children}
      </div >
    </>
  );
}