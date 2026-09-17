import MapperBase from '../MapperBase';
import DocumentData from "Types/main/database/DocumentData";
import DocumentType from "Types/main/database/DocumentType";
import DOCUMENT from 'renderer/schemas/DocumentSchema';

const DocumentMapper = new MapperBase<DocumentType, DocumentData>(DOCUMENT, {});

export default DocumentMapper;