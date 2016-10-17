import { ActionTypes } from '../constants'

const DEFAULT_STATE = {
  loggedOnUser: null,
  permissions: [],
  roles: [],
  securityToken: null
}

const sessionInfo = (state = DEFAULT_STATE, action) => {

  switch (action.type) {

  case ActionTypes.SIGNED_OUT:
    return DEFAULT_STATE

  case ActionTypes.AUTHENTICATED:
    return Object.assign({}, state, {
      loggedOnUser: action.payload.authentication.principal,
      permissions: action.payload.authentication.permissions,
      roles: action.payload.authentication.roles,
      securityToken: action.payload.authentication.credentials
    })

    case ActionTypes.SIGN_IN_REQUIRED:
      return Object.assign({}, state, {
        loggedOnUser: null,
        permissions: null,
        roles: null,
        securityToken: null
      })

  default:
    return state
  }
}

export default sessionInfo
