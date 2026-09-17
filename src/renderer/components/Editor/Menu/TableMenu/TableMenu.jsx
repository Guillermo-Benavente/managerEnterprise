import { useState, useRef, useEffect } from 'react';
import { Sheet } from 'lucide-react';
import style from './tablemenu.module.css';
import EditorButton from 'Components/Editor/EditorButton';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';

export default function TableMenu({ editor }) {
  const [show, setShow] = useState(false)
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [withHeaderRow, setWithHeaderRow] = useState(true)
  const [_, forceUpdate] = useState(0)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!editor) return

    const updateTableState = () => {
      const { selection } = editor.state
      const node = selection.node

      if (node && node.type.name === 'table') {
        setRows(node.attrs.rows || 3)
        setCols(node.attrs.cols || node.content.childCount || 3)
        setWithHeaderRow(!!node.attrs.withHeaderRow)
      }
    }

    updateTableState()
    editor.on('selectionUpdate', updateTableState)

    return () => {
      editor.off('selectionUpdate', updateTableState)
    }
  }, [editor])

  useEffect(() => {
    if (!editor) return
    const update = () => forceUpdate(n => n + 1)
    editor.on('selectionUpdate', update)
    return () => editor.off('selectionUpdate', update)
  }, [editor])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShow(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const insertOrUpdateTable = () => {
    if (!editor) return

    const { state } = editor.view
    const { doc, selection } = state
    let tablePos = null
    let tableNode = null

    doc.descendants((node, pos) => {
      if (node.type.name === 'table' && selection.from >= pos && selection.to <= pos + node.nodeSize) {
        tablePos = pos
        tableNode = node
        return false
      }
      return true
    })

    if (!tableNode) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run()
      setShow(false)
      return
    }

    editor.chain().focus()
      .deleteRange({ from: tablePos, to: tablePos + tableNode.nodeSize })
      .insertTable({ rows, cols, withHeaderRow })
      .run()

    setShow(false)
  }

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run()
    setShow(false)
  }

  return (
    <div className={style.tableMenuWrapper} ref={menuRef}>
      <EditorButton
        editor={editor}
        isActive={ed => ed?.isActive('table')}
        onClick={() => setShow(prev => !prev)}
        className={style.iconButton}
        activeClassName={style.active}
      >
        <Sheet size={20} />
      </EditorButton>

      {show && (
        <div className={style.floatingMenu}>
          <div className={style.row}>
            <label>Filas:</label>
            <input type="number" min={1} value={rows} onChange={e => setRows(Number(e.target.value))} />
          </div>
          <div className={style.row}>
            <label>Columnas:</label>
            <input type="number" min={1} value={cols} onChange={e => setCols(Number(e.target.value))} />
          </div>
          <div className={style.row}>
            <label>
              <input
                type="checkbox"
                checked={withHeaderRow}
                onChange={e => setWithHeaderRow(e.target.checked)}
              />
              Fila de encabezado
            </label>
          </div>
          <Button type={ButtonType.PRIMARY} onClick={insertOrUpdateTable}>
            {editor.isActive('table') ? 'Actualizar Tabla' : 'Insertar Tabla'}
          </Button>
          <Button type={ButtonType.SECONDARY} onClick={deleteTable}>Eliminar Tabla</Button>
        </div>
      )}
    </div>
  )
}