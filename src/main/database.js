import { app } from 'electron';
import { verbose } from 'sqlite3';
import { join } from 'path';
import { promises as fspromise } from 'fs';
import { SaveFile } from './fileWriter.js';
const { rm } = fspromise;
const sqlite = verbose();

class Database {
    db;

    /**
     * Crea una instancia de la base de datos.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    constructor() {
        const databasePath = join(app.getPath('userData'), 'manager.db');

        this.db = new Promise((resolve, reject) => {
            const dbInstance = new sqlite.Database(databasePath, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
                if (err) {
                    console.error('Error al abrir la base de datos: ' + err.message);
                    reject(err);
                } else {
                    console.log('Base de datos abierta exitosamente.');
                    resolve(dbInstance);
                }
            });
        });
    }

    /**
     * Función genérica para ejecutar cualquier sentencia SQL.
     * @param {object} db - La conexión a la base de datos.
     * @param {string} sql - La sentencia SQL a ejecutar.
     * @param {Array} params - Array de parámetros para la sentencia.
     * @param {('run'|'get'|'all')} method - Método a utilizar:
     *   - 'run' para INSERT, UPDATE, DELETE.
     *   - 'get' para obtener una sola fila.
     *   - 'all' para obtener todas las filas.
     * @param {string} errorMsg - Prefijo del mensaje de error para identificar la operación.
     * @param {function} [onSuccess] - Función opcional para procesar el contexto "this" en 'run' (por ejemplo, lastID o changes).
     * @returns {Promise<any>} - Promesa que se resuelve con el resultado de la consulta o modificación.
     */
    async executeSQL(db, method = 'run', sql, params = [], errorMsg, onSuccess) {
        return new Promise((resolve, reject) => {
            try {
                const stmt = db.prepare(sql);
                stmt[method](...params, function (error, result) {
                    if (error) {
                        console.error(`${errorMsg}:`, error);
                        reject(error);
                    } else {
                        // Si se define onSuccess, se ejecuta con el contexto del statement
                        resolve(onSuccess ? onSuccess.call(this) : result);
                    }
                });
                stmt.finalize();
            } catch (error) {
                console.error(`${errorMsg} (excepción):`, error);
                reject(error);
            }
        });
    }

    /**
    * Inicializa la base de datos SQLite si no ha sido creada previamente.
    * Establece la conexión a la base de datos y verifica la existencia de las tablas requeridas
    * ('employee', 'company' y 'course'). Si las tablas no existen, las crea junto con los índices necesarios.
    * 
    * @async
    * @function InitializeDatabaseAsync
    * @returns {Promise<void>} 
    *          No retorna un valor explícito, pero garantiza que la base de datos esté lista para su uso.
    * @throws {Error} 
    *          Si ocurre algún problema durante la inicialización o la creación de tablas.
    * 
    * @revision 0.0.1
    * @date 2024-11-16
    * @author guillermob
    */
    async InitializeDatabaseAsync() {
        try {
            const db = await this.db;
            const checking = await this.CheckTablesExistAsync();
            if (!checking.exists) await this.CreateTablesAsync(checking.rows);
            await this.executeSQL(db, 'run', 'PRAGMA foreign_keys = ON;', [], 'Error al habilitar claves foráneas');
        } catch (error) {
            console.error('Error durante la inicialización de la base de datos:', error);
        }
    }

    /**
     * Verifica si las tablas 'employee', 'company' y 'course' existen en la base de datos.
     *
     * @async
     * @function CheckTablesExistAsync
     * @returns {Promise<{exists: boolean, rows: Array}>} 
     *          Retorna un objeto con:
     *            - `exists`: `true` si todas las tablas existen, `false` de lo contrario.
     *            - `rows`: Lista de las tablas que existen actualmente.
     * @throws {Error} Si ocurre algún problema durante la consulta.
     * 
     * @revision 0.0.1
     * @date 2024-11-16
     * @author guillermob
     */
    async CheckTablesExistAsync() {
        const db = await this.db;
        const tables = ['employee', 'company', 'course', 'documents', 'employeebydocument'];
        const rows = await this.executeSQL(db,'all',
            `SELECT name 
                FROM sqlite_master 
                WHERE type='table' AND name IN (${tables.map(() => '?').join(', ')})`,
            tables,
            'Error al verificar la existencia de las tablas'
        );
        return {exists: rows.length === tables.length, rows: rows};
    }

