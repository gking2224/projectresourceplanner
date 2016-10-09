import { ActionTypes } from '../constants'
import update from 'react-addons-update'

const DEFAULT_STATE = {activeProjectId: null}

const projectScreen = (state = DEFAULT_STATE, action) => {

  switch (action.type) {

  case ActionTypes.PROJECTS_LOADED: return update(state, {activeProjectId: {$set: action.payload.projectId}})

  case ActionTypes.PROJECT_SAVED: return update(state, {activeProjectId: {$set: null}})

  case ActionTypes.BUDGETS_LOADED:
    return (action.payload.projectId) ?
      Object.assign({}, state, {activeProjectId: action.payload.projectId}) :
      state

  default:
    return state
  }
}

export default projectScreen
