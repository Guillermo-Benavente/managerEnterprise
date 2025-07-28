import { ipcRenderer, ipcMain } from 'electron';
import IpcRendererType from 'Types/main/handler/IpcRendererType.js';

const isRenderer = (process && process.type === 'renderer');

class IPC {
  constructor() {
    if (!isRenderer && typeof ipcMain !== 'undefined') {
      this._initMain(ipcMain);
    } else if (isRenderer && typeof ipcRenderer !== 'undefined') {
      this._initRenderer(ipcRenderer);
    } else {
      console.error('No se pudo inicializar IPC: no se detectó ni ipcMain ni ipcRenderer');
    }
  }

  // MAIN
  _initMain(ipc) {
    this.handle = (chan, fn) =>
      ipc.handle(chan, async (e, ...a) => {
        try { return await fn(...a); }
        catch (err) {
          console.error(`Error ${chan}: ${err.message}`); 
          throw err;
        }
      });
    this.on = (chan, fn) => {
      ipc.removeAllListeners(chan);
      ipc.on(chan, (e, ...a) => fn(...a));
    };
  }

  // RENDERER
  _initRenderer(ipc) {
    this.invoke = this._createRenderer(ipc, IpcRendererType.INVOKE);
    this.send   = this._createRenderer(ipc, IpcRendererType.SEND);
    this.on     = this._createRenderer(ipc, IpcRendererType.ON);
  }

  _createRenderer(ipc, type) {
    return channel => (...args) => {
      if (type === IpcRendererType.ON) {
        ipc.on(channel, (_, data) => args[0]?.(data));
      } else {
        return ipc[type](channel, ...args);
      }
    };
  }
}

export default new IPC();