import { createAction } from 'redux-actions'

import { ActionTypes } from '../constants'
import { Utils } from '../utils'
import { SecurityApi, BudgetApi } from '../api'
import { GlobalActions } from '.'

const SecurityActions = {

  authSuccess: createAction(ActionTypes.AUTHENTICATED),

  signedOut: createAction(ActionTypes.SIGNED_OUT),

  displaySignIn: createAction(ActionTypes.DISPLAY_SIGN_IN),

  signOut: (sessionInfo, xhr) => {
    const msg = 'signOut'
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => SecurityApi.signOut(sessionInfo, xhr),
        successAC: () => SecurityActions.signedOut(),
        errorAC: err => GlobalActions.remoteError(err)
      })
    }
  },

  signIn: (username, password, xhr) => {
    const msg = `signIn ${username}`
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => SecurityApi.authenticate(username, password, xhr),
        successAC: ({response: authentication}) => SecurityActions.authSuccess({authentication}),
        errorAC: err => GlobalActions.remoteError(err)
      })
    }
  },

  validate: (token, xhr) => {
    const msg = `validate ${token}`
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => SecurityApi.validate(token, xhr),
        successAC: ({response: authentication}) => SecurityActions.authSuccess({authentication}),
        errorAC: err => GlobalActions.remoteError(err)
      })
    }
  }
}

export default SecurityActions
