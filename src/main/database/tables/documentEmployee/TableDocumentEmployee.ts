import Database from '../../Database';
import TableBase from '../TableBase';
import DocumentEmployeeData from 'Types/main/database/DocumentEmployeeData';
import SQLMethod from 'Types/main/database/SQLMethod';

export class TableDocumentEmployee extends TableBase<DocumentEmployeeData, string> {
    constructor(db: Database) { super(db, 'document_employee') }
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS document_employee (
                id TEXT PRIMARY KEY,
                document TEXT NOT NULL,
                employee TEXT NOT NULL,
                date DATE,
                FOREIGN KEY(document) REFERENCES document(id) ON DELETE CASCADE,
                FOREIGN KEY(employee) REFERENCES employee(id) ON DELETE CASCADE
            );`,
            [
                `CREATE INDEX IF NOT EXISTS document_employee_document ON document_employee(document);`,
                `CREATE INDEX IF NOT EXISTS document_employee_employee ON document_employee(employee);`
            ]
        );
    }
    async getAll(ref?: string) {
        return this.runSQL(SQLMethod.ALL, 'SELECT * FROM document_employee WHERE employee = ? OR document = ?', [ref, ref], 'Error al obtener la referencia a los documentos');
    }
    async getOne(id: string) { 
        return this.runSQL(SQLMethod.GET, `SELECT * FROM document_employee WHERE id = ? OR document = ?`, [id, id]); 
    }
}