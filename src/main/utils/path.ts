import { app } from 'electron';
import { join } from 'path';
import { FolderType } from 'Types/shared/handler/FolderType';
type FolderTypeValue = (typeof FolderType)[keyof typeof FolderType];

export const getDb = () => join(app.getPath('userData'), 'manager.db');
export const getFolder = (folder: FolderTypeValue, id: string) => join(app.getPath('userData'), folder, id);