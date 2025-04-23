export const EMPLOYEE = {
    'dni': {
        'name':'dni',
        'type':'text',
        'identifier':true,
        'showForm':true,
        'showTable':true
    },
    'name': {
        'name':'nombre',
        'type':'text',
        'showForm':true,
        'showTable':true,
        'showFormSelectorText':true
    },
    'surnames': {
        'name':'apellidos',
        'type':'text',
        'showForm':true,
        'showTable':true,
        'showFormSelectorText':true
    },
    'discharge_date': {
        'name':'alta',
        'type':'date',
        'showForm':true,
        'showTable':true
    },
    'leave_date': {
        'name':'baja',
        'type':'date',
        'showTable':true
    },
    'medical_leave_date': {
        'name':'alta médica',
        'type':'date',
        'showTable':true
    },
    'medical_discharge_date': {
        'name':'baja médica',
        'type':'date',
        'showTable':true
    },
    'courses': {
        'name':'cursos',
        'type':'file',
        'accept':'.pdf',
        'showForm':true,
        'showTable':true
    }
}

//[{ 'nif': '','nombre': '','teléfono': '','email': '','domicilio fiscal':''}];
export const COMPANY = { 
    'nif': {
        'name':'nif',
        'type':'string',
        'showForm':true,
        'showTable':true
    },
    'name': {
        'name':'nombre',
        'type':'string',
        'showForm':true,
        'showTable':true
    },
    'telephone': {
        'name':'teléfono',
        'type':'string',
        'showForm':true,
        'showTable':true
    },
    'registration_date':{
        'name':'fecha de registro',
        'type':'date',
        'showForm':true,
        'showTable':true
    }
};

export const COURSE = {
    'id': {
        'name':'id',
        'type':'string',
        'showTable':false
    },
    'name':{
        'name':'nombre',
        'type':'string',
        'showTable':true
    },
    'employee':{
        'name':'empleado',
        'type':'string',
        'refrence':true,
        'showTable':false
    },
    'url':{
        'name':'dirección',
        'type':'string',
        'showTable':false
    }
}

export const DOCUMENT = {
    'id': {
        'name':'id',
        'type':'string',
        'showTable':false
    },
    'name':{
        'name':'nombre',
        'type':'string',
        'showForm':true,
        'showTable':true
    },
    'company':{
        'name':'empresa',
        'type':'string',
        'refrence':true,
        'showTable':false
    },
    'content':{
        'name':'contenido',
        'type':'string',
        'showTable':false
    },
    'url':{
        'name':'dirección',
        'type':'string',
        'showTable':false
    }
}

export const DOCUMENTBYEMPLOYEES = {
    'id': {
        'name':'id',
        'type':'string'
    },
    'employee':{
        'name':'empleado',
        'type':'string',
        'refrence':true
    },
    'document':{
        'name':'documento',
        'type':'string',
        'refrence':true
    },
    'date':{
        'name':'fecha',
        'type':'date',
        'showForm':true
    }
}

/**
 * Formatea uno o varios empleados, estructurando sus datos de forma más legible.
 * 
 * @param {Object|Array<Object>} employeeOrArray Un solo objeto de empleado o un array de objetos empleados a formatear.
 *                                               Cada objeto debe tener las propiedades requeridas por `formatSingleEmployee`.
 * 
 * @returns {Object|Array<Object>} Si se recibe un solo empleado, retorna un objeto con sus datos formateados.
 *                                 Si se recibe un array de empleados, retorna un array de objetos con los datos de cada empleado formateados.
 * 
 * @example
 * // Ejemplo de uso con un solo empleado:
 * const formattedEmployee = FormatEmployee({
 *     dni: '12345678A',
 *     name: 'Juan',
 *     first_surname: 'Pérez',
 *     second_surname: 'Gómez',
 *     discharge_date: new Date('2022-01-01'),
 *     leave_date: null,
 *     medical_leave_date: null,
 *     medical_discharge_date: null,
 *     courses: [{ title: 'Curso de Seguridad' }]
 * });
 * console.log(formattedEmployee.surnames); // "Pérez Gómez"
 * 
 * @example
 * // Ejemplo de uso con varios empleados:
 * const formattedEmployees = FormatEmployee([
 *     { dni: '12345678A', name: 'Juan', first_surname: 'Pérez', second_surname: 'Gómez', ... },
 *     { dni: '87654321B', name: 'María', first_surname: 'López', second_surname: 'Martínez', ... }
 * ]);
 * console.log(formattedEmployees[0].surnames); // "Pérez Gómez"
 * 
 * @revision 0.0.0
 * @date 2024-11-05
 * @author guillermob
 */
