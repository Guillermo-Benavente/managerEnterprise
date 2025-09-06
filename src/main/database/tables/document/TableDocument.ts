import TableBase from '../TableBase';
import DocumentData from 'Types/main/database/DocumentData';
import SQLMethod from 'Types/main/database/SQLMethod';

export class TableDocument extends TableBase<DocumentData, string> {
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS documents (
                id VARCHAR(15) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                company VARCHAR(15),
                profile VARCHAR(15),
                content TEXT NOT NULL,
                url VARCHAR(255) NOT NULL,
                FOREIGN KEY (company) REFERENCES company(nif) ON DELETE CASCADE,
                FOREIGN KEY (profile) REFERENCES profile(nif) ON DELETE CASCADE
            );`,
            [
                `CREATE INDEX IF NOT EXISTS documents_name ON documents(name);`,
                `CREATE INDEX IF NOT EXISTS documents_company ON documents(company);`
            ]
        );
    }
    async getAll(nif: string) {
        return this.runSQL(SQLMethod.ALL, 'SELECT * FROM documents WHERE company = ? OR profile = ?', [nif, nif], 'Error al obtener los documentos');
    }
    async getOne(id: string) { 
        return this.runSQL(SQLMethod.GET, 'SELECT * FROM documents WHERE id = ?', [id], 'Error al obtener el documento');
    }
    async insert(docs: Array<DocumentData>) {
        const results = [];
        for (const document of docs) results.push(await this._insert(document));
        return results;
    }
    private async _insert(doc: DocumentData): Promise<string> {
        if (doc.company && doc.profile) throw new Error("Un documento no puede tener ambos NIFs asignados.");

        await this.runSQL(SQLMethod.RUN,
            `INSERT INTO documents (id, name, company, profile, content, url)
                VALUES (?, ?, ?, ?, ?, ?)`,
            [doc.id, doc.name, doc.company ?? null, doc.profile ?? null, doc.content, doc.url],
            'Error al insertar un documento'
        );
        return doc.id;
    }
    async update(doc: DocumentData) {
        await this.runSQL(
            SQLMethod.RUN,
            `UPDATE documents SET name = ?, content = ? WHERE id = ?`,
            [doc.name, doc.content, doc.id],
            'Error al actualizar el documento'
        );
    }
    async delete(id: string) { 
        return this.runSQL(SQLMethod.RUN, 'DELETE FROM documents WHERE id = ?', [id]);
    }
}