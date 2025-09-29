import MapperBase from '../MapperBase';
import EmployeeData from 'Types/main/database/EmployeeData';
import EmployeeType from 'Types/main/database/EmployeeType';
import EMPLOYEE from 'renderer/schemas/EmployeeSchema';

const EmployeeMapper = new MapperBase<EmployeeType, EmployeeData>(
  EMPLOYEE,
  {
    toData: {
      first_surname: (_, e) => e.surnames.trim().split(/\s+/, 2)[0],
      second_surname: (_, e) => e.surnames.trim().split(/\s+/, 2)[1] ?? null,
      surnames: () => undefined,
      documents: () => undefined,
    },
    toFrontend: {
      surnames: (_, d) => d.first_surname + (d.second_surname ? ` ${d.second_surname}` : ''),
      first_surname: () => undefined,
      second_surname: () => undefined,
    },
  }
);

export default EmployeeMapper;