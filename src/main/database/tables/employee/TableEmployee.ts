import Database from '../../Database';
import TableBase from '../TableBase';
import EmployeeData from 'Types/main/database/EmployeeData';

export class TableEmployee extends TableBase<EmployeeData, string> {
    constructor(db: Database) { super(db, 'employee') }
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS employee (
                id TEXT PRIMARY KEY,
                dni VARCHAR(20) NOT NULL,
                name VARCHAR(100) NOT NULL,
                first_surname VARCHAR(100) NOT NULL,
                second_surname VARCHAR(100),
                discharge_date DATE NOT NULL,
                leave_date DATE,
                medical_leave_date DATE,
                medical_discharge_date DATE,
                dni_date DATE
            );`,
            [
                `CREATE INDEX IF NOT EXISTS employee_dni ON employee(dni);`,
                `CREATE INDEX IF NOT EXISTS employee_name ON employee(name);`,
                `CREATE INDEX IF NOT EXISTS employee_first_surname ON employee(first_surname);`,
                `CREATE INDEX IF NOT EXISTS employee_second_surname ON employee(second_surname);`
            ]
        );
    }
}