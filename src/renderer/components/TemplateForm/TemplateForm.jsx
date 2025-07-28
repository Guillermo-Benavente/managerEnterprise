import TemplateBase from 'Components/TemplateBase/TemplateBase';
import Table from 'Components/Table/Table';
import Form from 'Components/Form/Form';

export default function TemplateForm({ title, backNav, columns, data, nav, children }) {
    return (
        <TemplateBase title={title} backNav={backNav} options={children}>
            <Form columns={columns} data={data} nav={nav}/>
        </TemplateBase>
    );
}