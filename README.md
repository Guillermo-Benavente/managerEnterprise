# Docmaen

## Resumen

**Docmaen** es una aplicación de escritorio para gestión empresarial construida con **Electron** y **React**. Su propósito es proporcionar una solución completa para la gestión de empleados, empresas, cursos y documentos con soporte para PDFs.

## Características

- **Gestión de empleados**: Operaciones CRUD con identificación por DNI
- **Gestión de empresas**: Operaciones CRUD con identificación por NIF
- **Cursos**: Administrar cursos con archivos PDF adjuntos por empleado
- **Documentos**: Administrar documentos con archivos PDF adjuntos por empresa o perfil
- **Relaciones Empleado-Documento**: Seguimiento de qué empleados tienen qué documentos
- **Visor de PDFs**: Visualización de PDFs dentro de la aplicación
- **Exportación a CSV**: Exportar datos de tablas a formato CSV
- **Servidor Express**: Servidor en puerto 3500 para servir archivos PDF

## Pila Tecnológica

- **Electron**: 37.2.1
- **React**: 19.1.0 con TypeScript
- **SQLite3**: Base de datos local con restricciones de clave foránea
- **Express**: Servidor en puerto 3500 para entrega de PDFs
- **react-data-table-component**: Componentes de tabla interactivos
- **react-pdf**: Visualización de PDFs en el renderer
- **electron-squirrel-startup**: Soporte para instalador Windows

## Estructura del Proyecto

```
docmaen/
├── src/
│   ├── main/              # Proceso principal de Electron
│   │   ├── database/      # Tablas SQLite (6 tablas)
│   │   ├── handler/       # Manipuladores IPC
│   │   ├── ipc.js         # Capa de comunicación IPC
│   │   ├── server.js      # Configuración del servidor Express
│   │   └── utils/         # Utilidades de rutas y fechas
│   └── renderer/          # Interfaz de usuario React
│       ├── components/    # Componentes reutilizables
│       │   ├── BarOptions/
│       │   ├── Button/
│       │   ├── Form/
│       │   ├── Header/
│       │   ├── Modal/
│       │   ├── PDFViewer/
│       │   ├── Table/
│       │   ├── TemplateBase/
│       │   ├── TemplateTable/
│       │   └── TemplateFormTable/
│       ├── pages/         # Páginas de la aplicación
│       ├── api/           # Wrappers de base de datos
│       ├── schemas/       # Esquemas de campos
│       ├── routes/        # Rutas React Router
│       └── types/         # Definiciones de tipo
├── .webpack/              # Configuración empaquetada
├── forge.config.js        # Configuración de Electron Forge
├── package.json           # Dependencias y scripts
├── tsconfig.json          # Configuración de TypeScript
└── webpack.*             # Configuraciones Webpack
```

## Esquema de la Base de Datos

La aplicación utiliza **6 tablas** en SQLite con relaciones de clave foránea:

| Tabla | Campos Principales |
|-------|-------------------|
| **profile** | nif (PK), name, telephone |
| **employee** | dni (PK), name, first_surname, second_surname, discharge_date, leave_date, medical_leave_date, medical_discharge_date, dni_date, courses |
| **company** | nif (PK), name, telephone |
| **course** | id (PK), name, employee (FK→employee.dni), url (PDF) |
| **documents** | id (PK), name, company (FK→company.nif), profile (FK→profile.nif), content, url (PDF) |
| **employeeByDocument** | id (PK), employee, document, date |

**Relaciones clave:**
- `course.employee` → `employee.dni` (CASCADE delete)
- `documents.company` → `company.nif` (CASCADE delete)
- `documents.profile` → `profile.nif` (CASCADE delete)
- `employeeByDocument.employee` → `employee.dni` (CASCADE delete)
- `employeeByDocument.document` → `documents.id` (CASCADE delete)

## Canales IPC

La comunicación entre el proceso main y renderer utiliza los siguientes canales:

### Comandos de Base de Datos
- `getAll-{tabla}` - Obtener todos los registros
- `get-{tabla}` - Obtener un registro por ID
- `insert-{tabla}` - Insertar un nuevo registro
- `update-{tabla}` - Actualizar un registro
- `delete-{tabla}` - Eliminar un registro

### Canales Especiales
- `get-server` - Obtener URL del servidor Express
- `format-local-date` - Formatear fecha a formato local (dd/mm/yyyy)
- `format-object-local-date` - Formatear fechas en un objeto
- `export-csv` - Exportar datos a CSV

### Modal y Diálogo
- `modal-window` - Abrir ventana modal
- `modal-send` - Enviar datos desde modal
- `modal-response` - Recibir respuesta modal
- `dialog-window` - Mostrar diálogo nativo
- `dialog-response` - Respuesta de diálogo
- `save-dialog` - Cuadro de diálogo guardar archivo
- `open-dialog` - Cuadro de diálogo abrir archivo
- `file-save` - Guardar archivo (base64)

## Cómo Empezar

### Prerrequisitos

- Node.js (versión 18+ recomendada)
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Entrar al directorio
cd docmaen

# Instalar dependencias
npm install
```

### Ejecutar en desarrollo

```bash
npm start
```

Esto iniciará el servidor Express en el puerto 3500 y abrirá la ventana principal de la aplicación.

### Compilar para distribución

```bash
npm run make
```

Generará los instaladores para las plataformas configuradas en `forge.config.js`.

## Configuración

### Ruta de la Base de Datos

La base de datos se guarda en:
```
%APPDATA%\manager.db
```

### Almacenamiento de PDFs

Los archivos PDF se almacenan en:
```
%APPDATA%\Docmaen\[courses|documents]\[id del empleado o NIF]\
```

### Servidor Express

- **Puerto**: 3500
- **Host**: localhost
- **URL base**: http://localhost:3500

Las rutas de acceso a PDFs son:
- `/pdf/:type/:user/:name` - Sirve archivos PDF del sistema de archivos

## Licencias

**docmaen** es software **privativo y confidencial**. Todos los derechos reservados.

© 2025 Guillermo Benavente Mora.

El software es propietario y confidencial. El uso no autorizado, reproducción, modificación o distribución está estrictamente prohibido sin previo permiso escrito del autor.

Este software incluye componentes de código abierto, cada uno de los cuales conserva su licencia original. Consulte el archivo NOTICE o los repositorios respectivos para obtener detalles completos de licencia.

**Derechos de autor**: Copyright (c) 2025 Guillermo Benavente Mora.

Todos los derechos reservados.

## Disclaimer

Este software se proporciona "tal cual", sin garantías de ningún tipo, ya sea expresas o implícitas, incluidas pero no limitadas a las garantías de comerciabilidad, idoneidad para un propósito particular y no infracción. En ningún caso el autor será responsable de ningún daño, pérdida o reclamo, ya sea en una acción contractual, extracontractual o de otro tipo, que surja del o en conexión con el software.