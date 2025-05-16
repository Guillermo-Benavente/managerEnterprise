import EmployeeData from 'Types/database/EmployeeData';
import EmployeeType from 'Types/database/EmployeeType';
import { toISO, formatToView } from '../../../utils/date';

export default class EmployeeMapper {
  static toData(e: EmployeeType): EmployeeData {
    const [firstSurname, secondSurname] = e.surnames.trim().split(/\s+/, 2);
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
    return {
      dni:                    data.dni,
      name:                   data.name,
      surnames:               data.first_surname + (data.second_surname ? ` ${data.second_surname}` : ''),
      discharge_date:         formatToView(data.discharge_date),
      leave_date:             formatToView(data.leave_date),
      medical_leave_date:     formatToView(data.medical_leave_date),
      medical_discharge_date: formatToView(data.medical_discharge_date),
      courses:                data.courses,
    };
  }
}