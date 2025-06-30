import SQLMethod from 'Types/database/SQLMethod';
import TableBase from '../TableBase';
import CompanyData from 'Types/database/CompanyData';

export class TableCompany extends TableBase<CompanyData, string> {
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS company (
                nif VARCHAR(15) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                telephone VARCHAR(15) NOT NULL,
                registration_date DATE
            );`,
            [
                `CREATE INDEX IF NOT EXISTS company_name ON company(name);`,
                `CREATE INDEX IF NOT EXISTS company_telephone ON company(telephone);`
            ]
        );
    }
    async getAll() { 
        return this.runSQL(SQLMethod.ALL, 'SELECT * FROM company', [], 'Error al obtener las empresas'); 
    }
    async getOne(id: string) { 
        return this.runSQL(SQLMethod.GET, 'SELECT * FROM company WHERE nif = ?', [id], 'Error al obtener la empresa');
    }
    async insert(com: CompanyData) {
        const nifExistsInProfile = await this.runSQL(
            SQLMethod.GET,
            `SELECT 1 FROM profile WHERE nif = ? LIMIT 1`,
            [com.nif]
        );

        if (nifExistsInProfile) throw new Error('El NIF ya existe en profile. No se puede registrar como company.');
        
        return this.runSQL(SQLMethod.RUN, 
            `INSERT INTO company (nif, name, telephone, registration_date)
                VALUES (?, ?, ?, ?)`,
            [com.nif, com.name, com.telephone, com.registration_date],
            'Error al insertar una empresa'
        );
    }
    async update(com: CompanyData) { 
        return this.runSQL(SQLMethod.RUN, 
            `UPDATE company
                SET name = ?, telephone = ?, registration_date = ?
                WHERE nif = ?`,
            [com.name, com.telephone, com.registration_date, com.nif],
            'Error al actualizar una empresa'
        );
    }
    async delete(id: string) { 
        return this.runSQL(SQLMethod.RUN, 'DELETE FROM company WHERE nif = ?', [id]);
    }
}