    /**
     * Cierra la conexión a la base de datos SQLite.
     *
     * @async
     * @function close
     * @returns {Promise<string>} Retorna un mensaje de éxito si la base de datos se cierra correctamente.
     * @throws Error si ocurre algún problema al cerrar la base de datos.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    async close() {
        const db = await this.db;

        return new Promise((resolve, reject) => {
            db.close((err) => {
                if (err) reject('Error al cerrar la base de datos: ' + err.message);
                else resolve('Base de datos cerrada correctamente.');
            });
        });
    }

    /**
     * Obtiene todos los registros de empleados de la base de datos.
     *
     * @async
     * @function GetEmployees
     * @returns {Promise<Array<Object>>} Un array de objetos, donde cada objeto representa un empleado.
     * @throws Error si ocurre algún problema al obtener los empleados de la base de datos.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    async GetEmployees() {
        const db = await this.db;

        return this.executeSQL(db, 'all', 'SELECT * FROM employee', [], 'Error al obtener los empleados');
    }

    /**
     * Obtiene todos los registros de empresas de la base de datos.
     *
     * @async
     * @function GetCompanies
     * @returns {Promise<Array<Object>>} Un array de objetos, donde cada objeto representa una empresa.
     * @throws Error si ocurre algún problema al obtener las empresas de la base de datos.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    async GetCompanies() {
        const db = await this.db;

        return this.executeSQL(db, 'all', 'SELECT * FROM company', [], 'Error al obtener las empresas');
    }

    //TODO crear comentarios
    async GetCourses(dni) {
        const db = await this.db;

        return this.executeSQL(db, 'all', 'SELECT * FROM course WHERE employee = ?', [dni], 'Error al obtener los cursos');
    }

    //TODO crear comentarios
    async GetDocuments(nif) {
        const db = await this.db;

        return this.executeSQL(db, 'all', 'SELECT * FROM documents WHERE company = ?', [nif], 'Error al obtener los documentos');
    }

    async GetEmployeesByDocument(idDoc) {
        const db = await this.db;

        return this.executeSQL(db, 'all', 'SELECT * FROM employeebydocument WHERE document = ?', [idDoc], 'Error al obtener los empleados del documento');
    }

    /**
     * Obtiene un empleado de la base de datos por su DNI.
     *
     * @async
     * @function GetEmployee
     * @param {string} dni - El DNI del empleado a buscar.
     * @returns {Promise<Object|null>} Un objeto que representa al empleado, o null si no se encuentra.
     * @throws Error si ocurre algún problema al obtener el empleado de la base de datos.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    async GetEmployee(dni) {
        const db = await this.db;

        return this.executeSQL(db, 'get', 'SELECT * FROM employee WHERE dni = ?', [dni], 'Error al obtener el empleado');
    }

    /**
     * Obtiene una empresa de la base de datos por su NIF.
     *
     * @async
     * @function GetCompany
     * @param {string} nif El NIF de la empresa a buscar.
     * @returns {Promise<Object|null>} Un objeto que representa a la empresa, o null si no se encuentra.
     * @throws Error si ocurre algún problema al obtener la empresa de la base de datos.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    async GetCompany(nif) {
        const db = await this.db;

        return this.executeSQL(db, 'get', 'SELECT * FROM company WHERE nif = ?', [nif], 'Error al obtener la empresa');
    }

    //TODO crear comentarios
    async GetDocument(id) {
        const db = await this.db;

        return this.executeSQL(db, 'get', 'SELECT * FROM documents WHERE id = ?', [id], 'Error al obtener el documento');
    }

    /**
     * Inserta un nuevo empleado en la base de datos.
     *
     * @async
     * @function InsertEmployee
     * @param {string} dni DNI del empleado.
     * @param {string} name Nombre del empleado.
     * @param {string} first_surname Primer apellido del empleado.
     * @param {string} second_surname Segundo apellido del empleado.
     * @param {string} discharge_date Fecha de alta del empleado.
     * @param {string} courses Cursos realizados por el empleado.
     * @returns {Promise<void>} No retorna valor, pero inserta al empleado en la base de datos.
     * @throws Error si ocurre algún problema durante la inserción del empleado.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    async InsertEmployee(dni, name, first_surname, second_surname, discharge_date, courses) {
        const db = await this.db;

        return this.executeSQL(db, 'run', 
            `INSERT INTO employee (dni, name, first_surname, second_surname, discharge_date, courses)
                VALUES (?, ?, ?, ?, ?, ?)`,
            [dni, name, first_surname, second_surname, discharge_date, courses],
            'Error al insertar un empleado'
        );
    }

    /**
     * Inserta una nueva empresa en la base de datos.
     *
     * @async
     * @function InsertCompany
     * @param {string} nif NIF de la empresa.
     * @param {string} name Nombre de la empresa.
     * @param {string} telephone Teléfono de contacto de la empresa.
     * @param {string} registration_date Fecha de registro de la empresa.
     * @returns {Promise<void>} No retorna valor, pero inserta la empresa en la base de datos.
     * @throws Error si ocurre algún problema durante la inserción de la empresa.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    async InsertCompany(nif, name, telephone, registration_date) {
        const db = await this.db;

        return this.executeSQL(db, 'run',
            `INSERT INTO company (nif, name, telephone, registration_date)
                VALUES (?, ?, ?, ?)`,
            [nif, name, telephone, registration_date],
            'Error al insertar insertar una empresa'
        );
    }

    //TODO crear comentarios
    async InsertCourse(dni, course) {
        const db = await this.db;
        const id = dni + Date.now();
        const coursePath = join(app.getPath('userData'), 'courses', dni, `${id}.pdf`);

        try {
            await SaveFile(coursePath, course.data);

            await this.executeSQL(db, 'run',
                `INSERT INTO course (id, name, employee, url)
                    VALUES (?, ?, ?, ?)`,
                [id, course.name, dni, coursePath],
                'Error al insertar un curso'
            );

            return id;
        } catch (error) {
            console.error('Error al crear la ruta del curso a guardar:', error);
        }
    }

    //TODO crear comentarios
    async InsertCourses(dni, courses) {
        try {
            const results = [];

            for (const course of courses) {
                const result = await this.InsertCourse(dni, course);
                results.push(result);
            }
            return results;
        } catch (error) {
            console.error('Error al procesar los cursos:', error);
            throw error;
        }
    }

    //TODO crear comentarios
    async InsertDocument(nif, document) {
        const db = await this.db;
        const id = nif + Date.now();
        const documentPath = join(app.getPath('userData'), 'documents', nif, `${id}.pdf`);

        try {
            await SaveFile(documentPath, document.buffer);

            await this.executeSQL(db, 'run',
                `INSERT INTO documents (id, name, company, content, url)
                    VALUES (?, ?, ?, ?, ?)`,
                [id, document.name, nif, JSON.stringify(document.content), documentPath],
                'Error al insertar un documento'
            );

            return id;
        } catch (error) {
            console.error('Error al crear la ruta del documento a guardar:', error);
        }
    }

    //TODO crear comentarios
    async InsertDocuments(nif, documents) {
        try {
            const results = [];

            for (const document of documents) {
                const result = await this.InsertDocument(nif, document);
                results.push(result);
            }
            return results;
        } catch (error) {
            console.error('Error al procesar los documentos:', error);
            throw error;
        }
    }

    //TODO crear comentarios
    async InsertEmployeeByDocument(employee, document, date) {
        const db = await this.db;
        const id = employee + Date.now();

        return this.executeSQL(db, 'run',
            `INSERT INTO employeebydocument (id, employee, document, date)
                VALUES (?, ?, ?, ?)`,
            [id, employee, document, date],
            'Error al insertar una referencia del documento del empleado'
        );
    }

    /**
     * Actualiza los datos de un empleado en la base de datos.
     *
     * @async
     * @function UpdateEmployee
     * @param {string} dni DNI del empleado.
     * @param {string} name Nombre del empleado.
     * @param {string} first_surname Primer apellido del empleado.
     * @param {string} second_surname Segundo apellido del empleado.
     * @param {string} discharge_date Fecha de alta del empleado.
     * @param {string} leave_date Fecha de baja voluntaria del empleado.
     * @param {string} medical_leave_date Fecha de inicio de baja médica del empleado.
     * @param {string} medical_discharge_date Fecha de fin de baja médica del empleado.
     * @param {string} courses Cursos realizados por el empleado.
     * @returns {Promise<void>} No retorna valor, pero actualiza los datos del empleado en la base de datos.
     * @throws Error si ocurre algún problema durante la actualización del empleado.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    async UpdateEmployee(dni, name, first_surname, second_surname, discharge_date, leave_date, medical_leave_date, medical_discharge_date, courses) {
        const db = await this.db;

        return this.executeSQL(db, 'run', 
            `UPDATE employee
                SET name = ?, first_surname = ?, second_surname = ?, discharge_date = ?, leave_date = ?, medical_leave_date = ?, medical_discharge_date = ?, courses = ?
                WHERE dni = ?`,
            [name, first_surname, second_surname, discharge_date, leave_date, medical_leave_date, medical_discharge_date, courses, dni],
            'Error al actualizar un empleado'
        );
    }

    /**
     * Actualiza los datos de una empresa en la base de datos.
     *
     * @async
     * @function UpdateCompany
     * @param {string} nif NIF de la empresa.
     * @param {string} name Nombre de la empresa.
     * @param {string} telephone Teléfono de contacto de la empresa.
     * @param {string} registration_date Fecha de registro de la empresa.
     * @returns {Promise<void>} No retorna valor, pero actualiza los datos de la empresa en la base de datos.
     * @throws Error si ocurre algún problema durante la actualización de la empresa.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    async UpdateCompany(nif, name, telephone, registration_date) {
        const db = await this.db;

        return this.executeSQL(db, 'run',
            `UPDATE company
                SET name = ?, telephone = ?, registration_date = ?
                WHERE nif = ?`,
            [name, telephone, registration_date, nif],
            'Error al actualizar una empresa'
        );
    }

    //TODO Crear comentarios
    async UpdateDocument(id, name, nif = null, content = null, buffer = null) {
        const db = await this.db;

        if (nif && buffer) {
            const documentPath = join(app.getPath('userData'), 'documents', nif, `${id}.pdf`);
            try {
                await rm(documentPath);
                await SaveFile(documentPath, buffer);
            } catch (error) {
                console.error('Error al guardar el archivo del documento:', error);
                throw error;
            }
        }

        try {
            const result = await this.executeSQL(
                db,
                'run',
                content
                    ? `UPDATE documents SET name = ?, content = ? WHERE id = ?`
                    : `UPDATE documents SET name = ? WHERE id = ?`,
                content
                    ? [name, JSON.stringify(content), id]
                    : [name, id],
                'Error al actualizar el documento'
            );

            return result;
        } catch (error) {
            console.error('Error al actualizar el documento en la base de datos:', error);
            throw error;
        }
    }

    //TODO Crear comentarios
    async UpdateEmployeeByDocument(id, date) {
        const db = await this.db;

        return this.executeSQL(db, 'run',
            `UPDATE employeebydocument
                SET date = ?
                WHERE id = ?`,
            [date, id],
            'Error al actualizar el empleado del documento'
        );
    }

    /**
     * Elimina un empleado de la base de datos.
     *
     * @async
     * @function DeleteEmployee
     * @param {string} dni DNI del empleado a eliminar.
     * @returns {Promise<void>} No retorna valor, pero elimina el empleado de la base de datos.
     * @throws Error si ocurre algún problema durante la eliminación del empleado.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    async DeleteEmployee(dni) {
        const db = await this.db;

        return this.executeSQL(db, 'run', `DELETE FROM employee WHERE dni = ?`, [dni]);
    }

    /**
     * Elimina una empresa de la base de datos.
     *
     * @async
     * @function DeleteCompany
     * @param {string} nif NIF de la empresa a eliminar.
     * @returns {Promise<void>} No retorna valor, pero elimina la empresa de la base de datos.
     * @throws Error si ocurre algún problema durante la eliminación de la empresa.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    async DeleteCompany(nif) {
        const db = await this.db;

        return this.executeSQL(db, 'run', 'DELETE FROM company WHERE nif = ?', [nif]);
    }

    //TODO Crear comentarios
    async DeleteDocument(id) {
        const db = await this.db;

        return this.executeSQL(db, 'run', 'DELETE FROM documents WHERE id = ?', [id]);
    }

    //TODO Crear comentarios
    async DeleteEmployeeByDocument(id) {
        const db = await this.db;

        return this.executeSQL(db, 'run', 'DELETE FROM employeebydocument WHERE id = ?', [id]);
    }

    /**
     * Crea las tablas que no existen en la base de datos.
     * 
     * @async
     * @function CreateTablesAsync
     * @param {Array<{name: string}>} rows - Array de objetos que indican las tablas existentes en la base de datos.
     * @returns {Promise<void>} No retorna un valor explícito, pero crea las tablas necesarias.
     */
    async CreateTablesAsync(rows) {
        const existingTables = new Set(rows.map(row => row.name));

        const tablesToCreate = {
            employee: this.CreateTableEmployeeAsync,
            company: this.CreateTableCompanyAsync,
            course: this.CreateTableCourseAsync,
            documents: this.CreateTableDocumentsAsync,
            employeebydocument: this.CreateTableEmployeeByDocumentAsync
        };

        for (const [tableName, createMethod] of Object.entries(tablesToCreate)) {
            if (!existingTables.has(tableName)) {
                console.log(`Creando tabla '${tableName}'...`);
                await createMethod.call(this);
            }
        }
    }

