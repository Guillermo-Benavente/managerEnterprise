import GroupDocumentData from 'Types/main/database/GroupDocumentData';
import GroupDocumentType from 'Types/main/database/GroupDocumentType';
import { toISO, formatToView } from '../../../utils/date';

export default class GroupDocumentMapper {
  static toData(grp: GroupDocumentType): GroupDocumentData {
    return {
      id:       grp.id,
      name:     grp.name,
      document: grp.document,
      date:     toISO(grp.date)!,
    };
  }

  static toFrontend(data: GroupDocumentData): GroupDocumentType {
    return {
      id:       data.id,
      name:     data.name,
      document: data.document,
      date:     formatToView(data.date),
    };
  }
}