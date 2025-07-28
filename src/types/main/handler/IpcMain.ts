interface IpcMain {
  handle: (channel: string, fn: (...args: any[]) => any) => void;
  on: (channel: string, fn: (...args: any[]) => void) => void;
}

export default IpcMain;