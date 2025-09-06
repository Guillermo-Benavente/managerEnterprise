import TableBase from '../TableBase';
import GroupDocumentData from 'Types/main/database/GroupDocumentData';
import SQLMethod from 'Types/main/database/SQLMethod';

export class TableGroupDocument extends TableBase<GroupDocumentData, string> {
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS groupdocument (
                id VARCHAR(15) PRIMARY KEY,     
                name VARCHAR(100) NOT NULL,
                document VARCHAR(15) NOT NULL,
                date DATE NOT NULL
            );`,
            [
                `CREATE INDEX IF NOT EXISTS groupdocument_document ON groupdocument(document);`
            ]
        );
    }
    async getAll(document: string) {
        return this.runSQL(SQLMethod.ALL, 'SELECT * FROM groupdocument WHERE document = ?', [document], 'Error al obtener los grupos');
    }
    async getOne(id: string) {
        return this.runSQL(SQLMethod.GET, 'SELECT * FROM groupdocument WHERE id = ?', [id], 'Error al obtener el grupo');
    }
    async insert(grp: GroupDocumentData) {
        const id = grp.name + Date.now();
        return this.runSQL(SQLMethod.RUN,
            `INSERT INTO groupdocument (id, name, document, date)
                VALUES (?, ?, ?, ?)`,
            [id, grp.name, grp.document, grp.date],
            'Error al insertar un grupo'
        );
    }
    async update(grp: GroupDocumentData) {
        return this.runSQL(SQLMethod.RUN,
            `UPDATE groupdocument
                SET date = ?
                WHERE id = ?`,
            [grp.date, grp.id],
            'Error al actualizar el grupo'
        );
    }
    async delete(id: string) {
        return this.runSQL(SQLMethod.RUN, `DELETE FROM groupdocument WHERE id = ?`, [id]);
    }
}