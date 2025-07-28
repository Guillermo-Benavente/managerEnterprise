import TemplateFormTable from 'Components/TemplateFormTable/TemplateFormTable'
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';

export default function Home() {
  return (
    <TemplateFormTable
      title={['Docmaen', 'Profile']}
      //titleTable={'Documentos'}
      backNav='/'
      //columnsForm={EMPLOYEE}
      //dataForm={dataForm}
      //columnsTable={EMPLOYEE_DOCUMENT}
      //dataTable={dataTable}
      //dbActionForm={handleUpdate}
      //dbActionTable={handleDelete}
    >
      {/* <Modal title='Nuevos documentos' textButtonOpen='Añadir Documentos' textButtonClose='X'>
        {({ close }) => (
          <Form
            columns={EMPLOYEE_DOCUMENT}
            embedded={true}
            onSubmitSuccess={close}
            dbAction={handleInsert}
          />
        )}
      </Modal> */}
    </TemplateFormTable>
  );
}