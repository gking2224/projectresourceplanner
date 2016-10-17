import { createAction } from 'redux-actions'

import { ActionTypes } from '../constants'
import { GlobalActions } from '.'
import { BudgetApi } from '../api'
import { ProjectApi } from '../api'
import { Utils } from '../utils'

const errorHandler = (err) => GlobalActions.remoteError(err)

export const BudgetActions = {
  budgetDeleted: createAction(ActionTypes.BUDGET_DELETED),
  updateBudget: createAction(ActionTypes.BUDGET_UPDATED),
  budgetSaved: createAction(ActionTypes.BUDGET_SAVED),
  budgetsLoaded: createAction(ActionTypes.BUDGETS_LOADED),
  viewResourceSummary: createAction(ActionTypes.VIEW_RESOURCE_SUMMARY),

  loadResourceSummary: (resourceId, sessionInfo, xhr) => {
    const msg = "loadResourceSummary " + resourceId
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => BudgetApi.getBudgetsReferencingResource(resourceId, sessionInfo, xhr),
        successAC: ({response: budgets}) => {
          return new Promise((fulfill, reject) => {
            ProjectApi.loadProjects(xhr)
              .then( (projects) => fulfill(BudgetActions.viewResourceSummary({resourceId, budgets, projects})))
              .catch(err => dispatch(errorHandler(err)))
          })
        },
        errorAC: errorHandler
      })
    }
  },

  createNewBudget: (projectId, year, sessionInfo, xhr) => {
    const msg = "newBudget " + projectId
    return (dispatch) => {

      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => ProjectApi.loadProject(projectId, sessionInfo, xhr),
        successAC: ({response: project}) => createAction(ActionTypes.NEW_BUDGET)({project, year}),
        errorAC: errorHandler
      })
    }
  },

  loadBudget: (budgetId, sessionInfo, xhr) => {
    const msg = "loadBudget." + budgetId
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => BudgetApi.getBudget(budgetId, sessionInfo, xhr),
        successAC: ({response: budget}) => BudgetActions.budgetsLoaded({budget, forView: true}),
        errorAC: errorHandler,
      })
    }
  },

  loadProjectBudgets:(projectId, sessionInfo, xhr) => {
    const msg = "loadProjectBudgets." + projectId
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => BudgetApi.getProjectBudgets(projectId, sessionInfo, xhr),
        successAC: ({response: budgets}) => BudgetActions.budgetsLoaded({budgets}),
        errorAC: errorHandler
      })
    }
  },

  deleteBudget:({budget, sessionInfo, xhr}) => {
    const msg = "Deleting budget " + budget._id
    return (dispatch) => {
      const title = 'Confirm'
      // create dialog confirm callback
      const callback = () => {

        Utils.doRemoteAction(dispatch)({
          msg,
          remoteAction: ()=> BudgetApi.deleteBudget(budget._id, sessionInfo, xhr),
          successAC: ()=> BudgetActions.budgetDeleted({budgetId: budget._id}),
          errorAC: errorHandler
        })
      }
      // careate dialog cancel callback
      const cancel = () => null

      // construct dialog payload
      const dialog = {
        callback, cancel, title,
        message: `Delete budget ${budget.name}?`
      }

      // display dialog
      dispatch(GlobalActions.displayDialogYesNo({dialog}))
    }
  },

  editBudget: (budgetId, sessionInfo, xhr) => {
    const msg = "Editing budget " + budgetId
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => BudgetApi.getBudget(budgetId, sessionInfo, xhr),
        successAC: ({response: budget}) => BudgetActions.budgetsLoaded({budget, forEdit: true}),
        errorAC: errorHandler
      })
    }
  },

  saveBudget:(budget, callback, sessionInfo, xhr) => {
    const msg = "Saving budget"
    return (dispatch) => {

      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: ()=> BudgetApi.saveBudget(budget, sessionInfo, xhr),
        successAC: ({response: saved}) => {
          if (callback) callback(true)
          return BudgetActions.budgetSaved({budget: saved})
        },
        errorAC: errorHandler
      })
    }
  },
}
