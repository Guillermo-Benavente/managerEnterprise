import EmployeeData from 'Types/database/EmployeeData';
import EmployeeType from 'Types/database/EmployeeType';

export default class EmployeeMapper {
  static toData(e: EmployeeType): EmployeeData {
    const [firstSurname, secondSurname] = e.surnames.split(' ');
    const toISO = (d?: string | Date | null) => d ? new Date(d).toISOString() : undefined;
    return {
      dni:                     e.dni,
      name:                   e.name,
      first_surname:          firstSurname,
      second_surname:         secondSurname ?? null,
      discharge_date:         toISO(e.discharge_date)!,
      leave_date:             toISO(e.leave_date),
      medical_leave_date:     toISO(e.medical_leave_date),
      medical_discharge_date: toISO(e.medical_discharge_date),
      courses:                e.courses,
    };
  }

  static toFrontend(data: EmployeeData): EmployeeType {
    const fmt = (s?: string | null) => s ? new Date(s).toLocaleDateString('es-ES') : undefined;
    return {
      dni:                    data.dni,
      name:                   data.name,
      surnames:               data.first_surname + (data.second_surname ? ` ${data.second_surname}` : ''),
      discharge_date:         fmt(data.discharge_date)!,
      leave_date:             fmt(data.leave_date),
      medical_leave_date:     fmt(data.medical_leave_date),
      medical_discharge_date: fmt(data.medical_discharge_date),
      courses:                data.courses,
    };
  }
}