import { useEffect, useState } from 'react';
import { MessageSquareOff, LoaderCircle } from 'lucide-react';
import db, { keys } from 'Api/db';
import Header from 'Components/Header/Header';
import TemplateBase from 'Components/TemplateBase/TemplateBase';
import Panel from 'Components/Panel/Panel';
import NotificationPanel from 'Components/Panel/NotificationPanel/NotificationPanel';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';
import TableName from 'Types/shared/handler/TableName.js';
import style from './Home.module.css';

export default function Home() {

  const empKeys = keys(TableName.EMPLOYEE);

  const [dniExpired, setDniExpired] = useState([]);
  const [dniExpiringSoon, setDniExpiringSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);

  useEffect(() => {
    const fetchDniNotifications = async () => {
      const today = new Date();
      const allEmployees = await db[empKeys.GETALL]();

      // Caducados
      const expired = allEmployees
        .filter(emp => new Date(emp.dni_date) < today)
        .map(emp => ({
          id: emp.id,
          type: "error",
          text: `El DNI de ${emp.name ?? 'empleado'} expiró el ${new Date(emp.dni_date).toLocaleDateString()}`,
          link: `/employee/${emp.id}`
        }));

      // Próximos a caducar (<= 30 días)
      const expiringSoon = allEmployees
        .filter(emp => {
          const dniExpiry = new Date(emp.dni_date);
          const daysDiff = Math.ceil((dniExpiry - today) / (1000 * 3600 * 24));
          return daysDiff > 0 && daysDiff <= 30;
        })
        .map(emp => ({
          id: emp.id,
          type: "warning",
          text: `El DNI de ${emp.name ?? 'empleado'} caduca el ${new Date(emp.dni_date).toLocaleDateString()}`,
          link: `/employee/${emp.id}`
        }));

      setDniExpired(expired);
      setDniExpiringSoon(expiringSoon);
      setLoading(false);

      if (expired.length > 0 && expiringSoon.length > 0) {
        const totalTime = 0.5 + (expired.length - 1) * 0.2;
        setTimeout(() => setShowExpiringSoon(true), totalTime * 1000);
      } else if (expiringSoon.length > 0) {
        setShowExpiringSoon(true);
      }
    };

    fetchDniNotifications();
  }, []);

  const allNotifications = [...dniExpired, ...dniExpiringSoon];

  return (
    <TemplateBase title='Docmaen' className={style.body}>
      <section className={style.section}>
        <Button type={ButtonType.MAIN} nav='/profile' className={style.button}>Perfil</Button>
        <Button type={ButtonType.MAIN} nav='/employee' className={style.button}>Empleados</Button>
        <Button type={ButtonType.MAIN} nav='/company' className={style.button}>Empresas</Button>
        <Button type={ButtonType.MAIN} event={() => window.close()} className={style.button}>Salir</Button>
      </section>
      <section className={style.notifications}>
        <Panel title="Notificaciones">
          {loading ? (
            <div className={style.infoMsg}>
              <LoaderCircle className={style.spin} />
              <p>Cargando notificaciones...</p>
            </div>
          ) : dniExpired.length === 0 && dniExpiringSoon.length === 0 ? (
            <div className={style.infoMsg}>
              <MessageSquareOff />
              <p>No hay notificaciones.</p>
            </div>
          ) : (
            <>
              {allNotifications.length > 0 && (
                <NotificationPanel
                  data={allNotifications}
                  onRemove={(id) => {
                    setDniExpired(prev => prev.filter(n => n.id !== id));
                    setDniExpiringSoon(prev => prev.filter(n => n.id !== id));
                  }}
                />
              )}
            </>
          )}
        </Panel>
      </section>
    </TemplateBase>
  );
}