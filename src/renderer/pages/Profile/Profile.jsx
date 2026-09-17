import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import db, { keys } from 'Api/db';
import { Dialog } from 'Api/control';
import TemplateFormTable from 'Components/TemplateFormTable/TemplateFormTable'
import Modal from 'Components/Modal/Modal';
import Form from 'Components/Form/Form';
import Button from 'Components/Button/Button';
import ButtonType from 'Types/renderer/buttonType';
import DialogType from 'Types/renderer/dialog';
import TableName from 'Types/shared/handler/TableName.js';
import PROFILE from 'Schemas/ProfileSchema';
import DOCUMENT from 'Schemas/DocumentSchema';

export default function Profile() {
  const params = useParams();
  const navigate = useNavigate();
  const [id, setId] = useState(params.id || null);
  const [profile, setProfile] = useState(null);
  const [dataTable, setDataTable] = useState(null);
  const prfKeys = keys(TableName.PROFILE);
  const docPrfKeys = keys(TableName.DOCUMENTPROFILE);
  const docKeys = keys(TableName.DOCUMENT);

  useEffect(() => {
    (async () => {
      //TODO modificar en un futuro con la autenticacion de usuario
      if (!params.id) {
        const profiles = await db[prfKeys.GETALL]();
        if (profiles.length > 0) {
          setId(profiles[0].id);

          navigate(`/profile/${profiles[0].id}`, { replace: true })
        }
      } else {
        const profile = await db[prfKeys.GETONE](id);
        setProfile(profile);
        const resultDocPrf = await db[docPrfKeys.GETALL](id);
        const documentsId = resultDocPrf.map(de => de.document);
        const resultTable = await Promise.all(
          documentsId.map(async docId => await db[docKeys.GETONE](docId))
        );
        setDataTable(resultTable);
      }
    })();
  }, [params.id]);

  const handleInsert = async (data) => {
    const newId = await db[prfKeys.INSERT](data);
    Dialog('Información', 'Perfil añadido correctamente.', DialogType.INFO);
    const newProfile = await db[prfKeys.GETONE](newId);
    setId(newId);
    setProfile(newProfile);
  }

  const handleDelete = async (itemId) => {
    await db[docKeys.DELETE](itemId);
    Dialog('Información', 'Documento eliminado correctamente.', DialogType.INFO);
    const key = DOCUMENT.find(col => col.identifier)?.key;
    setDataTable(prev => prev.filter(item => item[key] !== itemId));
  }

  return (
    <TemplateFormTable
      title={['Docmaen', 'Perfil']}
      titleTable={'Documentos'}
      backNav='/'
      columnsForm={PROFILE}
      dataForm={profile}
      columnsTable={DOCUMENT}
      dataTable={dataTable}
      dbActionTable={handleDelete}
    >
      {!profile &&
        <Modal title='Añadir Perfil' autoOpen hidden >
          {({ close }) => (
            <Form
              columns={PROFILE}
              embedded={true}
              onSubmitSuccess={close}
              dbAction={handleInsert}
            />
          )}
        </Modal>
      }
      <Button type={ButtonType.PRIMARY} nav={`/profile/${id}/new`}>Añadir Documento</Button>
    </TemplateFormTable>
  );
}