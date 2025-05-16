import { BrowserWindow } from 'electron';
import IDatabase from '../database/IDatabase';
import DatabaseHandler from './DatabaseHandler';
import UtilHandler from './UtilHandler';
import ControlHandler from './ControlHandler';

class HandlerManager {
  private dbHandler: DatabaseHandler;
  private utilHandler: UtilHandler;
  private controlHandler: ControlHandler;

  constructor(private db: IDatabase, private mainWindow: BrowserWindow) {
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
