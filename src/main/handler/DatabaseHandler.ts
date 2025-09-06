import { join } from 'path';
import { promises as fspromise, existsSync } from 'fs';
import { SaveFile } from '../fileWriter';
import ipc from '../ipc';
import { getFolder } from '../utils/path';
import ITable from '../database/tables/ITable';
import { ModelClass } from '../database/tables/IModel';
import Profile from '../database/tables/profile/Profile';
import Employee from '../database/tables/employee/Employee';
import Company from '../database/tables/company/Company';
import Course from '../database/tables/course/Course';
import Document from '../database/tables/document/Document';
import EmployeeByDocument from '../database/tables/employeeByDocument/EmployeeByDocument';
import IDatabase from '../database/IDatabase';
import TableName from 'Types/shared/handler/TableName';
import IpcChannel from 'Types/shared/handler/IpcChannel';
import IpcMain from 'Types/main/handler/IpcMain';
import FolderType from 'Types/shared/handler/FolderType';
import EntryPointsType from 'Types/shared/entryPoints';
type EntryPointsTypeValue = (typeof EntryPointsType)[keyof typeof EntryPointsType];

const ipcM = ipc as IpcMain;
const { rm, readdir, rmdir } = fspromise;

export default class DatabaseHandler {
    constructor(readonly db: IDatabase) { }
    public register() {
        this.dbHandlers(TableName.PROFILE, this.db, Profile);

        this.dbHandlers(TableName.EMPLOYEE, this.db, Employee, {
            [IpcChannel.DELETE]: async (dni: string) => {
                const courses = await this.db.tables.course.getAll(dni);
                const path = getFolder(FolderType.COURSES, dni);
                if (existsSync(path)) {
                    for (const course of courses) await rm(join(path, `${course.id}.pdf`));
                    const remaining = await readdir(path);
                    if (remaining.length === 0) await rmdir(path);
                }
                return await this.db.tables.employee.delete(dni);
            }
        });
        this.dbHandlers(TableName.COMPANY, this.db, Company, {
            [IpcChannel.DELETE]: async (nif: string) => {
                const documents = await this.db.tables.document.getAll(nif);
                const path = getFolder(FolderType.DOCUMENTS, nif);
                if (existsSync(path)) {
                    for (const doc of documents.filter(d => d.company === nif)) await rm(join(path, `${doc.id}.pdf`));
                    const remaining = await readdir(path);
                    if (remaining.length === 0) await rmdir(path);
                }
                return await this.db.tables.company.delete(nif);
            }
        });
        this.dbHandlers(TableName.COURSE, this.db, Course, {
            [IpcChannel.INSERT]: async (dni: string, courses: any[]) => {
                const formatCourses = await Promise.allSettled(
                    courses.map(async (course, index) => {
                        course.id = dni + Date.now() + index;
                        course.employee = dni;
                        course.url = join(getFolder(FolderType.COURSES, dni), `${course.id}.pdf`);
                        await SaveFile(course.url, course.data);
                        return Course.fromView(course).toData();
                    })
                );
                const goodResults = formatCourses
                    .filter(r => r.status === 'fulfilled')
                    .map(r => (r as any).value);
                return await this.db.tables.course.insert(goodResults);
            },
            [IpcChannel.DELETE]: async (id: string) => {
                const course = await this.db.tables.course.getOne(id);
                const path = getFolder(FolderType.COURSES, course!.employee);
                if (existsSync(path)) {
                    await rm(join(path, `${id}.pdf`));
                    const remaining = await readdir(path);
                    if (remaining.length === 0) await rmdir(path);
                }

                return await this.db.tables.course.delete(id);
            }
        });

        this.dbHandlers(TableName.DOCUMENT, this.db, Document, {
            [IpcChannel.INSERT]: async (nif: string, documents: any[], entryPoint: EntryPointsTypeValue) => {
                const formatDocuments = await Promise.allSettled(
                    documents.map(async (document, index) => {
                        document.id = nif + Date.now() + index;
                        if (entryPoint === EntryPointsType.EDIT_COMPANY) document.company = nif;
                        else document.profile = nif;
                        document.url = join(getFolder(FolderType.DOCUMENTS, nif), `${document.id}.pdf`);
                        await SaveFile(document.url, document.buffer);
                        return Document.fromView(document).toData();
                    })
                );
                const goodResults = formatDocuments
                    .filter(r => r.status === 'fulfilled')
                    .map(r => (r as any).value);
                return await this.db.tables.document.insert(goodResults);
            },
            [IpcChannel.UPDATE]: async (document: any) => {
                if (document.company && document.buffer) {
                    await rm(document.url);
                    await SaveFile(document.url, document.buffer);
                }
                await this.db.tables.document.update(Document.fromView(document).toData());
                return { success: true };
            },
            [IpcChannel.DELETE]: async (id: string) => {
                const document = await this.db.tables.document.getOne(id);
                const path = getFolder(FolderType.DOCUMENTS, document?.company ?? document!.profile);
                if (existsSync(path)) {
                    await rm(join(path, `${id}.pdf`));
                    const remaining = await readdir(path);
                    if (remaining.length === 0) await rmdir(path);
                }
                return await this.db.tables.document.delete(id);
            }
        });

        this.dbHandlers(TableName.EMPLOYEEBYDOCUMENT, this.db, EmployeeByDocument, {
            [IpcChannel.INSERT]: async (employee: string, document: string, date: string) => {
                const id = employee + Date.now();
                const data = EmployeeByDocument.fromView({ id, employee, document, date }).toData();
                return await this.db.tables.employeeByDocument.insert(data);
            }
        });

        console.log('Handlers de Database cargados');
    }

    private dbHandlers<V, D>(
        prefix: typeof TableName[keyof typeof TableName],
        db: IDatabase,
        Class: ModelClass<V, D>,
        custom: Partial<Record<string, (...args: any[]) => Promise<any>>> = {}
    ): void {

        const table = db.tables[prefix] as ITable<D, string>;

        // GET ALL
        ipcM.handle(
            `${IpcChannel.GETALL}-${prefix}`,
            custom[IpcChannel.GETALL] ?? (async (...args: any[]) => {
                const all = await table.getAll(...args);
                return all.map(item => new Class(item).toFrontend());
            })
        );

        // GET ONE
        ipcM.handle(
            `${IpcChannel.GETONE}-${prefix}`,
            custom[IpcChannel.GETONE] ?? (async (key: string) => {
                const one = await table.getOne(key);
                return new Class(one!).toFrontend();
            })
        );

        // INSERT
        ipcM.handle(
            `${IpcChannel.INSERT}-${prefix}`,
            custom[IpcChannel.INSERT] ?? (async (view: V) => {
                const data = Class.fromView(view).toData();
                await table.insert(data);
                return { success: true };
            })
        );

        // UPDATE
        ipcM.handle(
            `${IpcChannel.UPDATE}-${prefix}`,
            custom[IpcChannel.UPDATE] ?? (async (view: V) => {
                const data = Class.fromView(view).toData();
                await table.update(data);
                return { success: true };
            })
        );

        // DELETE
        ipcM.handle(
            `${IpcChannel.DELETE}-${prefix}`,
            custom[IpcChannel.DELETE] ?? (async (key: string) => {
                await table.delete(key);
                return { success: true };
            })
        );
    }
}