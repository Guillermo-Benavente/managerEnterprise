import SQLMethod from 'Types/database/SQLMethod';
import TableBase from '../TableBase';
import EmployeeData from 'Types/database/EmployeeData';

export class TableEmployee extends TableBase<EmployeeData, string> {
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS employee (
                dni VARCHAR(9) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                first_surname VARCHAR(100) NOT NULL,
                second_surname VARCHAR(100),
                discharge_date DATE NOT NULL,
                leave_date DATE,
                medical_leave_date DATE,
                medical_discharge_date DATE,
                courses INTEGER DEFAULT 0
            );`,
            [
                `CREATE INDEX IF NOT EXISTS employee_name ON employee(name);`,
                `CREATE INDEX IF NOT EXISTS employee_first_surname ON employee(first_surname);`,
                `CREATE INDEX IF NOT EXISTS employee_second_surname ON employee(second_surname);`
            ]
        );
    }
    async getAll() { 
        return this.runSQL(SQLMethod.ALL, 'SELECT * FROM employee', [], 'Error al obtener los empleados'); 
    }
    async getOne(id: string) { 
        return this.runSQL(SQLMethod.GET, 'SELECT * FROM employee WHERE dni = ?', [id], 'Error al obtener el empleado');
    }
    async insert(emp: EmployeeData) { 
        return this.runSQL(SQLMethod.RUN, 
            `INSERT INTO employee (dni, name, first_surname, second_surname, discharge_date, courses)
                VALUES (?, ?, ?, ?, ?, ?)`,
            [emp.dni, emp.name, emp.first_surname, emp.second_surname, emp.discharge_date, emp.courses],
            'Error al insertar un empleado'
        );
    }
    async update(emp: EmployeeData) { 
        return this.runSQL(SQLMethod.RUN, 
            `UPDATE employee
                SET name = ?, first_surname = ?, second_surname = ?, discharge_date = ?, leave_date = ?, medical_leave_date = ?, medical_discharge_date = ?, courses = ?
                WHERE dni = ?`,
            [emp.name, emp.first_surname, emp.second_surname, emp.discharge_date, emp.leave_date, emp.medical_leave_date, emp.medical_discharge_date, emp.courses, emp.dni],
            'Error al actualizar un empleado'
        );
    }
    async delete(id: string) { 
        return this.runSQL(SQLMethod.RUN, `DELETE FROM employee WHERE dni = ?`, [id]);
    }
}