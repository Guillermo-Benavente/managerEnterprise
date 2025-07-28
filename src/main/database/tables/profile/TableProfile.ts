import TableBase from '../TableBase';
import ProfileData from 'Types/main/database/ProfileData';
import SQLMethod from 'Types/main/database/SQLMethod';

export class TableProfile extends TableBase<ProfileData, string> {
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS profile (
                nif VARCHAR(15) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                telephone VARCHAR(15) NOT NULL
            );`,
            [
                `CREATE INDEX IF NOT EXISTS profile_name ON profile(name);`,
                `CREATE INDEX IF NOT EXISTS profile_telephone ON profile(telephone);`
            ]
        );
    }
    async getAll() { 
        return this.runSQL(SQLMethod.ALL, 'SELECT * FROM profile', [], 'Error al obtener el perfil'); 
    }
    async getOne(id: string) { 
        return this.runSQL(SQLMethod.GET, 'SELECT * FROM profile WHERE nif = ?', [id], 'Error al obtener el perfil');
    }
    async insert(pro: ProfileData) { 
        console.log('ProfileData: ',pro);
        return this.runSQL(SQLMethod.RUN, 
            `INSERT INTO profile (nif, name, telephone)
                VALUES (?, ?, ?)`,
            [pro.nif, pro.name, pro.telephone],
            'Error al insertar datos en el perfil'
        );
    }
    async update(pro: ProfileData) { 
        return this.runSQL(SQLMethod.RUN, 
            `UPDATE profile
                SET name = ?, telephone = ?
                WHERE nif = ?`,
            [pro.name, pro.telephone, pro.nif],
            'Error al actualizar el perfil'
        );
    }
    async delete(id: string) { 
        return this.runSQL(SQLMethod.RUN, 'DELETE FROM profile WHERE nif = ?', [id]);
    }
}