import { ActionTypes } from '../constants'

const sessionInfo = (
  state = {
    loggedOnUser: null,
    permissions: [],
  },
  action) => {

  switch (action.type) {
  case ActionTypes.SIGN_IN:
    return Object.assign({}, state, {
      loggedOnUser: action.payload.user,
      permissions: action.payload.permissions,
    })

  case ActionTypes.SIGN_OUT:
    return Object.assign({}, state, {
      loggedOnUser: null, permissions: []})

  default:
    return state
  }
}

export default sessionInfo
