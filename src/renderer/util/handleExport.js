import { SaveDialog, Dialog } from 'Api/control';
import { ExportCSV } from 'Api/util';
import DialogType from 'Types/renderer/dialog';

export default async function handleExport(fetchDataFn, fileName = 'Tabla', dialogTitle = 'Guardar Tabla') {
    try {
        const data = await fetchDataFn();
        const path = await SaveDialog(dialogTitle, fileName, 'csv');
        if (path != null) {
            await ExportCSV(data, path);
            Dialog('Información', 'Exportación creada correctamente.', DialogType.INFO);
        }
    } catch (err) {
        console.error('Error al exportar la tabla:', err);
        Dialog('Error', 'No se ha podido exportar la tabla.', DialogType.ERROR);
    }
}