export function FormatEmployee(employeeOrArray) {
    if (Array.isArray(employeeOrArray)) return employeeOrArray.map(employee => FormatSingleEmployee(employee));
    else return FormatSingleEmployee(employeeOrArray);
}

/**
 * Formatea los datos de un empleado para estructurarlos de forma más legible.
 * 
 * @param {Object} employee Objeto que representa los datos originales del empleado.
 *                           Este objeto debe contener las siguientes propiedades:
 *                           - `dni` (string): Identificador único del empleado.
 *                           - `name` (string): Nombre del empleado.
 *                           - `first_surname` (string): Primer apellido del empleado.
 *                           - `second_surname` (string): Segundo apellido del empleado.
 *                           - `discharge_date` (Date): Fecha de alta del empleado.
 *                           - `leave_date` (Date): Fecha de baja del empleado.
 *                           - `medical_leave_date` (Date): Fecha de baja médica.
 *                           - `medical_discharge_date` (Date): Fecha de alta médica.
 *                           - `courses` (Array<Object>): Lista de cursos completados por el empleado.
 * 
 * @returns {Object} Un nuevo objeto con los datos formateados del empleado:
 *                   - `dni` (string): Identificador único del empleado.
 *                   - `name` (string): Nombre del empleado.
 *                   - `surnames` (string): Apellidos completos concatenados.
 *                   - `discharge_date` (Date): Fecha de alta del empleado.
 *                   - `leave_date` (Date): Fecha de baja del empleado.
 *                   - `medical_leave_date` (Date): Fecha de baja médica.
 *                   - `medical_discharge_date` (Date): Fecha de alta médica.
 *                   - `courses` (Array<Object>): Lista de cursos completados por el empleado.
 * 
 * @example
 * // Ejemplo de uso:
 * const formattedEmployee = formatSingleEmployee({
 *     dni: '12345678A',
 *     name: 'Juan',
 *     first_surname: 'Pérez',
 *     second_surname: 'Gómez',
 *     discharge_date: new Date('2022-01-01'),
 *     leave_date: null,
 *     medical_leave_date: null,
 *     medical_discharge_date: null,
 *     courses: [{ title: 'Curso de Seguridad' }]
 * });
 * console.log(formattedEmployee.surnames); // "Pérez Gómez"
 * 
 * @revision 0.0.0
 * @date 2024-11-05
 * @author guillermob
 */
//TODO Actualizar comentario
function FormatSingleEmployee(employee) {

    let newFormatEmployee;

    if(Object.entries(employee).length === 5) newFormatEmployee = {
        dni: employee.dni,
        name: employee.name,
        surnames: employee.surnames,
        discharge_date: employee.discharge_date,
        leave_date: null,
        medical_leave_date: null,
        medical_discharge_date: null,
        courses: employee.courses.length
    }; else newFormatEmployee = {
        dni: employee.dni,
        name: employee.name,
        surnames: employee.first_surname + ' ' + employee.second_surname,
        discharge_date: employee.discharge_date,
        leave_date: employee.leave_date,
        medical_leave_date: employee.medical_leave_date,
        medical_discharge_date: employee.medical_discharge_date,
        courses: employee.courses
    };

    return newFormatEmployee;
}

//TOOD crear comentarios
export function FormatDbEmployee(employee) {

    let surnamesArray = employee.surnames.split(" ");

    return {
        dni: employee.dni,
        name: employee.name,
        first_surname: surnamesArray[0],
        second_surname: surnamesArray[1] || '',
        discharge_date: employee.discharge_date,
        courses: employee.courses
    };
}

//TOOD crear comentarios
async function responseDb(apiMethod, params = []) {
  try {
    return await window.dbAPI[apiMethod](...params);
  } catch (error) {
    console.error(`Error en ${apiMethod}:`, error);
    throw error;
  }
}

