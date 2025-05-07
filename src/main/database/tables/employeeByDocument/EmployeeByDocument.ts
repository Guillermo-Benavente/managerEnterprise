import EmployeeByDocumentData from 'Types/database/EmployeeByDocumentData';
import EmployeeByDocumentType from 'Types/database/EmployeeByDocumentType';
import EmployeeByDocumentMapper from './EmployeeByDocumentMapper';

export default class EmployeeByDocument {

  constructor(private data: EmployeeByDocumentData) {
    if (!data.id)       throw new Error('El ID del registro es obligatorio');
    if (!data.employee) throw new Error('El DNI del empleado es obligatorio');
    if (!data.document) throw new Error('El ID del documento es obligatorio');
    if (!data.date)     throw new Error('La fecha es obligatoria');
  }

  /** UI → dominio */
  static fromView(ebd: EmployeeByDocumentType): EmployeeByDocument {
    if (!ebd.id)       throw new Error('El ID del registro es obligatorio');
    if (!ebd.employee) throw new Error('El DNI del empleado es obligatorio');
    if (!ebd.document) throw new Error('El ID del documento es obligatorio');
    if (!ebd.date)     throw new Error('La fecha es obligatoria');

    return new EmployeeByDocument(EmployeeByDocumentMapper.toData(ebd));
  }

  /** dominio → BD plano */
  toData(): EmployeeByDocumentData {
    return this.data;
  }

  /** dominio → UI */
  toFrontend(): EmployeeByDocumentType {
    return EmployeeByDocumentMapper.toFrontend(this.data);
  }
}