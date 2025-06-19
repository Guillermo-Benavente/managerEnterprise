import { app } from 'electron';
import { join } from 'path';
import { FolderType } from 'Types/handler/FolderType';

export const getDb = () => join(app.getPath('userData'), 'manager.db');
export const getFolder = (folder: FolderType, id: string) => join(app.getPath('userData'), folder, id);