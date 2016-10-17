import update from 'react-addons-update'

import { ActionTypes } from '../constants'
import { ReducerUtils } from '../utils'

const DEFAULT_STATE = {
}
const projects = (state = DEFAULT_STATE, action) => {

  let newState
  switch (action.type) {

  case ActionTypes.PROJECTS_LOADED: return ReducerUtils.addEntity(state, action.payload.projects)

  case ActionTypes.NEW_BUDGET: return ReducerUtils.addEntity(state, action.payload.project)

  case ActionTypes.PROJECT_SAVED: return ReducerUtils.addEntity(state, action.payload.project)

  case ActionTypes.PROJECT_DELETED: return ReducerUtils.removeEntityWithId(state, action.payload.projectId)
  //   return update(state, {[action.payload.projectId]: {$set: undefined}})
  // }
  case ActionTypes.VIEW_RESOURCE_SUMMARY:
    return ReducerUtils.addEntity(state, action.payload.projects || null)

  default:
    return state
  }
}

export default projects

