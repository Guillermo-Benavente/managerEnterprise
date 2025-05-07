import DocumentData from 'Types/database/DocumentData';
import DocumentType from 'Types/database/DocumentType';
import DocumentMapper from './DocumentMapper';

export default class Document {

  constructor(private data: DocumentData) {
    if (!data.id)                         throw new Error('El ID del documento es obligatorio');
    if (!data.name)                       throw new Error('El nombre del documento es obligatorio');
    if (!data.company)                    throw new Error('El NIF de la empresa es obligatorio');
    if (!data.url)                        throw new Error('La URL es obligatoria');
  }

  /** UI → dominio */
  static fromView(d: DocumentType): Document {
    if (!d.id)         throw new Error('El ID del documento es obligatorio');
    if (!d.name)       throw new Error('El nombre del documento es obligatorio');
    if (!d.company)    throw new Error('El NIF de la empresa es obligatorio');
    if (!d.url)        throw new Error('La URL es obligatoria');

    return new Document(DocumentMapper.toData(d));
  }

  /** dominio → BD plano */
  toData(): DocumentData {
    return this.data;
  }

  /** dominio → UI */
  toFrontend(): DocumentType {
    return DocumentMapper.toFrontend(this.data);
  }
}