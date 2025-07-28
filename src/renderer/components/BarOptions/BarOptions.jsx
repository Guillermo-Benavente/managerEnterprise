import style from './barOptions.module.css';

export default function BarOptions({ children }) {
    return (
        <div className={style.bar}>
            <div className={style.right}>
                {children}
            </div>
        </div>
    );    
}