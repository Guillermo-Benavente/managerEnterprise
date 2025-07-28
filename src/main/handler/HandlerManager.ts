import { BrowserWindow } from 'electron';
import IDatabase from '../database/IDatabase';
import DatabaseHandler from './DatabaseHandler';
import UtilHandler from './UtilHandler';
import ControlHandler from './ControlHandler';

class HandlerManager {
  readonly dbHandler: DatabaseHandler;
  readonly utilHandler: UtilHandler;
  readonly controlHandler: ControlHandler;

  constructor(readonly db: IDatabase, readonly mainWindow: BrowserWindow) {
    this.dbHandler   = new DatabaseHandler(this.db);
    this.utilHandler = new UtilHandler();
    this.controlHandler = new ControlHandler(this.mainWindow);
  }

  public register() {
    this.dbHandler.register();
    this.utilHandler.register();
    this.controlHandler.register();
  }
}

export default HandlerManager;
