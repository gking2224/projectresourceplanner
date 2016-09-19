import * as ActionType from '../constants/actionTypes'
import { createAction } from 'redux-actions'

export const GlobalActions = {
  userWarning: createAction(ActionType.USER_WARNING),
  callingServer: (payload) => {
    return {
      payload,
      type: ActionType.CALLING_SERVER
    }
  },
  serverReturned: (payload) => {
    return {
      payload,
      type: ActionType.SERVER_RETURNED
    }
  },

  displayDialogYesNo: (payload) => {
    return {
      type: ActionType.DIALOG_YES_NO,
      payload
    }
  },

  displayDialogOk: (payload) => {
    return {
      type: ActionType.DIALOG_OK,
      payload
    }
  },

  displayDialogOkCancel: (payload) => {
    return {
      type: ActionType.DIALOG_OK_CANCEL,
      payload
    }
  },

  clearDialog: () => {
    return {
      type: ActionType.CLEAR_DIALOG
    }
  },

  error: (err, message) => {
    console.log('error')
    console.log(err)
    console.log(message)
    return {
      type: ActionType.ERROR,
      payload: {
        err, message
      }
    }
  }
}
