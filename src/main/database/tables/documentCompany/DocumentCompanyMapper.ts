import MapperBase from '../MapperBase';
import DocumentCompanyData from 'Types/main/database/DocumentCompanyData';
import DocumentCompanyType from 'Types/main/database/DocumentCompanyType';
import DOCUMENT_COMPANY from 'renderer/schemas/DocumentCompanySchema';

const DocumentCompanyMapper = new MapperBase<DocumentCompanyType, DocumentCompanyData>(DOCUMENT_COMPANY, {});

export default DocumentCompanyMapper;