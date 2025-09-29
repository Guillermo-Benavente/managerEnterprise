import DocumentProfileData from 'Types/main/database/DocumentProfileData';
import DocumentProfileType from 'Types/main/database/DocumentProfileType';
import DocumentProfileMapper from './DocumentProfileMapper';
import { IModel, ModelClass } from '../IModel';

const DocumentProfile: ModelClass<DocumentProfileType, DocumentProfileData> = 
class DocumentProfile implements IModel<DocumentProfileType, DocumentProfileData> {

  constructor(readonly data: DocumentProfileData) {
    if (!data.document) throw new Error('La referencia del documento es obligatoria');
    if (!data.profile)  throw new Error('La referencia del perfil es obligatoria');
  }

  /** UI → dominio */
  static fromView(d: DocumentProfileType): IModel<DocumentProfileType, DocumentProfileData> {
    if (!d.document) throw new Error('La referencia del documento es obligatoria');
    if (!d.profile)  throw new Error('La referencia del perfil es obligatoria');

    return new DocumentProfile(DocumentProfileMapper.toData(d));
  }

  /** dominio → BD plano */
  toData(): DocumentProfileData {
    return this.data;
  }

  /** dominio → UI */
  toFrontend(): DocumentProfileType {
    return DocumentProfileMapper.toFrontend(this.data);
  }
}

export default DocumentProfile;