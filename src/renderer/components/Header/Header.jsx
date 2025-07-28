import style from './header.module.css';

export default function Header({ title, children }) {
    const titleArray = Array.isArray(title) ? title : [title];
    const lastTitle = titleArray[titleArray.length - 1];
    const fullPath = titleArray.slice(0, -1).join(' > ') + ' > ';
    return (
        <header className={style.header}>
            <h1 className={style.title}>
                {titleArray.length > 1 && <span className={style.span}>{fullPath}</span>}
                {lastTitle}
            </h1>
            <div className={style.actions}>
                {children}
            </div>
        </header>
    );
}