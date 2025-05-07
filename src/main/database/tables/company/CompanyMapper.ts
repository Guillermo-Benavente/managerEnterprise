import CompanyData from "Types/database/CompanyData";
import CompanyType from "Types/database/CompanyType";

export default class CompanyMapper {
  static toData(c: CompanyType): CompanyData {
    const toISO = (d?: string | Date | null) => d ? new Date(d).toISOString() : undefined;
    return {
      nif:                c.nif,
      name:              c.name,
      telephone:         c.telephone,
      registration_date: toISO(c.registration_date),
    };
  }

  static toFrontend(data: CompanyData): CompanyType {
    const fmt = (s?: string | null) => s ? new Date(s).toLocaleDateString('es-ES') : undefined;
    return {
      nif:               data.nif,
      name:              data.name,
      telephone:         data.telephone,
      registration_date: fmt(data.registration_date),
    };
  }
}