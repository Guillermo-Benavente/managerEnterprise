import MapperBase from '../MapperBase';
import GroupDocumentData from 'Types/main/database/GroupDocumentData';
import GroupDocumentType from 'Types/main/database/GroupDocumentType';
import GRUOP_DOCUMENT from 'renderer/schemas/GroupDocumentSchema';

const GroupDocumentMapper = new MapperBase<GroupDocumentType, GroupDocumentData>(GRUOP_DOCUMENT, {});

export default GroupDocumentMapper;