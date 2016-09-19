import * as ActionTypes from '../constants/actionTypes'

const sessionInfo = (
  state = {
    loggedOnUser: null,
    permissions: [],
  },
  action) => {

  switch (action.type) {
    case ActionTypes.SIGN_IN:
      return Object.assign({}, state, {
        loggedOnUser: action.user,
        permissions: action.permissions
      })

    case ActionTypes.SIGN_OUT:
      return Object.assign({}, state, {
        loggedOnUser: null, permissions: []})

    default:
      return state
  }
}

export default sessionInfo
