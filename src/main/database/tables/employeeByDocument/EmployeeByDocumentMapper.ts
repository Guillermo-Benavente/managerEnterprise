import EmployeeByDocumentData from 'Types/database/EmployeeByDocumentData';
import EmployeeByDocumentType from 'Types/database/EmployeeByDocumentType';
import { toISO, formatToView } from '../../../utils/date';

export default class EmployeeByDocumentMapper {
  static toData(ebd: EmployeeByDocumentType): EmployeeByDocumentData {
    return {
      id:       ebd.id,
      employee: ebd.employee,
      document: ebd.document,
      date:     toISO(ebd.date)!,
    };
  }

  static toFrontend(data: EmployeeByDocumentData): EmployeeByDocumentType {
    return {
      id:       data.id,
      employee: data.employee,
      document: data.document,
      date:     formatToView(data.date),
    };
  }
}