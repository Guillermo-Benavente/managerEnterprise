import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './button.module.css';
import ButtonType from 'Types/renderer/buttonType';

const Button = forwardRef(({ children, type = ButtonType.PRIMARY, active, key, nav, event, className = '', ...props }, ref) => {
    const navigate = useNavigate();
    const onClick = event
        ? event : nav
            ? () => navigate(nav)
            : props.onClick;

    let typeButton = type;
    let styleButton = className;
    if (active) styleButton += ` ${style.active}`;
    
    switch (type) {
        case ButtonType.SUBMIT:
            styleButton += ` ${style.btn} ${style['btn-' + ButtonType.PRIMARY]}`;
            break;
        case ButtonType.RESET:
            styleButton += ` ${style.btn} ${style['btn-' + ButtonType.SECONDARY]}`;
            break;
        case ButtonType.FILE:
            styleButton += ` ${style.btn} ${style['btn-' + ButtonType.PRIMARY]}`;
            break;
        default:
            styleButton += ` ${style.btn} ${style['btn-' + type]}`;
            typeButton = 'button';
            break;
    }

    let button = <button
        ref={ref}
        key={key}
        type={typeButton}
        className={styleButton.trim()}
        onClick={onClick}
        {...props}
    >
        {children}
    </button>
    if (type === ButtonType.FILE) button = <label
        ref={ref}
        key={key}
        className={styleButton.trim()}
        onChange={onClick}
        {...props}
    >
        {children}
    </label>;

    return button;
});

export default Button;