import Header from 'Components/Header/Header';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';
import TemplateBase from 'Components/TemplateBase/TemplateBase';
import style from './Home.module.css';

export default function Home() {
  return (
    <TemplateBase title='Docmaen' className={style.body}>
      <section className={style.section}>
        <Button type={ButtonType.MAIN} nav='/profile' className={style.button}>Perfil</Button>
        <Button type={ButtonType.MAIN} nav='/employee' className={style.button}>Empleados</Button>
        <Button type={ButtonType.MAIN} nav='/company' className={style.button}>Empresas</Button>
        <Button type={ButtonType.MAIN} event={() => window.close()} className={style.button}>Salir</Button>
      </section>
      <section className={style.section}>{/* contenido dinámico */}</section>
    </TemplateBase>
  );
}