/**
 * Obtiene una lista de empleados desde la base de datos usando la API `window.dbAPI.getEmployees()`
 * y ejecuta un callback con el resultado de la operación.
 * 
 * @param {Function} callback Función a ejecutar tras intentar obtener la lista de empleados.
 *                              Recibe los siguientes parámetros:
 *                              - `success` (boolean): Indica si la operación fue exitosa (`true`) o fallida (`false`).
 *                              - `data` (Array<Object> | Error): Contiene un array con los empleados en caso de éxito, o el error ocurrido en caso de fallo.
 * 
 * @returns {Promise<void>} No retorna ningún valor, pero el `callback` se ejecutará una vez completada la operación.
 * 
 * @throws {Error} Si ocurre algún error durante la obtención de los empleados, se captura y muestra en la consola.
 * 
 * @example
 * // Ejemplo de uso:
 * GetEmployees((success, data) => {
 *     if (success) {
 *         console.log('Lista de empleados:', data);
 *     } else {
 *         console.error('Error obteniendo lista de empleados:', data);
 *     }
 * });
 * 
 * @revision 0.0.0
 * @date 2024-11-05
 * @author guillermob
 */
//TODO cambiar comentarios
export const GetEmployees = () => responseDb('getEmployees', []);

/**
 * Obtiene los datos de un empleado de la base de datos usando la API `window.dbAPI.getEmployee(dni)`
 * y ejecuta un callback con el resultado de la operación.
 * 
 * @param {string} dni Identificador único (DNI) del empleado a buscar.
 * @param {Function} callback Función a ejecutar tras intentar obtener el empleado.
 *                              Recibe los siguientes parámetros:
 *                              - `success` (boolean): Indica si la operación fue exitosa (`true`) o fallida (`false`).
 *                              - `data` (Object | Error): Contiene el objeto empleado en caso de éxito, o el error ocurrido en caso de fallo.
 * 
 * @returns {Promise<void>} No retorna ningún valor, pero el `callback` se ejecutará una vez completada la operación.
 * 
 * @throws {Error} Si ocurre algún error durante la obtención del empleado, se captura y muestra en la consola.
 * 
 * @example
 * // Ejemplo de uso:
 * GetEmployee('12345678A', (success, data) => {
 *     if (success) {
 *         console.log('Datos del empleado:', data);
 *     } else {
 *         console.error('Error obteniendo empleado:', data);
 *     }
 * });
 * 
 * @revision 0.0.0
 * @date 2024-11-05
 * @author guillermob
 */
//TODO cambiar comentarios
export const GetEmployee = (dni) => responseDb('getEmployee', [dni]);

/**
 * Inserta un nuevo empleado en la base de datos usando la API `window.dbAPI.insertEmployee(employee)`
 * y ejecuta un callback con el resultado de la operación.
 * 
 * @param {Object} employee Objeto que representa los datos del empleado a insertar.
 * @param {Function} callback Función a ejecutar tras intentar insertar el empleado.
 *                              Recibe los siguientes parámetros:
 *                              - `success` (boolean): Indica si la operación fue exitosa (`true`) o fallida (`false`).
 *                              - `error` (Error | null): Error ocurrido durante la inserción del empleado (solo si `success` es `false`).
 * 
 * @returns {Promise<void>} No retorna ningún valor, pero el `callback` se ejecutará una vez completada la operación.
 * 
 * @throws {Error} Si ocurre algún error durante la inserción del empleado, se captura y muestra en la consola.
 * 
 * @example
 * // Ejemplo de uso:
 * SetEmployee({ dni: '12345678A', name: 'Juan', first_surname: 'Pérez', ... }, (success, error) => {
 *     if (success) {
 *         console.log('Empleado insertado correctamente.');
 *     } else {
 *         console.error('Error insertando empleado:', error);
 *     }
 * });
 * 
 * @revision 0.0.0
 * @date 2024-11-05
 * @author guillermob
 */
//TODO cambiar comentarios
export async function SetEmployee(employee) {
  try {
    const courses = employee.courses
    employee.courses = employee.courses.length;

    await responseDb('insertEmployee', [employee]);
    await responseDb('insertCourses', [employee.dni, courses]);

    return true;
  } catch (error) {
    console.error('Error en SetEmployee:', error);
    if (typeof callback === 'function') callback(false, error);
  }
}

