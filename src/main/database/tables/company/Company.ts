import CompanyData from 'Types/main/database/CompanyData';
import CompanyType from 'Types/main/database/CompanyType';
import CompanyMapper from './CompanyMapper';
import { IModel, ModelClass } from '../IModel';

const Company: ModelClass<CompanyType, CompanyData> = 
class Company implements IModel<CompanyType, CompanyData> {

  constructor(readonly data: CompanyData) {
    if (!data.nif)         throw new Error('El NIF es obligatorio');
    if (!data.name)       throw new Error('El nombre de la empresa es obligatorio');
  }

  /** UI → dominio */
  static fromView(c: CompanyType): IModel<CompanyType, CompanyData> {
    if (!c.nif)        throw new Error('El NIF es obligatorio');
    if (!c.name)       throw new Error('El nombre de la empresa es obligatorio');

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

export default Company;