import TableBase from '../TableBase';
import CourseData from 'Types/main/database/CourseData';
import SQLMethod from 'Types/main/database/SQLMethod';

export class TableCourse extends TableBase<CourseData, string> {
    async createTable() {
        await this.newTable(
            `CREATE TABLE IF NOT EXISTS course (
                id VARCHAR(15) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                employee VARCHAR(9) NOT NULL,
                url VARCHAR(255) NOT NULL,
                FOREIGN KEY (employee) REFERENCES employee(dni) ON DELETE CASCADE
            );`,
            [
                `CREATE INDEX IF NOT EXISTS course_name ON course(name);`,
                `CREATE INDEX IF NOT EXISTS course_employee ON course(employee);`
            ]
        );
    }
    async getAll(employee: string) {
        return this.runSQL(SQLMethod.ALL, 'SELECT * FROM course WHERE employee = ?', [employee], 'Error al obtener los cursos');
    }
    async getOne(id: string) { 
        return this.runSQL(SQLMethod.GET, 'SELECT * FROM course WHERE id = ?', [id], 'Error al obtener el curso');
    }
    async insert(cours: Array<CourseData>) {
        const results = [];
        for (const course of cours) results.push(await this._insert(course));
        return results;
    }
    private async _insert(cour: CourseData): Promise<string> {
        await this.runSQL(SQLMethod.RUN,
            `INSERT INTO course (id, name, employee, url)
                VALUES (?, ?, ?, ?)`,
            [cour.id, cour.name, cour.employee, cour.url],
            'Error al insertar un curso'
        );
        return cour.id;
    }
    async update(cour: CourseData) { 
        return this.runSQL(SQLMethod.RUN, 
            `UPDATE course
                SET name = ?, employee = ?, url = ?
                WHERE dni = ?`,
            [cour.name, cour.employee, cour.url, cour.id],
            'Error al actualizar un empleado'
        );
    }
    async delete(id: string) { 
        return this.runSQL(SQLMethod.RUN, 'DELETE FROM course WHERE id = ?', [id]);
    }
}