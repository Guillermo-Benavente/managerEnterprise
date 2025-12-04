import Database from '../../Database';
import TableBase from '../TableBase';
import DocumentCompanyData from 'Types/main/database/DocumentCompanyData';
import SQLMethod from 'Types/main/database/SQLMethod';

export class TableDocumentCompany extends TableBase<DocumentCompanyData, string> {
    constructor(db: Database) { super(db, 'document_company') }
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS document_company (
                id TEXT PRIMARY KEY,
                document TEXT NOT NULL,
                company TEXT NOT NULL,
                FOREIGN KEY(document) REFERENCES document(id) ON DELETE CASCADE,
                FOREIGN KEY(company) REFERENCES company(id) ON DELETE CASCADE
            );`,
            [
                `CREATE INDEX IF NOT EXISTS document_company_document ON document_company(document);`,
                `CREATE INDEX IF NOT EXISTS document_company_company ON document_company(company);`
            ]
        );
    }
    async getAll(company?: string) {
        return this.runSQL(SQLMethod.ALL, 'SELECT * FROM document_company WHERE company = ?', [company], 'Error al obtener la referencia a los documentos');
    }
    async getOne(id: string) { 
        return this.runSQL(SQLMethod.GET, `SELECT * FROM document_company WHERE id = ? OR document = ?`, [id, id]); 
    }
}