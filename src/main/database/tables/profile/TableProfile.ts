import Database from '../../Database';
import TableBase from '../TableBase';
import ProfileData from 'Types/main/database/ProfileData';

export class TableProfile extends TableBase<ProfileData, string> {
    constructor(db: Database) { super(db, 'profile') }
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS profile (
                id TEXT PRIMARY KEY,
                nif VARCHAR(15) NOT NULL,
                name VARCHAR(100) NOT NULL,
                telephone VARCHAR(15) NOT NULL
            );`,
            [
                `CREATE INDEX IF NOT EXISTS profile_name ON profile(name);`,
                `CREATE INDEX IF NOT EXISTS profile_telephone ON profile(telephone);`
            ]
        );
    }
}