import { dirname, join } from 'path';
import { promises as fspromise, existsSync } from 'fs';
import { SaveFile } from '../fileWriter';
import ipc from '../ipc';
import { UUIDv4 } from '../utils/uuidCreate';
import { getFolder } from '../utils/path';
import ITable from '../database/tables/ITable';
import { ModelClass } from '../database/tables/IModel';
import Profile from '../database/tables/profile/Profile';
import Employee from '../database/tables/employee/Employee';
import Company from '../database/tables/company/Company';
import Document from '../database/tables/document/Document';
import DocumentEmployee from '../database/tables/documentEmployee/DocumentEmployee';
import DocumentCompany from '../database/tables/documentCompany/DocumentCompany';
import DocumentProfile from '../database/tables/documentProfile/DocumentProfile';
import IDatabase from '../database/IDatabase';
import TableName from 'Types/shared/handler/TableName';
import IpcChannel from 'Types/shared/handler/IpcChannel';
import IpcMain from 'Types/main/handler/IpcMain';
import FolderType from 'Types/shared/handler/FolderType';
type FolderTypeValue = (typeof FolderType)[keyof typeof FolderType];

const ipcM = ipc as IpcMain;
const { rm, readdir, rmdir } = fspromise;

export default class DatabaseHandler {
    constructor(readonly db: IDatabase) { }
    public register() {
        this.dbHandlers(TableName.PROFILE, this.db, Profile);

        this.dbHandlers(TableName.EMPLOYEE, this.db, Employee, {
            [IpcChannel.DELETE]: async (dni: string) => {
                const documents = await this.db.tables.document.getAll(dni);
                const path = getFolder(FolderType.EMPLOYEES, dni);
                if (existsSync(path)) {
                    for (const document of documents) await rm(document.url);
                    const remaining = await readdir(path);
                    if (remaining.length === 0) await rmdir(path);
                }
                return await this.db.tables.employee.delete(dni);
            }
        });
        this.dbHandlers(TableName.COMPANY, this.db, Company, {
            [IpcChannel.DELETE]: async (nif: string) => {
                const documents = await this.db.tables.document.getAll(nif);
                const path = getFolder(FolderType.COMPANIES, nif);
                if (existsSync(path)) {
                    for (const document of documents) await rm(document.url);
                    const remaining = await readdir(path);
                    if (remaining.length === 0) await rmdir(path);
                }
                return await this.db.tables.company.delete(nif);
            }
        });

        this.dbHandlers(TableName.DOCUMENT, this.db, Document, {
            [IpcChannel.INSERT]: async (id: string, document: any, folder: FolderTypeValue) => {
                document.url = join(getFolder(folder, id), `${UUIDv4()}.pdf`);
                await SaveFile(document.url, document.data);
                const docId = await this.db.tables.document.insert(Document.fromView(document).toData());
                if (folder == FolderType.EMPLOYEES) await this.db.tables.documentEmployee.insert({ document: docId, employee: id});
                if (folder == FolderType.COMPANIES) await this.db.tables.documentCompany.insert({ document: docId, company: id });
                if (folder == FolderType.PROFILES) await this.db.tables.documentProfile.insert({ document: docId, profile: id });
                return docId;
            },
            [IpcChannel.INSERTALL]: async (id: string, documents: any[], folder: FolderTypeValue) => {
                const formatDocuments = await Promise.allSettled(
                    documents.map(async (document) => {
                        document.url = join(getFolder(folder, id), `${UUIDv4()}.pdf`);
                        await SaveFile(document.url, document.data);
                        return Document.fromView(document).toData();
                    })
                );
                const goodResults = formatDocuments
                    .filter(r => r.status === 'fulfilled')
                    .map(r => (r as any).value);
                const docIds = await this.db.tables.document.insertAll(goodResults);
                docIds.forEach(async docId => {
                    if (folder == FolderType.EMPLOYEES) await this.db.tables.documentEmployee.insert({ document: docId, employee: id });
                    if (folder == FolderType.COMPANIES) await this.db.tables.documentCompany.insert({ document: docId, company: id });
                    if (folder == FolderType.PROFILES) await this.db.tables.documentProfile.insert({ document: docId, profile: id });
                });
                return docIds;
            },
            //TODO: Cambiar el UPDATE esta desactualizado
            [IpcChannel.UPDATE]: async (document: any) => {
                if (document.data) {
                    await rm(document.url);
                    await SaveFile(document.url, document.data);
                }
                await this.db.tables.document.update(Document.fromView(document).toData());
                return { success: true };
            },
            [IpcChannel.DELETE]: async (id: string) => {
                const document = await this.db.tables.document.getOne(id);
                const documentUrl = document?.url ?? '';
                if (existsSync(documentUrl)) {
                    await rm(documentUrl);
                    const path = dirname(documentUrl);
                    const remaining = await readdir(path);
                    if (remaining.length === 0) await rmdir(path);
                }
                return await this.db.tables.document.delete(id);
            }
        });

        this.dbHandlers(TableName.DOCUMENTEMPLOYEE, this.db, DocumentEmployee);
        this.dbHandlers(TableName.DOCUMENTCOMPANY, this.db, DocumentCompany);
        this.dbHandlers(TableName.DOCUMENTPROFILE, this.db, DocumentProfile);

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

        // INSERT ALL
        ipcM.handle(
            `${IpcChannel.INSERTALL}-${prefix}`,
            custom[IpcChannel.INSERTALL] ?? (async (views: V[]) => {
                const dataArray = views.map(view => Class.fromView(view).toData());
                return await table.insertAll(dataArray);
            })
        );

        // INSERT
        ipcM.handle(
            `${IpcChannel.INSERT}-${prefix}`,
            custom[IpcChannel.INSERT] ?? (async (view: V) => {
                const data = Class.fromView(view).toData();
                return await table.insert(data);
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