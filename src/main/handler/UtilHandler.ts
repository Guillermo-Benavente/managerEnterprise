import ipc from '../ipc';
import { formatLocalDate, formatObjectLD } from '../utils/date';
import { exportCSV } from '../utils/export';
import IpcChannel from 'Types/handler/IpcChannel';
import IpcMain from 'Types/handler/IpcMain';

const ipcM = ipc as IpcMain;

export default class UtilHandler {
    public register() {
        ipcM.handle(IpcChannel.FORMAT_LOCAL_DATE, (date: string) => formatLocalDate(date));
        ipcM.handle(IpcChannel.FORMAT_OBJECT_LD, async(obj: any) => await formatObjectLD(obj));
        ipcM.handle(IpcChannel.EXPORT_CSV, (data: Array<any>, filePath: string ) => exportCSV(data,filePath));
        
        console.log('Handlers de Util cargados');
    }
}