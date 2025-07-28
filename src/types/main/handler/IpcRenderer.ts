interface IpcRenderer {
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  send: (channel: string, ...args: any[]) => void;
  on: (channel: string, fn: (data: any) => void) => void;
}

export default IpcRenderer