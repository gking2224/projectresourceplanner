import * as ActionType from '../constants/actionTypes'
import { GlobalActions } from '.'
import { ServerAPI, ProjectAPI } from '../api'
import { Utils } from '../utils'
import { createAction } from 'redux-actions'


export const ProjectActions = {
  projectsLoaded : createAction(ActionType.PROJECTS_LOADED),
  projectDeleted : createAction(ActionType.PROJECT_DELETED),
  projectSaved : createAction(ActionType.PROJECT_SAVED),

  loadProject: (projectId) => {
    const msg = "loadProject." + projectId
    return (dispatch) => {

      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => ProjectAPI.loadProjects({_id: projectId}),
        successAC: (projects) => ProjectActions.projectsLoaded({forEdit: true, projectId: projectId, projects: projects}),
        errorAC: (err) => dispatch(GlobalActions.error(err))
      })
    }
  },

  loadProjects: (criteria = {}) => {
    const msg = "loadProjects"
    return (dispatch) => {

      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => ProjectAPI.loadProjects(criteria),
        successAC: (projects) => ProjectActions.projectsLoaded({activeProjectId: null, projects: projects}),
        errorAC: (err) => dispatch(GlobalActions.error(err))
      })
    }
  },

  // viewProjects: () => {
  //   return {
  //     type: ActionType.VIEW_PROJECTS
  //   }
  // },

  // newProject: () => {
  //   return {
  //     type: ActionType.NEW_PROJECT
  //   }
  // },

  saveNewProject: (name) => {
    const msg = "Saving project " + name
    return (dispatch) => {

      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: ()=> ProjectAPI.saveProject({name: name}),
        successAC: (project)=>ProjectActions.projectSaved({project}),
        errorAC: (err) => console.log(err)
      })
    }
  },

  // projectSaved: (project) => {
  //   return {
  //     type: ActionType.PROJECT_SAVED,
  //     project: project
  //   }
  // },

  deleteProject: (projectId) => {
    const msg = "Deleting project " + projectId
    return (dispatch) => {
      const title = 'Confirm'
      const callback = () => {

        Utils.doRemoteAction(dispatch)({
          msg,
          remoteAction: ()=> ProjectAPI.deleteProject(projectId),
          successAC: ()=> ProjectActions.projectDeleted({projectId})
        })
      }
      const cancel = () => null

      const dialog = {
        callback, cancel, title,
        message: `Delete project ${projectId}?`
      }

      dispatch(GlobalActions.displayDialogYesNo(dialog))
    }
  }

  // projectDeleted: (projectId) => {
  //   return {
  //     type: ActionType.PROJECT_DELETED,
  //     payload: projectId
  //   }
  // },
  //
  // viewProjectDetail: (id) => {
  //   return {
  //     type: ActionType.VIEW_PROJECT_DETAIL,
  //     payload: id
  //   }
  // }
}
