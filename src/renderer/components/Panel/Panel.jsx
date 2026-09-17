import style from './panel.module.css';

export default function Panel({ children, title, className = '' }) {
  return (
    <div className={`${style.panel} ${className}`}>
        <h2>{title}</h2>
        <div className={style.content}>
          {children}
        </div>
    </div>
  );
}