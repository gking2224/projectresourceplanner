import { createAction } from 'redux-actions'

import { ActionTypes } from '../constants'
import { GlobalActions } from '.'
import { ProjectAPI } from '../api'
import { Utils } from '../utils'


const ProjectActions = {
  projectsLoaded: createAction(ActionTypes.PROJECTS_LOADED),
  projectDeleted: createAction(ActionTypes.PROJECT_DELETED),
  projectSaved: createAction(ActionTypes.PROJECT_SAVED),

  loadProject: (projectId) => {
    const msg = `loadProject.${projectId}`
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => ProjectAPI.loadProjects({ _id: projectId }),
        successAC: projects => ProjectActions.projectsLoaded({ forEdit: true, projectId, projects }),
        errorAC: err => dispatch(GlobalActions.error(err)),
      })
    }
  },

  loadProjects: (criteria = {}) => {
    const msg = 'loadProjects'
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => ProjectAPI.loadProjects(criteria),
        successAC: projects => ProjectActions.projectsLoaded({ activeProjectId: null, projects }),
        errorAC: err => dispatch(GlobalActions.error(err)),
      })
    }
  },

  saveNewProject: (name) => {
    const msg = `Saving project ${name}`
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => ProjectAPI.saveProject({ name }),
        successAC: project => ProjectActions.projectSaved({ project }),
        errorAC: err => console.log(err),
      })
    }
  },

  deleteProject: (project) => {
    const msg = `Deleting project ${project._id}`
    return (dispatch) => {
      const title = 'Confirm'
      const callback = () => {
        Utils.doRemoteAction(dispatch)({
          msg,
          remoteAction: () => ProjectAPI.deleteProject(project._id),
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
