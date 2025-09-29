import MapperBase from '../MapperBase';
import DocumentProfileData from 'Types/main/database/DocumentProfileData';
import DocumentProfileType from 'Types/main/database/DocumentProfileType';
import DOCUMENT_PROFILE from 'renderer/schemas/DocumentProfileSchema';

const DocumentCompanyMapper = new MapperBase<DocumentProfileType, DocumentProfileData>(DOCUMENT_PROFILE, {});

export default DocumentCompanyMapper;