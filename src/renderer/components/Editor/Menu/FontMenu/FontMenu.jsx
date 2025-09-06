import style from './fontmenu.module.css';
import ButtonType from 'Types/renderer/buttonType';
import Button from 'Components/Button/Button';

const fonts = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana'];
const sizes = ['12', '14', '16', '18', '24', '32'];

export default function FontMenu({ editor }) {
  if (!editor) return null;

  const applyFont = (font) => {
    editor.chain().focus().setFontFamily(font).run();
  };

  const applySize = (size) => {
    editor.chain().focus().setFontSize(size).run();
  };

  return (
    <div className={style.fontMenuWrapper}>
      <select onChange={e => applyFont(e.target.value)} className={style.select}>
        {fonts.map(font => (
          <option key={font} value={font}>{font}</option>
        ))}
      </select>
      <select onChange={e => applySize(e.target.value)} className={style.select}>
        {sizes.map(size => (
          <option key={size} value={size+'px'}>{size}</option>
        ))}
      </select>
    </div>
  );
}