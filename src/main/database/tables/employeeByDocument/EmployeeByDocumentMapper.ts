import EmployeeByDocumentData from 'Types/database/EmployeeByDocumentData';
import EmployeeByDocumentType from 'Types/database/EmployeeByDocumentType';

export default class EmployeeByDocumentMapper {
  static toData(ebd: EmployeeByDocumentType): EmployeeByDocumentData {
    const toISO = (d: string | Date): string => new Date(d).toISOString();
    return {
      id:       ebd.id,
      employee: ebd.employee,
      document: ebd.document,
      date:     toISO(ebd.date),
    };
  }

  static toFrontend(data: EmployeeByDocumentData): EmployeeByDocumentType {
    const fmt = (s: string) => new Date(s).toLocaleDateString('es-ES');
    return {
      id:       data.id,
      employee: data.employee,
      document: data.document,
      date:     fmt(data.date),
    };
  }
}