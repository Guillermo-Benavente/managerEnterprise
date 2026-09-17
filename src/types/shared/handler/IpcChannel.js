const IpcChannel = Object.freeze({
  GETALL:            'getAll',
  GETONE:            'get',
  INSERTALL:         'insertAll',
  INSERT:            'insert',
  UPDATE:            'update',
  DELETE:            'delete',
  GET_SERVER:        'get-server',
  FORMAT_LOCAL_DATE: 'format-local-date',
  FORMAT_OBJECT_LD:  'format-object-local-date',
  EXPORT_CSV:        'export-csv',
  HTML_TO_PDF:       'html-to-pdf',
  NAVIGATE:          'navigate',
  MODAL:             'modal-window',
  MODAL_RESPONSE:    'modal-response',
  MODAL_SEND:        'modal-send',
  DIALOG:            'dialog-window',
  DIALOG_RESPONSE:   'dialog-response',
  DIALOG_SAVE:       'save-dialog',
  DIALOG_OPEN:       'open-dialog',
  FILE_SAVE:         'save-file',
});

export default IpcChannel;