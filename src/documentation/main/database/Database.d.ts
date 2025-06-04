import { Database as SqliteDatabase } from 'sqlite3';
import { TableEmployee } from 'src/main/database/tables/employee/TableEmployee';
import { TableCourse } from 'src/main/database/tables/course/TableCourse';
import { TableCompany } from 'src/main/database/tables/company/TableCompany';
import { TableDocument } from 'src/main/database/tables/document/TableDocument';
import { TableEmployeeByDocument } from 'src/main/database/tables/employeeByDocument/TableEmployeeByDocument';

type SQLMethod = 'run' | 'get' | 'all';

interface RunContext {
    lastID: number;
    changes: number;
}

declare class Database {
    private db: Promise<SqliteDatabase>;
    public tables: {
        employee: TableEmployee,
        course: TableCourse,
        company: TableCompany,
        document: TableDocument,
        employeeByDocument: TableEmployeeByDocument,
    };

    /**
     * Inicializa la instancia de la base de datos.
     * Crea el archivo `manager.db` si no existe y abre conexión.
     *
     * @revision 0.0.0
     * @date 2024-04-28
     * @author guillermob
     */
    constructor();

    /**
     * Obtiene la instancia de SqliteDatabase, esperando a que la conexión esté lista.
     *
     * @returns Promise que resuelve con la conexión SQLite activa.
     */
    getDB(): Promise<SqliteDatabase>;

    /**
     * Cierra la conexión a la base de datos SQLite.
     *
     * @async
     * @returns Mensaje de confirmación si se cierra correctamente.
     * @throws Error con mensaje descriptivo si la operación falla.
     *
     * @revision 0.0.0
     * @date 2024-04-28
     * @author guillermob
     */
    close(): Promise<string>;

    /**
     * Ejecuta una sentencia SQL preparada.
     *
     * @template T Tipo de retorno esperado.
     * @param db Conexión SQLite sobre la que ejecutar.
     * @param method Método de ejecución: 'run' | 'get' | 'all'.
     * @param sql Sentencia SQL a ejecutar.
     * @param params Array de parámetros para la sentencia (opcional).
     * @param errorMsg Prefijo para log de errores (opcional).
     * @param onSuccess Callback opcional que recibe el contexto RunContext y debe retornar T.
     * @returns Promise con el resultado de la consulta o el retorno de onSuccess.
     * 
     * @revision 0.0.0
     * @date 2024-04-28
     * @author guillermob
     */
    executeSQL<T = any>(
        db: SqliteDatabase,
        method: SQLMethod,
        sql: string,
        params?: any[],
        errorMsg?: string,
        onSuccess?: (this: RunContext) => T
    ): Promise<T>;

    /**
     * Crea tablas en la base de datos a partir de un array de sentencias SQL.
     *
     * @param db Conexión SQLite donde ejecutar.
     * @param sqls Array de sentencias SQL para crear tablas.
     * @returns Promise que se resuelve cuando todas las tablas están creadas.
     * 
     * @revision 0.0.0
     * @date 2024-04-28
     * @author guillermob
     */
    createTables(db: SqliteDatabase, sqls: string[]): Promise<void>;
}

export default Database;