/**
 * Actualiza los datos de un empleado en la base de datos usando la API `window.dbAPI.updateEmployee(employee)`
 * y ejecuta un callback con el resultado de la operación.
 * 
 * @param {Object} employee Objeto que representa los datos actualizados del empleado.
 * @param {Function} callback Función a ejecutar tras intentar actualizar el empleado.
 *                              Recibe un objeto con las siguientes propiedades:
 *                              - `success` (boolean): Indica si la operación fue exitosa (`true`) o fallida (`false`).
 *                              - `error` (Error): Error ocurrido durante la actualización del empleado (solo si `success` es `false`).
 * 
 * @returns {Promise<void>} No retorna ningún valor, pero el `callback` se ejecutará una vez completada la operación.
 * 
 * @throws {Error} Si ocurre algún error en la actualización del empleado, se captura y muestra en la consola.
 * 
 * @example
 * // Ejemplo de uso:
 * UpdateEmployee({ dni: '12345678A', name: 'Juan', first_surname: 'Pérez', ... }, result => {
 *     if (result.success) {
 *         console.log('Empleado actualizado correctamente.');
 *     } else {
 *         console.error('Error actualizando empleado:', result.error);
 *     }
 * });
 * 
 * @revision 0.0.0
 * @date 2024-10-28
 * @author guillermob
 */
export const UpdateEmployee = (employee) => responseDb('updateEmployee', [employee]);

/**
 * Elimina un empleado de la base de datos usando la API `window.dbAPI.deleteEmployee(dni)`
 * y ejecuta un callback con el resultado de la operación.
 * 
 * @param {string} dni Identificador único (DNI) del empleado a eliminar.
 * @param {Function} callback Función a ejecutar tras intentar eliminar el empleado.
 *                              Recibe los siguientes parámetros:
 *                              - `success` (boolean): Indica si la operación fue exitosa (`true`) o fallida (`false`).
 *                              - `error` (Error | null): Error ocurrido durante la eliminación del empleado (solo si `success` es `false`).
 * 
 * @returns {Promise<void>} No retorna ningún valor, pero el `callback` se ejecutará una vez completada la operación.
 * 
 * @throws {Error} Si ocurre algún error durante la eliminación del empleado, se captura y muestra en la consola.
 * 
 * @example
 * // Ejemplo de uso:
 * DeleteEmployee('12345678A', (success, error) => {
 *     if (success) {
 *         console.log('Empleado eliminado correctamente.');
 *     } else {
 *         console.error('Error eliminando empleado:', error);
 *     }
 * });
 * 
 * @revision 0.0.0
 * @date 2024-11-05
 * @author guillermob
 */
export const DeleteEmployee = (dni) => responseDb('deleteEmployee', [dni]);

/**
 * Obtiene una lista de empresas desde la API `window.dbAPI.getCompanies()` y ejecuta un callback con el resultado.
 * El callback recibe un objeto que indica si la operación fue exitosa o si ocurrió un error.
 * 
 * @param {Function} callback Función a ejecutar tras obtener los datos de las empresas o al ocurrir un error.
 *                              Recibe un objeto con las siguientes propiedades:
 *                              - `success` (boolean): Indica si la operación fue exitosa (`true`) o fallida (`false`).
 *                              - `data` (array): Lista de empresas (solo si `success` es `true`).
 *                              - `error` (Error): Error ocurrido durante la obtención de empresas (solo si `success` es `false`).
 * 
 * @returns {Promise<void>} No retorna ningún valor, pero el `callback` se ejecutará una vez completada la operación.
 * 
 * @throws {Error} Si ocurre algún error en la obtención de empresas, se captura y muestra en la consola.
 * 
 * @example
 * // Ejemplo de uso:
 * GetCompanies(result => {
 *     if (result.success) {
 *         console.log('Empresas obtenidas:', result.data);
 *         UpdatePages('#tblCompanies', result.data, rowsPerPage);
 *         LoadPage(tableBody, pageNumber, result.data, rowsPerPage);
 *         UploadImages();
 *     } else {
 *         console.error('Error cargando empresas:', result.error);
 *     }
 * });
 * 
 * @revision 0.0.0
 * @date 2024-10-28
 * @author guillermob
 */
export const GetCompanies = () => responseDb('getCompanies', []);

