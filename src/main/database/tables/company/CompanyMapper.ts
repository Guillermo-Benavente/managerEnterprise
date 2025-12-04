import MapperBase from '../MapperBase';
import CompanyData from "Types/main/database/CompanyData";
import CompanyType from "Types/main/database/CompanyType";
import COMPANY from 'renderer/schemas/CompanySchema';

const CompanyMapper = new MapperBase<CompanyType, CompanyData>(COMPANY, {});

export default CompanyMapper;