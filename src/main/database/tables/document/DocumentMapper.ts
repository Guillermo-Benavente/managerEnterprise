import DocumentData from "Types/database/DocumentData";
import DocumentType from "Types/database/DocumentType";

export default class DocumentMapper {
  static toData(d: DocumentType): DocumentData {
    return {
      id:       d.id,
      name:     d.name,
      company:  d.company,
      content:  JSON.stringify(d.content),
      url:      d.url,
    };
  }

  static toFrontend(data: DocumentData): DocumentType {
    return {
      id:       data.id,
      name:     data.name,
      company:  data.company,
      content:  JSON.parse(data.content),
      url:      data.url,
    };
  }
}