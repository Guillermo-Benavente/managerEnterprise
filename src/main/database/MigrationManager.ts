import Database from './Database';
import SQLMethod from 'Types/main/database/SQLMethod';

export interface TableColumn {
    table: string;
    column: string;
    references?: { table: string; column: string }[];
}

type IdGenerator = () => string;
type OldIdChecker = (id: string) => boolean;

export class MigrationManager {

    constructor(
        private db: Database,
        private tables: TableColumn[],
        private newId: IdGenerator,
        private isOldId: OldIdChecker
    ) { }

    async initMigration() {
        const database = await this.db.getDB();

        await this.db.createTable(database, `
            CREATE TABLE IF NOT EXISTS migration_status (
                table_name TEXT,
                column_name TEXT,
                last_migrated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (table_name, column_name)
            );
        `);

        this.migrateOldIds().catch(console.error);
    }

    private async migrateOldIds() {
        const database = await this.db.getDB();

        for (const t of this.tables) {
            const alreadyMigrated = await this.db.executeSQL<any[]>(
                database,
                SQLMethod.ALL,
                `SELECT * FROM migration_status WHERE table_name = ? AND column_name = ?`,
                [t.table, t.column],
                'Error comprobando migración'
            );
            if (alreadyMigrated.length === 0) {
                const oldRows = await this.db.executeSQL<any[]>(
                    database,
                    SQLMethod.ALL,
                    `SELECT * FROM ${t.table}`,
                    [],
                    'Error obteniendo filas'
                );

                for (const row of oldRows) {
                    const currentId = row[t.column];
                    if (this.isOldId(currentId)) {
                        const newId = this.newId();

                        // Actualizar referencias
                        if (t.references) {
                            for (const ref of t.references) {
                                await this.db.executeSQL(
                                    database,
                                    SQLMethod.RUN,
                                    `UPDATE ${ref.table} SET ${ref.column} = ? WHERE ${ref.column} = ?`,
                                    [newId, currentId],
                                    'Error actualizando referencias'
                                );
                            }
                        }

                        // Actualizar tabla principal
                        await this.db.executeSQL(
                            database,
                            SQLMethod.RUN,
                            `UPDATE ${t.table} SET ${t.column} = ? WHERE ${t.column} = ?`,
                            [newId, currentId],
                            'Error actualizando tabla principal'
                        );
                    }
                }

                // Registrar migración
                await this.db.executeSQL(
                    database,
                    SQLMethod.RUN,
                    `INSERT OR REPLACE INTO migration_status (table_name, column_name) VALUES (?, ?)`,
                    [t.table, t.column],
                    'Error registrando migración'
                );
            }
        }
    }
}
