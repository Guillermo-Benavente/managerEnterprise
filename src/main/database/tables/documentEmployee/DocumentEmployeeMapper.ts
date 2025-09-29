import MapperBase from '../MapperBase';
import DocumentEmployeeData from 'Types/main/database/DocumentEmployeeData';
import DocumentEmployeeType from 'Types/main/database/DocumentEmployeeType';
import DOCUMENT_EMPLOYEE from 'renderer/schemas/DocumentEmployeeSchema';

const DocumentCompanyMapper = new MapperBase<DocumentEmployeeType, DocumentEmployeeData>(DOCUMENT_EMPLOYEE, {});

export default DocumentCompanyMapper;