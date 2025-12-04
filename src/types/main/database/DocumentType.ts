type DocumentType = {
  id: string;
  name: string;
  content: JSON;
  url: string;
  buffer?: Buffer;
};

export default DocumentType;