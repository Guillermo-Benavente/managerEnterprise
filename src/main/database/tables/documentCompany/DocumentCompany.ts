import DocumentCompanyData from 'Types/main/database/DocumentCompanyData';
import DocumentCompanyType from 'Types/main/database/DocumentCompanyType';
import DocumentCompanyMapper from './DocumentCompanyMapper';
import { IModel, ModelClass } from '../IModel';

const DocumentCompany: ModelClass<DocumentCompanyType, DocumentCompanyData> = 
class DocumentCompany implements IModel<DocumentCompanyType, DocumentCompanyData> {

  constructor(readonly data: DocumentCompanyData) {
    if (!data.document) throw new Error('La referencia del documento es obligatoria');
    if (!data.company)  throw new Error('La referencia de la empresa es obligatoria');
  }

  /** UI → dominio */
  static fromView(d: DocumentCompanyType): IModel<DocumentCompanyType, DocumentCompanyData> {
    if (!d.document) throw new Error('La referencia del documento es obligatoria');
    if (!d.company)  throw new Error('La referencia de la empresa es obligatoria');

    return new DocumentCompany(DocumentCompanyMapper.toData(d));
  }

  /** dominio → BD plano */
  toData(): DocumentCompanyData {
    return this.data;
  }

  /** dominio → UI */
  toFrontend(): DocumentCompanyType {
    return DocumentCompanyMapper.toFrontend(this.data);
  }
}

export default DocumentCompany;