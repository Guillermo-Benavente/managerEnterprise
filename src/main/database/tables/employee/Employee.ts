import EmployeeData from 'Types/database/EmployeeData';
import EmployeeType from 'Types/database/EmployeeType';
import EmployeeMapper from './EmployeeMapper';

export default class Employee {

  constructor(private data: EmployeeData) {
    if (!data.dni)            throw new Error('El DNI es obligatorio')
    if (!data.name)           throw new Error('El nombre es obligatorio')
    if (!data.first_surname)  throw new Error('El primer apellido es obligatorio')
    if (!data.discharge_date) throw new Error('La fecha de alta inválida')
    if (data.courses < 0)     throw new Error('El número de cursos no puede ser negativo')
  }

  /** UI → dominio */
  static fromView(e: EmployeeType): Employee {
    if (!e.dni)                throw new Error('El DNI es obligatorio')
    if (!e.name)               throw new Error('El nombre es obligatorio')
    if (!e.surnames)           throw new Error('El primer apellido es obligatorio')
    if (!e.discharge_date)     throw new Error('La fecha de alta es obligatoria')
    if (e.courses < 0)         throw new Error('El número de cursos no puede ser negativo')

    return new Employee(EmployeeMapper.toData(e));
  }

  /** dominio → BD plano (strings ISO) */
  toData(): EmployeeData {
    return this.data;
  }

  /** dominio → UI */
  toFrontend(): EmployeeType {
    return EmployeeMapper.toFrontend(this.data);
  }
}