    //TODO Crear comentarios
    async CreatePromisesTable(db, consults){
        await new Promise((resolve, reject) => {
            db.run(consults[0], (err) => err ? reject(err) : resolve());
        });

        if (consults.length > 1) {
            await Promise.all(
                consults.slice(1).map(consult =>
                    new Promise((resolve, reject) => {
                        db.run(consult, (err) => err ? reject(err) : resolve());
                    })
                )
            );
        }
    }


    /**
     * Crea la tabla `employee` en la base de datos junto con sus índices si aún no existen.
     *
     * @async
     * @function CreateTableEmployeeAsync
     * @returns {Promise<void>} No retorna valor, pero crea la estructura de la tabla `employee` en la base de datos.
     * @throws Error si ocurre algún problema durante la creación de la tabla o de los índices.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    //TODO modificar
    async CreateTableEmployeeAsync() {
        const db = await this.db;

        await this.CreatePromisesTable(db, [
            `CREATE TABLE IF NOT EXISTS employee (
                dni VARCHAR(9) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                first_surname VARCHAR(100) NOT NULL,
                second_surname VARCHAR(100),
                discharge_date DATE NOT NULL,
                leave_date DATE,
                medical_leave_date DATE,
                medical_discharge_date DATE,
                courses VARCHAR(100)
            );`,
            `CREATE INDEX IF NOT EXISTS employee_name ON employee(name);`,
            `CREATE INDEX IF NOT EXISTS employee_first_surname ON employee(first_surname);`,
            `CREATE INDEX IF NOT EXISTS employee_second_surname ON employee(second_surname);`
        ]);
    }

    /**
     * Crea la tabla `company` en la base de datos junto con sus índices si aún no existen.
     *
     * @async
     * @function CreateTableCompanyAsync
     * @returns {Promise<void>} No retorna valor, pero crea la estructura de la tabla `company` en la base de datos.
     * @throws Error si ocurre algún problema durante la creación de la tabla o de los índices.
     * 
     * @revision 0.0.0
     * @date 2024-10-28
     * @author guillermob
     */
    //TODO modificar
    async CreateTableCompanyAsync() {
        const db = await this.db;

        await this.CreatePromisesTable(db, [
            `CREATE TABLE IF NOT EXISTS company (
                nif VARCHAR(15) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                telephone VARCHAR(15) NOT NULL,
                registration_date DATE
            );`,
            `CREATE INDEX IF NOT EXISTS company_name ON company(name);`,
            `CREATE INDEX IF NOT EXISTS company_telephone ON company(telephone);`
        ]);
    }

