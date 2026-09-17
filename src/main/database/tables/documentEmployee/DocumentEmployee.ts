import DocumentEmployeeData from 'Types/main/database/DocumentEmployeeData';
import DocumentEmployeeType from 'Types/main/database/DocumentEmployeeType';
import DocumentEmployeeMapper from './DocumentEmployeeMapper';
import { IModel, ModelClass } from '../IModel';

const DocumentEmployee: ModelClass<DocumentEmployeeType, DocumentEmployeeData> = 
class DocumentEmployee implements IModel<DocumentEmployeeType, DocumentEmployeeData> {

  constructor(readonly data: DocumentEmployeeData) {
    if (!data.document) throw new Error('La referencia del documento es obligatoria');
    if (!data.employee)  throw new Error('La referencia del empleado es obligatoria');
  }

  /** UI → dominio */
  static fromView(d: DocumentEmployeeType): IModel<DocumentEmployeeType, DocumentEmployeeData> {
    if (!d.document) throw new Error('La referencia del documento es obligatoria');
    if (!d.employee)  throw new Error('La referencia del empleado es obligatoria');

    return new DocumentEmployee(DocumentEmployeeMapper.toData(d));
  }

  /** dominio → BD plano */
  toData(): DocumentEmployeeData {
    return this.data;
  }

  /** dominio → UI */
  toFrontend(): DocumentEmployeeType {
    return DocumentEmployeeMapper.toFrontend(this.data);
  }
}

export default DocumentEmployee;