/**
 * Obtiene los datos de una empresa específica desde la API `window.dbAPI.getCompany(nif)` y ejecuta un callback con el resultado.
 * El callback recibe un objeto que indica si la operación fue exitosa o si ocurrió un error.
 * 
 * @param {string} nif El NIF de la empresa a obtener.
 * @param {Function} callback Función a ejecutar tras obtener los datos de la empresa o si ocurre un error.
 *                              Recibe un objeto con las siguientes propiedades:
 *                              - `success` (boolean): Indica si la operación fue exitosa (`true`) o fallida (`false`).
 *                              - `data` (object): Objeto que representa la empresa (solo si `success` es `true`).
 *                              - `error` (Error): Error ocurrido durante la obtención de la empresa (solo si `success` es `false`).
 * 
 * @returns {Promise<void>} No retorna ningún valor, pero el `callback` se ejecutará una vez completada la operación.
 * 
 * @throws {Error} Si ocurre algún error en la obtención de la empresa, se captura y muestra en la consola.
 * 
 * @example
 * // Ejemplo de uso:
 * GetCompany('A12345678', result => {
 *     if (result.success) {
 *         console.log('Empresa obtenida:', result.data);
 *     } else {
 *         console.error('Error cargando empresa:', result.error);
 *     }
 * });
 * 
 * @revision 0.0.0
 * @date 2024-10-28
 * @author guillermob
 */
export const GetCompany = (nif) => responseDb('getCompany', [nif]);

/**
 * Inserta una empresa en la base de datos mediante la API `window.dbAPI.insertCompany(company)` y ejecuta un callback con el resultado.
 * El callback recibe un objeto que indica si la operación fue exitosa o si ocurrió un error.
 * 
 * @param {Object} company Objeto que representa los datos de la empresa a insertar.
 * @param {Function} callback Función a ejecutar tras intentar insertar la empresa.
 *                              Recibe un objeto con las siguientes propiedades:
 *                              - `success` (boolean): Indica si la operación fue exitosa (`true`) o fallida (`false`).
 *                              - `error` (Error): Error ocurrido durante la inserción de la empresa (solo si `success` es `false`).
 * 
 * @returns {Promise<void>} No retorna ningún valor, pero el `callback` se ejecutará una vez completada la operación.
 * 
 * @throws {Error} Si ocurre algún error en la inserción de la empresa, se captura y muestra en la consola.
 * 
 * @example
 * // Ejemplo de uso:
 * SetCompany({ nif: 'A12345678', name: 'Empresa S.A.', telephone: '123456789', registration_date: '2024-01-01' }, result => {
 *     if (result.success) {
 *         console.log('Empresa insertada exitosamente.');
 *     } else {
 *         console.error('Error insertando empresa:', result.error);
 *     }
 * });
 * 
 * @revision 0.0.0
 * @date 2024-10-28
 * @author guillermob
 */
export const SetCompany = (company) => responseDb('insertCompany', [company]);

//TOOD crear comentarios
export const UpdateCompany = (company) => responseDb('updateCompany', [company]);

//TOOD crear comentarios
export const DeleteCompany = (nif) => responseDb('deleteCompany', [nif]);

//TOOD crear comentarios
export const GetCourses = (dni) => responseDb('getCourses', [dni]);

//TOOD crear comentarios
export const GetDocuments = (nif) => responseDb('getDocuments', [nif]);

//TOOD crear comentarios
export const GetDocument = (id) => responseDb('getDocument', [id]);

//TOOD crear comentarios
export const SetDocuments = (nif, documents) => responseDb('insertDocuments', [nif, documents]);

//TOOD crear comentarios
export const UpdateDocument = (document) => responseDb('updateDocument', [document]);

//TOOD crear comentarios
export const DeleteDocument = (id) => responseDb('deleteDocument', [id]);

//TOOD crear comentarios
export const GetEmployeesByDocument = (idDoc) => responseDb('getEmployeesByDocument', [idDoc]);

//TOOD crear comentarios
export const SetEmployeeByDocument = (employee, document, date) => responseDb('insertEmployeeByDocument', [employee, document, date]);

//TOOD crear comentarios
export const UpdateEmployeeByDocument = (employeeByDocument) => responseDb('updateEmployeeByDocument', [employeeByDocument]);

//TOOD crear comentarios
export const DeleteEmployeeByDocument = (id) => responseDb('deleteEmployeeByDocument', [id]);