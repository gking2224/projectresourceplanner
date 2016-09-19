import * as ActionTypes from '../constants/actionTypes'

const remoteActions = (
  state = [],
  action) => {

  let updated
  switch (action.type) {
    case ActionTypes.CALLING_SERVER:
      updated = state.slice()
      updated.push(action.payload)
      return updated
    case ActionTypes.SERVER_RETURNED:
      updated = state.filter(a => a !== action.payload)
      return updated

    default:
      return state
  }
}

export default remoteActions
