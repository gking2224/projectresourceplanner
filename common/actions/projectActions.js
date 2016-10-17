import { createAction } from 'redux-actions'

import { ActionTypes } from '../constants'
import { GlobalActions } from '.'
import { ProjectApi } from '../api'
import { Utils } from '../utils'


const ProjectActions = {
  projectsLoaded: createAction(ActionTypes.PROJECTS_LOADED),
  projectDeleted: createAction(ActionTypes.PROJECT_DELETED),
  projectSaved: createAction(ActionTypes.PROJECT_SAVED),

  loadProject: (projectId, sessionInfo, xhr) => {
    const msg = `loadProject.${projectId}`
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => ProjectApi.loadProject(projectId, sessionInfo, xhr),
        successAC: ({response: projects}) => ProjectActions.projectsLoaded({ projectId, projects }),
        errorAC: err => dispatch(GlobalActions.remoteError(err)),
      })
    }
  },

  loadProjects: (sessionInfo) => {
    const msg = 'loadProjects'
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => ProjectApi.loadProjects(sessionInfo),
        successAC: ({response: projects}) => ProjectActions.projectsLoaded({ projectId: null, projects }),
        errorAC: err => dispatch(GlobalActions.remoteError(err)),
      })
    }
  },

  saveNewProject: (name) => {
    const msg = `Saving project ${name}`
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => ProjectApi.saveProject({ name }),
        successAC: ({response: project}) => ProjectActions.projectSaved({ project }),
        errorAC: err => dispatch(GlobalActions.remoteError(err)),
      })
    }
  },

  deleteProject: (project, sessionInfo, xhr) => {
    const msg = `Deleting project ${project._id}`
    return (dispatch) => {
      const title = 'Confirm'
      const callback = () => {
        Utils.doRemoteAction(dispatch)({
          msg,
          remoteAction: () => ProjectApi.deleteProject(project._id, sessionInfo, xhr),
          successAC: () => ProjectActions.projectDeleted({ projectId: project._id }),
        })
      }
      const cancel = () => null

      const dialog = {
        callback, cancel, title, message: `Delete project ${project.name}?`,
      }

      dispatch(GlobalActions.displayDialogYesNo(dialog))
    }
  },
}

export default ProjectActions
