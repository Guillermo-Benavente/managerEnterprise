type DocumentType = {
  id: string;
  name: string;
  company: string; // nif
  content: JSON;
  url: string;
  buffer?: Buffer;
};

export default DocumentType;