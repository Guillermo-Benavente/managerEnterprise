# Docmaen

## Aplicación de Gestión Empresarial Desktop

**Docmaen** es una aplicación completa de escritorio para gestión empresarial, construida con **Electron** y **React**. Diseñada para funcionar en Windows, macOS y Linux, proporciona una solución integral para la gestión de recursos humanos, empresas y documentación asociada.

## 🚀 Características Principales

- **Gestión Completa de Empleados**: CRUD con identificación por DNI, validación de formatos y seguimiento de fechas de alta/baja
- **Gestión de Empresas**: CRUD con identificación por NIF, control de telefonía y datos fiscales
- **Sistema de Cursos**: Asociación de cursos (archivos PDF) a empleados, con generación automática de rutas de almacenamiento
- **Gestión de Documentos**: Subida y asociación de documentos PDF a empresas o perfiles corporativos
- **Relaciones Empleado-Documento**: Sistema de vinculación Many-to-Many con historial de fechas
- **Visor de PDFs Integrado**: Componente `PDFViewer` con carga pereziosa y observador de intersección
- **Servidor Express Incorporado**: Puerto 3500 para servir archivos PDF directamente del sistema de archivos
- **Exportación a CSV**: Funcionalidad completa para exportar cualquier tabla a formato CSV
- **Interfaz Responsive**: Diseño modular con componentes TemplateBase, TemplateTable, TemplateFormTable
- **Navegación Anidada**: Rutas React Router con prefijos por módulo (employee, company, profile)

## 📦 Pila Tecnológica

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Framework** | Electron | 37.2.1 |
| **UI** | React + TypeScript | 19.1.0 + TS 5.8.3 |
| **Estilos** | CSS Modules + Babel | - |
| **Base de Datos** | SQLite3 | - |
| **Servidor** | Express | 5.1.0 |
| **Tablas** | react-data-table-component | - |
| **PDF** | react-pdf | - |
| **Instalador** | electron-squirrel-startup | - |
| **Empaquetado** | Electron Forge | 7.8.1 |

## 🗂️ Estructura del Proyecto

```
docmaen/
├── package.json                    - Metadatos y scripts (start, make, package, publish)
├── forge.config.js                 - Configuración Electron Forge + makers
├── tsconfig.json                   - TypeScript paths y compilación
├── LICENSE.txt                     - Licencia privativa 2025
├── README.md                       - Documentación actual
├── .webpack/                       - Builds procesados
├── webpack.rules.js                - Loaders TS/JS/JSON/node_modules
├── webpack.main.config.js          - Main process Webpack config
└── webpack.renderer.config.js      - Renderer Webpack config + alias

src/
├── main/                         # Proceso Electron principal
│   ├── database/                 # 6 tablas SQLite + operadores
│   │   ├── profile/              - nif, name, telephone
│   │   ├── employee/             - dni, name, surnames, courses, dates
│   │   ├── company/              - nif, name, telephone
│   │   ├── course/               - id, name, employee FK, url PDF
│   │   ├── document/             - id, name, company/profile FK, content, url PDF
│   │   └── employeeByDocument/   - id, employee, document, date
│   ├── handler/                  # DatabaseHandler, ControlHandler, UtilHandler
│   ├── ipc.js                    # Capa comunicación main↔renderer
│   ├── server.js                 # Express puerto 3500 + rutas PDF
│   └── utils/                    # path.ts, date.ts, fileWriter.ts
└── renderer/                     # Interfaz de usuario React
    ├── app/App.jsx               # HashRouter + AppRoutes
    ├── routes/                   # AppRoutes + module routes
    ├── components/               # TemplateBase, Button, Form, Modal, Table, PDFViewer, etc.
    ├── pages/                    # Home, Employees, Companies, EmployeeDocument, etc.
    ├── api/                      # db.js, control.js, util.js, handleExport.js
    ├── schemas/                  # CompanySchema, EmployeeSchema, CompanyDocSchema, EmployeeDocSchema
    ├── routes/                   # React Router routes por módulo
    └── types/                    # IpcChannel, TableName, EntryPoints, dialog, buttonType, form
```

## 🗄️ Esquema de la Base de Datos

### Tablas Principales (6)

| Tabla | PK | Campos Relevantes | Relaciones |
|-------|-----|-------------------|------------|
| **profile** | nif | name, telephone | - |
| **employee** | dni | name, first_surname, second_surname, discharge_date, courses, dni_date | FK→course.employee (CASCADE) |
| **company** | nif | name, telephone | FK→documents.company (CASCADE), FK→documents.profile (CASCADE) |
| **course** | id | name, employee (FK→dni), url (PDF) | FK→employee.dni (CASCADE) |
| **documents** | id | name, company (FK→nif), profile (FK→nif), content, url (PDF) | FK→company.nif (CASCADE), FK→profile.nif (CASCADE) |
| **employeeByDocument** | id | employee (FK→dni), document (FK→id), date | FK→employee.dni (CASCADE), FK→documents.id (CASCADE) |

### Scripts de Ejemplo

```sql
-- Creación de índice para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS employee_name ON employee(name);
CREATE INDEX IF NOT EXISTS course_name ON course(name);
CREATE INDEX IF NOT EXISTS documents_name ON documents(name);

-- Eliminación en cascada al borrar empleado
DELETE FROM employee WHERE dni = '12345678-A';
-- Elimina automáticamente: cursos, registros employeeByDocument
```

