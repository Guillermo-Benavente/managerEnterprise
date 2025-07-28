import CompanyData from "Types/main/database/CompanyData";
import CompanyType from "Types/main/database/CompanyType";
import { toISO, formatToView } from '../../../utils/date';

export default class CompanyMapper {
  static toData(c: CompanyType): CompanyData {
    return {
      nif:                c.nif,
      name:              c.name,
      telephone:         c.telephone,
      registration_date: toISO(c.registration_date),
    };
  }

  static toFrontend(data: CompanyData): CompanyType {
    return {
      nif:               data.nif,
      name:              data.name,
      telephone:         data.telephone,
      registration_date: formatToView(data.registration_date),
    };
  }
}