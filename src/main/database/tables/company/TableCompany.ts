import Database from '../../Database';
import TableBase from '../TableBase';
import CompanyData from 'Types/main/database/CompanyData';

export class TableCompany extends TableBase<CompanyData, string> {
    constructor(db: Database) { super(db, 'company') }
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS company (
                id TEXT PRIMARY KEY,
                nif VARCHAR(15) NOT NULL,
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
}