import CompanyData from 'Types/database/CompanyData';
import CompanyType from 'Types/database/CompanyType';
import CompanyMapper from './CompanyMapper';

export default class Company {

  constructor(private data: CompanyData) {
    if (!data.nif)         throw new Error('El NIF es obligatorio');
    if (!data.name)       throw new Error('El nombre de la empresa es obligatorio');
    if (!data.telephone)  throw new Error('El teléfono es obligatorio');
  }

  /** UI → dominio */
  static fromView(c: CompanyType): Company {
    if (!c.nif)        throw new Error('El NIF es obligatorio');
    if (!c.name)       throw new Error('El nombre de la empresa es obligatorio');
    if (!c.telephone)  throw new Error('El teléfono es obligatorio');

    return new Company(CompanyMapper.toData(c));
  }

  /** dominio → BD plano (strings ISO) */
  toData(): CompanyData {
    return this.data;
  }

  /** dominio → UI */
  toFrontend(): CompanyType {
    return CompanyMapper.toFrontend(this.data);
  }
}