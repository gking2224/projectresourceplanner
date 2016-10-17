import update from 'react-addons-update'

import { ActionTypes } from '../constants'

const remoteActions = (state = ['a'], action) => {

  switch (action.type) {
  case ActionTypes.CALLING_SERVER:
    // updated = state.slice()
    // updated.push(action.payload)
    // return updated
    return update(state, {$push: [action.payload]})
  case ActionTypes.SERVER_RETURNED:
    // updated = state.filter(a => a !== action.payload)
    // return updated
    const idx = state.findIndex(i => i == action.payload)
    return update(state, {$splice: [[idx, 1]]})

  default:
    return state
  }
}

export default remoteActions
