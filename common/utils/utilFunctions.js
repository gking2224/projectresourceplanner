import React from 'react'
import { GlobalActions } from '../actions'

export const Utils = {
  ifPermissioned: (sessionInfo, permission, positive, negative) => {
    if (Utils.hasPermission(sessionInfo, permission)) {
      return Utils.doIt(positive)
    }
    else {
      return (negative) ? Utils.doIt(negative) : <span className={"missingPermission missingPermission_" + permission}></span>
    }
  },
  hasPermission: (sessionInfo, permission) => {
    return (sessionInfo && sessionInfo.permissions && sessionInfo.permissions.indexOf(permission) !== -1)
  },
  hasAllPermissions: (sessionInfo, permissions,) => {

    return permission.reduce( (b, p) => b && Utils.hasPermission(sessionInfo, p), true)
  },

  hasOnePermissions: (sessionInfo, permissions,) => {

    return permission.reduce( (b, p) => b || Utils.hasPermission(sessionInfo, p), false)
  },

  doIt: (it) => {
    if (typeof it === 'function') return it()
    else return it
  },

  doRemoteAction: (dispatch) => {
    return ({msg = new Date(), warningAC = null, remoteAction, successAC = () => null, errorAC = null}) => {

      dispatch(GlobalActions.callingServer(msg))
      if (warningAC) dispatch(warningAC())

      let returnNotified = false
      remoteAction().then(response => {
        dispatch(GlobalActions.serverReturned(msg))
        returnNotified = true
        dispatch(successAC(response))
      }).catch(e=> {
        if (!returnNotified) dispatch(GlobalActions.serverReturned(msg))
        returnNotified = true
        if (errorAC) dispatch(errorAC(e))
      })
    }
  },

  resourceById: (id, resources) => {
    return resources.find((r) => r._id === id)
  },

  resourceName: (resource) => {
    return (resource) ? resource.firstName + ' ' + resource.surname : null
  }
}
