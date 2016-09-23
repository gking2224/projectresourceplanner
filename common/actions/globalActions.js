import { createAction } from 'redux-actions'

import { ActionTypes } from '../constants'

export const GlobalActions = {
  userWarning: createAction(ActionTypes.USER_WARNING),
  callingServer: (payload) => {
    return {
      payload,
      type: ActionTypes.CALLING_SERVER
    }
  },
  serverReturned: (payload) => {
    return {
      payload,
      type: ActionTypes.SERVER_RETURNED
    }
  },

  displayDialogYesNo: (payload) => {
    return {
      type: ActionTypes.DIALOG_YES_NO,
      payload
    }
  },

  displayDialogOk: (payload) => {
    return {
      type: ActionTypes.DIALOG_OK,
      payload
    }
  },

  displayDialogOkCancel: (payload) => {
    return {
      type: ActionTypes.DIALOG_OK_CANCEL,
      payload
    }
  },

  clearDialog: () => {
    return {
      type: ActionTypes.CLEAR_DIALOG
    }
  },

  error: (err, message) => {
    console.log('error')
    console.log(err)
    console.log(message)
    return {
      type: ActionTypes.ERROR,
      payload: {
        err, message
      }
    }
  }
}
