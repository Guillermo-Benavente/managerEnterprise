import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';
import Database from './main/database/Database';
import HandlerManager from './main/handler/HandlerManager';
import server from './main/server.js';
import path from 'path';

if (started) {
  app.quit();
}

const Db = new Database();
let serverInstance;

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'icon.png'),
    width: 1100,
    height: 650,
    //autoHideMenuBar: true,
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
    new HandlerManager(Db, mainWindow).register();
  } catch (error) {
    console.error("Error durante la inicialización de la base de datos:", error);
  }

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    details.responseHeaders['Content-Security-Policy'] = [
      `default-src 'self'; 
      frame-src 'self' ${server.getServer()}; 
      style-src 'self' 'unsafe-inline'; 
      script-src 'self'  ${!app.isPackaged ? "'unsafe-eval'" : ""}; 
      object-src 'self' ${server.getServer()}; 
      img-src 'self' data:; 
      connect-src 'self' ${server.getServer()}`
    ];
    callback({ cancel: false, responseHeaders: details.responseHeaders });
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}

app.disableHardwareAcceleration();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  serverInstance = await server.startServer();
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
      serverInstance.close(() => {
        console.log('Servidor Express cerrado.');
      });
      console.log(dbMessage);
      app.quit();
    } catch (err) {
      console.error(err);
    }
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.