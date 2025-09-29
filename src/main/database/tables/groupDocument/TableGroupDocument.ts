import Database from '../../Database';
import TableBase from '../TableBase';
import GroupDocumentData from 'Types/main/database/GroupDocumentData';
import SQLMethod from 'Types/main/database/SQLMethod';

export class TableGroupDocument extends TableBase<GroupDocumentData, string> {
    constructor(db: Database) { super(db, 'group_document') }
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS group_document (
                id VARCHAR(15) PRIMARY KEY,     
                name VARCHAR(100) NOT NULL,
                document VARCHAR(15) NOT NULL,
                date DATE NOT NULL
            );`,
            [
                `CREATE INDEX IF NOT EXISTS group_document_document ON group_document(document);`
            ]
        );
    }
    async getAll(document?: string) {
        return this.runSQL(SQLMethod.ALL, 'SELECT * FROM group_document WHERE document = ?', [document], 'Error al obtener los grupos');
    }
}