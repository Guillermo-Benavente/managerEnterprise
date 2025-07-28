import Header from 'Components/Header/Header';
import BarOptions from 'Components/BarOptions/BarOptions';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';

export default function TemplateBase({ title, backNav, className, options, children }) {
    const headerButton = !!backNav && (
        <Button type={ButtonType.PRIMARY} nav={backNav}>Volver</Button>
    );
    const barOptions = !!options && (<BarOptions>{options}</BarOptions>);

    return (
        <>
            <Header title={title}>{headerButton}</Header>
            <main className={className}>
                {barOptions}
                {children}
            </main>
        </>
    );
}