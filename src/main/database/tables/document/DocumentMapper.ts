import DocumentData from "Types/main/database/DocumentData";
import DocumentType from "Types/main/database/DocumentType";

export default class DocumentMapper {
  static toData(d: DocumentType): DocumentData {
    return {
      id:       d.id,
      name:     d.name,
      company:  d.company,
      profile:  d.profile,
      content:  JSON.stringify(d.content),
      url:      d.url,
    };
  }

  static toFrontend(data: DocumentData): DocumentType {
    return {
      id:       data.id,
      name:     data.name,
      company:  data.company,
      profile:  data.profile,
      content:  JSON.parse(data.content),
      url:      data.url,
    };
  }
}