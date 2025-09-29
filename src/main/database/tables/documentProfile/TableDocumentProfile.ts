import Database from '../../Database';
import TableBase from '../TableBase';
import DocumentProfileData from 'Types/main/database/DocumentProfileData';
import SQLMethod from 'Types/main/database/SQLMethod';

export class TableDocumentProfile extends TableBase<DocumentProfileData, string> {
    constructor(db: Database) { super(db, 'document_profile') }
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS document_profile (
                id TEXT PRIMARY KEY,
                document TEXT NOT NULL,
                profile TEXT NOT NULL,
                FOREIGN KEY(document) REFERENCES document(id) ON DELETE CASCADE,
                FOREIGN KEY(profile) REFERENCES profile(id) ON DELETE CASCADE
            );`,
            [
                `CREATE INDEX IF NOT EXISTS document_profile_document ON document_profile(document);`,
                `CREATE INDEX IF NOT EXISTS document_profile_profile ON document_profile(profile);`
            ]
        );
    }
    async getAll(profile?: string) {
        return this.runSQL(SQLMethod.ALL, 'SELECT * FROM document_profile WHERE profile = ?', [profile], 'Error al obtener la referencia a los documentos');
    }
    async getOne(id: string) { 
        return this.runSQL(SQLMethod.GET, `SELECT * FROM document_profile WHERE id = ? OR document = ?`, [id, id]); 
    }
}