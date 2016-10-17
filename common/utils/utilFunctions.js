import React from 'react'
import XMLHttpRequest from 'xmlhttprequest'

import { GlobalActions } from '../actions'

export const Utils = {
  months: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  month_Indices: () => Utils.months().map( (m, idx) => idx),

  ifPermissioned: (sessionInfo, permission, positive, negative) => {
    if (Utils.hasPermission(sessionInfo, permission)) {
      return Utils.doIt(positive)
    }
    else {
      return (negative) ?
        Utils.doIt(negative) :
        <span className={`missingPermission missingPermission_${permission}`}></span>
    }
  },

  hasPermission: (sessionInfo, permission) => {
    return (sessionInfo && sessionInfo.permissions && sessionInfo.permissions.indexOf(permission) !== -1)
  },

  hasAllPermissions: (sessionInfo, permissions) => {
    return permissions.reduce( (b, p) => b && Utils.hasPermission(sessionInfo, p), true)
  },

  hasAtLeastOnePermission: (sessionInfo, permissions) => {
    return permissions.reduce( (b, p) => b || Utils.hasPermission(sessionInfo, p), false)
  },

  doIt: (it) => {
    if (typeof it === 'function') return it()
    else return it
  },

  doRemoteAction: dispatch => ({
    remoteAction,
    msg = new Date(),
    warningAC = null,
    successAC = () => null,
    errorAC = err => GlobalActions.remoteError(err)
  }) => {

    const unqMsg = msg + Date.now()
    dispatch(GlobalActions.callingServer(unqMsg))
    if (warningAC) dispatch(warningAC())

    let returnNotified = false
    remoteAction().then((response) => {
      dispatch(GlobalActions.serverReturned(unqMsg))
      returnNotified = true
      dispatch(successAC(response))
    }).catch((e) => {
      if (!returnNotified) dispatch(GlobalActions.serverReturned(unqMsg))
      returnNotified = true
      if (errorAC) dispatch(errorAC(e))
    })
  }
}
