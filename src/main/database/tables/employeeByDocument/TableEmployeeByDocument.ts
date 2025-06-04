import SQLMethod from 'Types/database/SQLMethod';
import TableBase from '../TableBase';
import EmployeeByDocumentData from 'Types/database/EmployeeByDocumentData';

export class TableEmployeeByDocument extends TableBase<EmployeeByDocumentData, string> {
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS employeebydocument (
                id VARCHAR(15) PRIMARY KEY,
                employee VARCHAR(15) NOT NULL,
                document VARCHAR(15) NOT NULL,
                date DATE NOT NULL,
                FOREIGN KEY (employee) REFERENCES employee(dni) ON DELETE CASCADE,
                FOREIGN KEY (document) REFERENCES documents(id) ON DELETE CASCADE
            );`,
            [
                `CREATE INDEX IF NOT EXISTS employeebydocument_employee ON employeebydocument(employee);`,
                `CREATE INDEX IF NOT EXISTS employeebydocument_document ON employeebydocument(document);`
            ]
        );
    }
    async getAll(document: string) { 
        return this.runSQL(SQLMethod.ALL, 'SELECT * FROM employeebydocument WHERE document = ?', [document], 'Error al obtener los empleados del documento'); 
    }
    async getOne(id: string) { 
        return this.runSQL(SQLMethod.GET, 'SELECT * FROM employeebydocument WHERE id = ?', [id], 'Error al obtener el empleados del documento');
    }
    async insert(ebd: EmployeeByDocumentData) { 
        const id = ebd.employee + Date.now();
        return this.runSQL(SQLMethod.RUN, 
            `INSERT INTO employeebydocument (id, employee, document, date)
                VALUES (?, ?, ?, ?)`,
            [id, ebd.employee, ebd.document, ebd.date],
            'Error al insertar una referencia del documento del empleado'
        );
    }
    async update(ebd: EmployeeByDocumentData) { 
        return this.runSQL(SQLMethod.RUN, 
            `UPDATE employeebydocument
                SET date = ?
                WHERE id = ?`,
            [ebd.date, ebd.id],
            'Error al actualizar el empleado del documento'
        );
    }
    async delete(id: string) { 
        return this.runSQL(SQLMethod.RUN, `DELETE FROM employeebydocument WHERE id = ?`, [id]);
    }
}