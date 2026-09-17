import Database from '../../Database';
import TableBase from '../TableBase';
import DocumentData from 'Types/main/database/DocumentData';

export class TableDocument extends TableBase<DocumentData, string> {
    constructor(db: Database) { super(db, 'document') }
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS document (
                id TEXT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                content TEXT,
                url VARCHAR(255) NOT NULL
            );`,
            [
                `CREATE INDEX IF NOT EXISTS document_name ON document(name);`
            ]
        );
    }
}