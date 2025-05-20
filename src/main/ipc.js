import { contextBridge, ipcRenderer, ipcMain } from 'electron';
import IpcRendererType from 'Types/handler/IpcRendererType.js';

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
    const Renderer = type => channel => (...args) =>
    type === IpcRendererType.ON
      ? ipc.on(channel, (_, data) => args[0]?.(data))
      : ipc[type](channel, ...args);

    this.invoke = Renderer(IpcRendererType.INVOKE);
    this.send   = Renderer(IpcRendererType.SEND);
    this.on     = Renderer(IpcRendererType.ON);
  }
}

export default new IPC();