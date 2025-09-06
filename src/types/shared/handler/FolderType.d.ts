declare const FolderType: {
  readonly COURSES: 'courses';
  readonly DOCUMENTS: 'documents';
};

export default FolderType;

export type FolderType = (typeof FolderType)[keyof typeof FolderType];