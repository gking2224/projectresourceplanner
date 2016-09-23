import update from 'react-addons-update'

import { ActionTypes } from '../constants'

const replaceOrAddProject = (state, project) => {
  if (!state.projectList) return update(state, { projectList: { $set: [project] } })
  const idx = state.projectList.findIndex(p => p._id === project._id)
  if (idx === -1) return update(state, { projectList: { $push: [project] } })
  else return update(state, { projectList: { $splice: [[idx, 1, project]] } })
}

const replaceOrAddProjects = (state, projects) => {
  let newState = state
  projects.forEach((p) => {
    newState = replaceOrAddProject(newState, p)
  })
  return newState
}

const projects = (
  state = {
    projectList: [], activeProjectId: null,
  },
  action) => {

  let newState
  switch (action.type) {

  case ActionTypes.PROJECTS_LOADED: {
    newState = replaceOrAddProjects(state, action.payload.projects)
    if (action.payload.forEdit && action.payload.projects.length === 1) {
      newState.activeProjectId = action.payload.projects[0]._id
    }
    return newState;
  }

  case ActionTypes.PROJECT_SAVED: {
    const newProjects = state.projectList.slice()
    newProjects.push(action.payload.project)
    return Object.assign({}, state, {projectList: newProjects})
  }

  case ActionTypes.PROJECT_DELETED: {
    const updatedProjects = state.projectList.filter(p => p._id !== action.payload.projectId)
    return Object.assign({}, state, {projectList: updatedProjects})
  }
  case ActionTypes.BUDGETS_LOADED: {
    return Object.assign({}, state, {activeProjectId: action.payload.projectId})
  }
  case ActionTypes.VIEW_RESOURCE_SUMMARY:
    return update(state, { projectList: { $set: action.payload.projects } })

  default:
    return state
  }
}

export default projects
