import TemplateBase from 'Components/TemplateBase/TemplateBase';
import Table from 'Components/Table/Table';

export default function TemplateTable({ title, titleTable, backNav, columns, data, dbAction, children }) {
    return (
        <TemplateBase title={title} backNav={backNav} options={children}>
            <Table title={titleTable} columns={columns} data={data} dbAction={dbAction}/>
        </TemplateBase>
    );
}