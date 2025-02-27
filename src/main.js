import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import Database from './main/database.js';
import handler from './main/handler.js';

if (started) {
  app.quit();
}

const Db = new Database();

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 650,
    minWidth: 1000,
    minHeight: 650,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      
    }
  })

  try {
    await Db.InitializeDatabaseAsync();
    handler.AddDatabaseHandlers(Db);
    handler.AddUtilHandlers();
    handler.AddPathHandlers(mainWindow);
  } catch (error) {
    console.error("Error durante la inicialización de la base de datos:", error);
  }

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    details.responseHeaders['Content-Security-Policy'] = [
      "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; img-src 'self' data:;"
    ];
    callback({ cancel: false, responseHeaders: details.responseHeaders });
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    try {
      const dbMessage = await Db.close();
      console.log(dbMessage);
      app.quit();
    } catch (err) {
      console.error(err);
    }
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.