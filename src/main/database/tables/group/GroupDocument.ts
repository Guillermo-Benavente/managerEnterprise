import GroupDocumentData from 'Types/main/database/GroupDocumentData';
import GroupDocumentType from 'Types/main/database/GroupDocumentType';
import GroupDocumentMapper from './GroupDocumentMapper';
import { IModel, ModelClass } from '../IModel';

const EmployeeByDocument: ModelClass<GroupDocumentType, GroupDocumentData> = 
class EmployeeByDocument implements IModel<GroupDocumentType, GroupDocumentData> {

  constructor(readonly data: GroupDocumentData) {
    if (!data.id)       throw new Error('El ID del registro es obligatorio');
    if (!data.name)     throw new Error('El nombre del grupo es obligatorio');
    if (!data.document) throw new Error('El ID del documento es obligatorio');
    if (!data.date)     throw new Error('La fecha es obligatoria');
  }

  /** UI → dominio */
  static fromView(grp: GroupDocumentType): IModel<GroupDocumentType, GroupDocumentData> {
    if (!grp.id)       throw new Error('El ID del registro es obligatorio');
    if (!grp.name)     throw new Error('El nombre del grupo es obligatorio');
    if (!grp.document) throw new Error('El ID del documento es obligatorio');
    if (!grp.date)     throw new Error('La fecha es obligatoria');

    return new EmployeeByDocument(GroupDocumentMapper.toData(grp));
  }

  /** dominio → BD plano */
  toData(): GroupDocumentData {
    return this.data;
  }

  /** dominio → UI */
  toFrontend(): GroupDocumentType {
    return GroupDocumentMapper.toFrontend(this.data);
  }
}

export default EmployeeByDocument;