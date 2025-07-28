import TemplateBase from 'Components/TemplateBase/TemplateBase';
import Table from 'Components/Table/Table';
import Form from 'Components/Form/Form';
import style from './templateFormTable.module.css';

export default function TemplateFormTable({
    title,
    titleTable,
    backNav,
    columnsForm,
    columnsTable,
    dataForm,
    dataTable,
    nav,
    dbActionForm,
    dbActionTable,
    children
}) {
    return (
        <TemplateBase title={title} backNav={backNav} options={children}>
            <div className={style.content}>
                <div className={`${style.item} ${style.form}`}>
                    <Form columns={columnsForm} data={dataForm} nav={nav} dbAction={dbActionForm} />
                </div>
                <div className={`${style.item} ${style.table}`}>
                    <Table title={titleTable} columns={columnsTable} data={dataTable} dbAction={dbActionTable} />
                </div>
            </div>
        </TemplateBase>
    );
}