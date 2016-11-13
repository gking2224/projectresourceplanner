import { ActionTypes } from '../constants'

const keyById = (c) => {
  const rv = {}
  c.forEach((e) => {
    rv[e._id] = e
  })
  return rv
}

const DEFAULT_STATE = []

const locations = (state = DEFAULT_STATE, action) => {

  switch (action.type) {
  case ActionTypes.REF_DATA_LOADED:
    return keyById(action.payload.locations)
  default:
    return state
  }
}

export default locations
