import GroupDocumentData from 'Types/main/database/GroupDocumentData';
import GroupDocumentType from 'Types/main/database/GroupDocumentType';
import GroupDocumentMapper from './GroupDocumentMapper';
import { IModel, ModelClass } from '../IModel';

const GroupDocument: ModelClass<GroupDocumentType, GroupDocumentData> = 
class GroupDocument implements IModel<GroupDocumentType, GroupDocumentData> {

  constructor(readonly data: GroupDocumentData) {
    if (!data.name)     throw new Error('El nombre del grupo es obligatorio');
    if (!data.document) throw new Error('El ID del documento es obligatorio');
    if (!data.date)     throw new Error('La fecha es obligatoria');
  }

  /** UI → dominio */
  static fromView(grp: GroupDocumentType): IModel<GroupDocumentType, GroupDocumentData> {
    if (!grp.name)     throw new Error('El nombre del grupo es obligatorio');
    if (!grp.document) throw new Error('El ID del documento es obligatorio');
    if (!grp.date)     throw new Error('La fecha es obligatoria');

    return new GroupDocument(GroupDocumentMapper.toData(grp));
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

export default GroupDocument;