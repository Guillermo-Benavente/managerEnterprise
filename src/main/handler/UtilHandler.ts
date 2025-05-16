import ipc from '../ipc';
import { formatLocalDate, formatObjectLD } from '../utils/date';
import IpcChannel from 'Types/handler/IpcChannel';
import IpcMain from 'Types/handler/IpcMain';

const ipcM = ipc as IpcMain;

export default class UtilHandler {
    constructor() {}
    public register() {
        ipcM.handle(IpcChannel.FORMAT_LOCAL_DATE, (date: string) => formatLocalDate(date));
        ipcM.handle(IpcChannel.FORMAT_OBJECT_LD, async (obj: any) => await formatObjectLD(obj));
        
        console.log('Handlers de Util cargados');
    }
}