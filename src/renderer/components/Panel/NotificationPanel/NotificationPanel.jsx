import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './notificationpanel.module.css';
import { X } from 'lucide-react';

export default function NotificationPanel({ data = [], className = '', onRemove }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(
    data.map((item, i) => ({
      ...item,
      closing: false,
      enter: true
    }))
  );

  // Animación de entrada
  useEffect(() => {
    const timers = notifications.map((_, i) =>
      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((n, j) => (j === i ? { ...n, enter: false } : n))
        );
      }, 500 + i * 200)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications.length]);

  const handleClose = (id, event) => {
    event.stopPropagation();
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, closing: true } : item))
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
      if (onRemove) onRemove(id);
    }, 300); // duración animación salida
  };

  const handleClick = (link) => {
    if (!link) return;
    navigate(link);
  };

  return (
    <div className={`${style.list} ${className}`}>
      {notifications.map((item, i) => (
        <div
          key={item.id}
          className={`
            ${style.container} 
            ${style[item.type]} 
            ${item.enter ? style.enter : ''} 
            ${item.closing ? style.closing : ''}
          `}
          style={{
            animationDelay: item.enter ? `${i * 0.2}s` : undefined,
            cursor: item.link ? 'pointer' : 'default'
          }}
          onClick={() => handleClick(item.link)}
        >
          <div className={style.message}>{item.text}</div>
          <button
            className={style.close}
            onClick={(e) => handleClose(item.id, e)}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
