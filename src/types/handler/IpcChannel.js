const IpcChannel = Object.freeze({
  GETALL:          'getAll',
  GETONE:          'get',
  INSERT:          'insert',
  UPDATE:          'update',
  DELETE:          'delete',
  GET_SERVER:      'get-server',
  SVG_MODIFY:      'modify-svg',
  NAVIGATE:        'navigate',
  MODAL:           'modal-window',
  MODAL_RESPONSE:  'modal-response',
  MODAL_SEND:      'modal-send',
  DIALOG:          'dialog-window',
  DIALOG_RESPONSE: 'dialog-response',
  DIALOG_SAVE:     'save-dialog',
  DIALOG_OPEN:     'open-dialog',
  FILE_SAVE:       'save-file',
});

export default IpcChannel;