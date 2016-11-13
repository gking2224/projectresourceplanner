import { ActionTypes } from '../constants'

const DEFAULT_STATE = {locations: {}, resources: {}}

const keyById = (c) => {
  const rv = {}
  c.forEach(e => rv[e._id] = e)
  return rv
}

const staticRefData = (state = DEFAULT_STATE, action) => {

  switch (action.type) {
  case ActionTypes.REF_DATA_LOADED:
    return {
      locations: keyById(action.payload.locations),
      resources: keyById(action.payload.resources),
      contractTypes: keyById(action.payload.contractTypes)
    }
  default:
    return state
  }
}

export default staticRefData
