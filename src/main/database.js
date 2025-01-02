import { app } from 'electron';
import { verbose } from 'sqlite3';
import { join, dirname } from 'path';
import { promises as fspromise, createWriteStream } from 'fs';
const { mkdir } = fspromise;
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
            await this.db;
            const checking = await this.CheckTablesExistAsync();
            if (!checking.exists) await this.CreateTablesAsync(checking.rows);
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

        return new Promise((resolve, reject) => {
            const query = db.prepare(`
                SELECT name 
                FROM sqlite_master 
                WHERE type='table' AND name IN ('employee', 'company', 'course')
            `);

            query.all((error, rows) => {
                if (error) {
                    console.error("Error al verificar la existencia de las tablas:", error.message);
                    reject(error);
                } else resolve({ exists: rows.length === 3, rows });
            });

            query.finalize();
        });
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

        return new Promise((resolve, reject) => {
            try {
                const query = db.prepare('SELECT * FROM employee');

                query.all((error, rows) => {
                    if (error) {
                        console.error('Error al obtener los empleados:', error);
                        reject(error);
                    } else {
                        resolve(rows);
                    }
                });

                query.finalize();
            } catch (error) {
                console.error('Error al ejecutar la consulta:', error);
                reject(error);
            }
        });
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

        return new Promise((resolve, reject) => {
            try {
                const query = db.prepare('SELECT * FROM company');

                query.all((error, rows) => {
                    if (error) {
                        console.error('Error al obtener las empresas:', error);
                        reject(error);
                    } else {
                        resolve(rows);
                    }
                });

                query.finalize();
            } catch (error) {
                console.error('Error al ejecutar la consulta:', error);
                reject(error);
            }
        });
    }

    //TODO crear comentarios
    async GetCourses(dni) {
        const db = await this.db;

        return new Promise((resolve, reject) => {
            try {
                const query = db.prepare('SELECT * FROM course WHERE employee = ?');

                query.all([dni], (error, row) => {
                    if (error) {
                        console.error('Error al obtener los cursos:', error);
                        reject(error);
                    } else {
                        resolve(row);
                    }
                });

                query.finalize();
            } catch (error) {
                console.error('Error al ejecutar la consulta:', error);
                reject(error);
            }
        });
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

        return new Promise((resolve, reject) => {
            try {
                const query = db.prepare('SELECT * FROM employee WHERE dni = ?');

                query.get([dni], (error, row) => {
                    if (error) {
                        console.error('Error al obtener el empleado:', error);
                        reject(error);
                    } else {
                        resolve(row);
                    }
                });

                query.finalize();
            } catch (error) {
                console.error('Error al ejecutar la consulta:', error);
                reject(error);
            }
        });
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

        return new Promise((resolve, reject) => {
            try {
                const query = db.prepare('SELECT * FROM company WHERE nif = ?');

                query.get([nif], (error, row) => {
                    if (error) {
                        console.error('Error al obtener la empresa:', error);
                        reject(error);
                    } else {
                        resolve(row);
                    }
                });

                query.finalize();
            } catch (error) {
                console.error('Error al ejecutar la consulta:', error);
                reject(error);
            }
        });
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

        return new Promise((resolve, reject) => {
            try {
                const query = db.prepare(`
                    INSERT INTO employee (dni, name, first_surname, second_surname, discharge_date, courses)
                    VALUES (?, ?, ?, ?, ?, ?)
                `);

                query.run(dni, name, first_surname, second_surname, discharge_date, courses, (error) => {
                    if (error) {
                        console.error('Error al insertar un empleado:', error);
                        reject(error);
                    } else {
                        resolve();
                    }
                });

                query.finalize();
            } catch (error) {
                console.error('Error al insertar un empleado:', error);
                reject(error);
            }
        });
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

        return new Promise((resolve, reject) => {
            try {
                const query = db.prepare(`
                    INSERT INTO company (nif, name, telephone, registration_date)
                    VALUES (?, ?, ?, ?)
                `);

                query.run(nif, name, telephone, registration_date, (error) => {
                    if (error) {
                        console.error('Error al insertar una empresa:', error);
                        reject(error);
                    } else {
                        resolve();
                    }
                });

                query.finalize();
            } catch (error) {
                console.error('Error al ejecutar la insercion de la empresa:', error);
                reject(error); 
            }
        });
    }

    //TODO crear comentarios
    async InsertCourse(dni, course) {
        const db = await this.db;
        const id = dni + Date.now();
        const coursePath = join(app.getPath('userData'), 'courses', dni, `${id}.pdf`);

        try {
            await mkdir(dirname(coursePath), { recursive: true });

            const courseBuffer = Buffer.from(course.data, 'base64');

            await new Promise((resolve, reject) => {
                const writeStream = createWriteStream(coursePath);
                writeStream.write(courseBuffer);
                writeStream.end();

                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            const coursePathInserted = await new Promise((resolve, reject) => {
                try {
                    const query = db.prepare(`
                        INSERT INTO course (id, name, employee, url)
                        VALUES (?, ?, ?, ?)
                    `);

                    query.run(id, course.name, dni, coursePath, function (error) {
                        if (error) {
                            console.error('Error al insertar un curso:', error);
                            reject(error);
                        } else {
                            resolve(coursePath);
                        }
                    });

                    query.finalize();
                } catch (error) {
                    console.error('Error al ejecutar la inserción del curso:', error);
                    reject(error); 
                }
            });

            return coursePathInserted;
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

            console.info('Todos los cursos se han procesado correctamente.');
            return results;
        } catch (error) {
            console.error('Error al procesar los cursos:', error);
            throw error;
        }
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

        return new Promise((resolve, reject) => {
            try {
                const query = db.prepare(`
                    UPDATE employee
                    SET name = ?, first_surname = ?, second_surname = ?, discharge_date = ?, leave_date = ?, medical_leave_date = ?, medical_discharge_date = ?, courses = ?
                    WHERE dni = ?
                `);

                query.run(name, first_surname, second_surname, discharge_date, leave_date, medical_leave_date, medical_discharge_date, courses, dni, (error) => {
                    if (error) {
                        console.error('Error al actualizar un empleado:', error);
                        reject(error);
                    } else {
                        resolve();
                    }
                });

                query.finalize();
            } catch (error) {
                console.error('Error al ejecutar la actualizacion del empleado:', error);
                reject(error);
            }
        });
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

        return new Promise((resolve, reject) => {
            try {
                const query = db.prepare(`
                    UPDATE company
                    SET name = ?, telephone = ?, registration_date = ?
                    WHERE nif = ?
                `);

                query.run(name, telephone, registration_date, nif, (error) => {
                    if (error) {
                        console.error('Error al actualizar una empresa:', error);
                        reject(error);
                    } else {
                        resolve();
                    }
                });

                query.finalize();
            } catch (error) {
                console.error('Error al ejecutar la actualizacion de la empresa:', error);
                reject(error);
            }
        });
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

        return new Promise((resolve, reject) => {
            try {
                const query = db.prepare(`
                    DELETE FROM employee WHERE dni = ?
                `);

                query.run(dni, (error) => {
                    if (error) {
                        console.error('Error al eliminar un empleado:', error);
                        reject(error);
                    } else {
                        resolve();
                    }
                });

                query.finalize();
            } catch (error) {
                console.error('Error al ejecutar la eliminacion del empleado:', error);
                reject(error);
            }
        });
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

        return new Promise((resolve, reject) => {
            try {
                const deleteCompanyStmt = db.prepare(`
                    DELETE FROM company WHERE nif = ?
                `);

                deleteCompanyStmt.run(nif, (error) => {
                    if (error) {
                        console.error('Error al eliminar una empresa:', error);
                        reject(error);
                    } else {
                        resolve();
                    }
                });

                deleteCompanyStmt.finalize();
            } catch (error) {
                console.error('Error al ejecutar la eliminacion de la empresa:', error);
                reject(error);
            }
        });
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
        const existingTables = rows.map(row => row.name);

        if (!existingTables.includes('employee')) {
            console.log("Creando tabla 'employee'...");
            await this.CreateTableEmployeeAsync();
        }
        if (!existingTables.includes('company')) {
            console.log("Creando tabla 'company'...");
            await this.CreateTableCompanyAsync();
        }
        if (!existingTables.includes('course')) {
            console.log("Creando tabla 'course'...");
            await this.CreateTableCourseAsync();
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
    async CreateTableEmployeeAsync() {
        const db = await this.db;

        // Crea la tabla employee
        await new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS employee (
                    dni VARCHAR(9) PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    first_surname VARCHAR(100) NOT NULL,
                    second_surname VARCHAR(100),
                    discharge_date DATE NOT NULL,
                    leave_date DATE,
                    medical_leave_date DATE,
                    medical_discharge_date DATE,
                    courses VARCHAR(100)
                );
            `, (err) => {
                if (err) {
                    console.error('Error al crear la tabla employee: ' + err.message);
                    reject(err);
                } else {
                    console.log('Tabla employee creada.');
                    resolve();
                }
            });
        });

        // Crea los índices para la tabla employee
        await Promise.all([
            new Promise((resolve, reject) => {
                db.run(`
                    CREATE INDEX IF NOT EXISTS employee_name ON employee(name);
                `, (err) => {
                    if (err) {
                        console.error('Error al crear el indice employee_name: ' + err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }),
            new Promise((resolve, reject) => {
                db.run(`
                    CREATE INDEX IF NOT EXISTS employee_first_surname ON employee(first_surname);
                `, (err) => {
                    if (err) {
                        console.error('Error al crear el indice employee_first_surname: ' + err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }),
            new Promise((resolve, reject) => {
                db.run(`
                    CREATE INDEX IF NOT EXISTS employee_second_surname ON employee(second_surname);
                `, (err) => {
                    if (err) {
                        console.error('Error al crear el indice employee_second_surname: ' + err.message);
                        reject(err);
                    } else {
                        console.log('Indices de employee creados.');
                        resolve();
                    }
                });
            })
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
    async CreateTableCompanyAsync() {
        const db = await this.db;

        // Crea la tabla company
        await new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS company (
                    nif VARCHAR(15) PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    telephone VARCHAR(15) NOT NULL,
                    registration_date DATE
                );
            `, (err) => {
                if (err) {
                    console.error('Error al crear la tabla company: ' + err.message);
                    reject(err);
                } else {
                    console.log('Tabla company creada.');
                    resolve();
                }
            });
        });

        // Crea los índices para la tabla company
        await Promise.all([
            new Promise((resolve, reject) => {
                db.run(`
                    CREATE INDEX IF NOT EXISTS company_name ON company(name);
                `, (err) => {
                    if (err) {
                        console.error('Error al crear el indice company_name: ' + err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }),
            new Promise((resolve, reject) => {
                db.run(`
                    CREATE INDEX IF NOT EXISTS company_telephone ON company(telephone);
                `, (err) => {
                    if (err) {
                        console.error('Error al crear el indice company_telephone: ' + err.message);
                        reject(err);
                    } else {
                        console.log('Indices de company creados.');
                        resolve();
                    }
                });
            })
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
    async CreateTableCourseAsync() {
        const db = await this.db;

        // Crea la tabla course
        await new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS course (
                    id VARCHAR(15) PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    employee VARCHAR(15) NOT NULL,
                    url VARCHAR(255) NOT NULL
                );
            `, (err) => {
                if (err) {
                    console.error('Error al crear la tabla course: ' + err.message);
                    reject(err);
                } else {
                    console.log('Tabla course creada.');
                    resolve();
                }
            });
        });

        // Crea los índices para la tabla course
        await Promise.all([
                new Promise((resolve, reject) => {
                db.run(`
                    CREATE INDEX IF NOT EXISTS course_name ON course(name);
                `, (err) => {
                    if (err) {
                        console.error('Error al crear el índice course_name: ' + err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }),
            new Promise((resolve, reject) => {
                db.run(`
                    CREATE INDEX IF NOT EXISTS course_employee ON course(employee);
                `, (err) => {
                    if (err) {
                        console.error('Error al crear el índice course_employee: ' + err.message);
                        reject(err);
                    } else {
                        console.log('Indices de course creados.');
                        resolve();
                    }
                });
            })
        ]);
    }
}

export default Database;