    /**
     * Crea la tabla `course` en la base de datos junto con sus índices si aún no existen.
     *
     * @async
     * @function CreateTableCourseAsync
     * @returns {Promise<void>} No retorna valor, pero crea la estructura de la tabla `course` en la base de datos.
     * @throws Error si ocurre algún problema durante la creación de la tabla o de los índices.
     * 
     * @revision 0.0.0
     * @date 2024-11-16
     * @author guillermob
     */
    //TODO modificar
    async CreateTableCourseAsync() {
        const db = await this.db;

        await this.CreatePromisesTable(db, [
            `CREATE TABLE IF NOT EXISTS course (
                id VARCHAR(15) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                employee VARCHAR(15) NOT NULL,
                url VARCHAR(255) NOT NULL,
                FOREIGN KEY (employee) REFERENCES employee(dni) ON DELETE CASCADE
            );`,
            `CREATE INDEX IF NOT EXISTS course_name ON course(name);`,
            `CREATE INDEX IF NOT EXISTS course_employee ON course(employee);`
        ]);
    }

    //TODO crear comentarios
    async CreateTableDocumentsAsync() {
        const db = await this.db;

        await this.CreatePromisesTable(db, [
            `CREATE TABLE IF NOT EXISTS documents (
                id VARCHAR(15) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                company VARCHAR(15) NOT NULL,
                content TEXT NOT NULL,
                url VARCHAR(255) NOT NULL,
                FOREIGN KEY (company) REFERENCES company(nif) ON DELETE CASCADE
            );`,
            `CREATE INDEX IF NOT EXISTS documents_name ON documents(name);`,
            `CREATE INDEX IF NOT EXISTS documents_company ON documents(company);`
        ]); 
    }

    //TODO crear comentarios
    async CreateTableEmployeeByDocumentAsync() {
        const db = await this.db;

        await this.CreatePromisesTable(db, [
            `CREATE TABLE IF NOT EXISTS employeebydocument (
                id VARCHAR(15) PRIMARY KEY,
                employee VARCHAR(15) NOT NULL,
                document VARCHAR(15) NOT NULL,
                date DATE NOT NULL,
                FOREIGN KEY (employee) REFERENCES employee(dni) ON DELETE CASCADE,
                FOREIGN KEY (document) REFERENCES documents(id) ON DELETE CASCADE
            );`,
            `CREATE INDEX IF NOT EXISTS employeebydocument_employee ON employeebydocument(employee);`,
            `CREATE INDEX IF NOT EXISTS employeebydocument_document ON employeebydocument(document);`
        ]);
    }
}

export default Database;