## 🔗 Canales IPC (Communication Channels)

### Comandos de Base de Datos (por tabla)

Cada tabla soporta 5 operaciones estándar a través de canales IPC:

```
getAll-{table}   - Obtener todos los registros
get-{table}      - Obtener un registro por ID
insert-{table}   - Insertar nuevo registro
update-{table}   - Actualizar registro existente
delete-{table}   - Eliminar registro por ID
```

### Ejemplo de Nombres de Tabla

```javascript
// TableName.js - Objeto frozen
const TableName = Object.freeze({
  PROFILE: 'profile',
  EMPLOYEE: 'employee', 
  COMPANY: 'company',
  COURSE: 'course',
  DOCUMENT: 'document',
  EMPLOYEEBYDOCUMENT: 'employeeByDocument'
});
```

### Canales Especiales y Utilidades

| Canal | Descripción |
|-------|-------------|
| `get-server` | Retorna URL del servidor Express (`http://localhost:3500`) |
| `format-local-date` | Formatea `YYYY-MM-DD` a `DD/MM/YYYY` |
| `format-object-local-date` | Mapea fechas en objeto a formato local |
| `export-csv` | Exporta array de objetos a archivo CSV |
| `modal-window` | Abre ventana modal radial |
| `modal-send` | Envía datos desde modal a parent |
| `modal-response` | Recibe respuesta modal |
| `dialog-window` | Cuadro de diálogo nativo Electron |
| `dialog-response` | Respuesta de botón en diálogo |
| `save-dialog` | Cuadro "Guardar como..." |
| `open-dialog` | Cuadro "Abrir archivo..." |
| `file-save` | Guarda archivo base64 en ruta especificada |

## ⚡ Primeros Pasos

### Instalación

```bash
# 1. Clonar repositorio
git clone <url>

# 2. Entrar al directorio del proyecto
cd docmaen

# 3. Instalar dependencias
npm install
```

### Ejecutar en Desarrollo

```bash
npm start
```

**Esto iniciará:**
- El servidor Express en `http://localhost:3500`
- La ventana principal de Electron
- Cargará automáticamente la base de datos si no existe
- Abrirá la vista Home como punto de entrada

### Compilar para Distribución

```bash
npm run make
```

Generará instaladores en `./out/` para las plataformas definidas en `forge.config.js` (Squirrel Windows, ZIP macOS, DEB/RPM Linux).

##  Configuration

### Ruta de la Base de Datos

Ubicación automática:
```
%APPDATA%\manager.db
```

Almacenamiento multiplataforma:
- **Windows**: `C:\Users\[usuario]\AppData\Roaming\manager.db`
- **macOS**: `/Users/[usuario]/Library/Application Support/manager.db`
- **Linux**: `/home/[usuario]/.config/manager.db`

### Almacenamiento de Archivos PDF

Ruta estructurada:
```
%APPDATA%\Docmaen\[courses|documents]\[id_usuario_o_NIF]\
```

Ejemplos prácticos:
- PDFs de cursos empleados: `%APPDATA%\Docmaen\courses\DNI_EMPLEADO\`
- PDFs de documentos empresas: `%APPDATA%\Docmaen\documents\NIF_EMPRESA\`

### Servidor Express

- **Puerto**: 3500
- **Host**: localhost
- **URL Base**: `http://localhost:3500`
- **Rutas de servicio**:
  - `GET /pdf/courses/:dni/:courseId` - Sirve PDFs de cursos
  - `GET /pdf/documents/:nif/:docId` - Sirve PDFs de documentos

Las rutas son gestionadas automáticamente por `src/main/server.js` usando `app.getPath('appData')`.

## 📄 Licencia

**Docmaen** es software **privativo y confidencial**. Todos los derechos reservados.

© 2025 Guillermo Benavente Mora.

El software es propietario y confidencial. El uso no autorizado, reproducción, modificación o distribución está estrictamente prohibido sin previo permiso escrito del autor.

Este software incluye componentes de código abierto, cada uno de los cuales conserva su licencia original. Consulte el archivo NOTICE o los repositorios respectivos para obtener detalles completos de licencia.

**Derechos de autor**: Copyright (c) 2025 Guillermo Benavente Mora.

Todos los derechos reservados.

## ⚠️ Aviso Legal

Este software se proporciona "tal cual", sin garantías de ningún tipo, ya sea expresas o implícitas, incluidas pero no limitadas a las garantías de comerciabilidad, idoneidad para un propósito particular y no infracción. En ningún caso el autor será responsable de ningún daño, pérdida o reclamo, ya sea en una acción contractual, extracontractual o de otro tipo, que surja del o en conexión con el software.

---

## 🛠️ Scripts Disponibles (package.json)

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia electron-forge con modo desarrollo |
| `npm run package` | Empaqueta la aplicación |
| `npm run make` | Genera instaladores (Squirrel/DEB/RPM/ZIP) |
| `npm run publish` | Publica el paquete |
| `npm run lint` | Mensaje: "No linting configured" |
| `npm run clean` | Remueve carpetas `out`, `dist`, `.webpack` |

## 📬 Contacto / Support

- **Autor**: Guillermo Benavente Mora
- **Email**: guillermobenavente55@gmail.com
- **Año**: 2025