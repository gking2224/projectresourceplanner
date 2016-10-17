import { createAction } from 'redux-actions'

import { ActionTypes } from '../constants'

const GlobalActions = {
  userWarning: createAction(ActionTypes.USER_WARNING),
  signInRequired: createAction(ActionTypes.SIGN_IN_REQUIRED),
  notAuthorised: createAction(ActionTypes.NOT_AUTHORISED),
  displayDialogYesNo: createAction(ActionTypes.DIALOG_YES_NO),
  callingServer: payload => ({
    payload,
    type: ActionTypes.CALLING_SERVER
  }),

  serverReturned: payload => ({
    payload,
    type: ActionTypes.SERVER_RETURNED
  }),

  displayDialogOk: payload => ({
    type: ActionTypes.DIALOG_OK,
    payload
  }),

  displayDialogOkCancel: payload => ({
    type: ActionTypes.DIALOG_OK_CANCEL,
    payload
  }),

  clearDialog: () => ({
    type: ActionTypes.CLEAR_DIALOG
  }),

  remoteError: ({errorCode, errorMessage}) => {
    if (errorCode === 401) return GlobalActions.signInRequired({errorMessage})
    else if (errorCode === 403) return GlobalActions.notAuthorised({errorMessage})
    console.log('remote error:')
    console.log(errorCode)
    console.log(errorMessage)
    return {
      type: ActionTypes.ERROR,
      payload: {
        errorCode, errorMessage
      }
    }
  },

  error: ({err, message}) => {
    console.log('error:')
    console.log(err)
    console.log(err.stack)
    console.log(message)
    return {
      type: ActionTypes.ERROR,
      payload: {
        err, message
      }
    }
  }
}

export default GlobalActions
