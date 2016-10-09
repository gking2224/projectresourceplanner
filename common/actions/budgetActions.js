import { createAction } from 'redux-actions'

import { ActionTypes } from '../constants'
import { GlobalActions } from '.'
import { BudgetAPI } from '../api'
import { ProjectApi } from '../api'
import { Utils } from '../utils'

const errorHandler = (err) => GlobalActions.error(err)

export const BudgetActions = {
  budgetDeleted: createAction(ActionTypes.BUDGET_DELETED),
  updateBudget: createAction(ActionTypes.BUDGET_UPDATED),
  budgetSaved: createAction(ActionTypes.BUDGET_SAVED),
  budgetsLoaded: createAction(ActionTypes.BUDGETS_LOADED),
  viewResourceSummary: createAction(ActionTypes.VIEW_RESOURCE_SUMMARY),

  loadResourceSummary: (resourceId, xhr) => {
    const msg = "loadResourceSummary " + resourceId
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => BudgetAPI.getBudgetsReferencingResource(resourceId, xhr),
        successAC: (budgets) => {
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

  createNewBudget: (projectId, year, xhr) => {
    const msg = "newBudget " + projectId
    return (dispatch) => {

      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => ProjectApi.loadProject(projectId, xhr),
        successAC: (project) => createAction(ActionTypes.NEW_BUDGET)({project, year}),
        errorAC: errorHandler
      })
    }
  },

  loadBudget: (budgetId, xhr) => {
    const msg = "loadBudget." + budgetId
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => BudgetAPI.getBudget(budgetId, xhr),
        successAC: (budget) => BudgetActions.budgetsLoaded({budget, forView: true}),
        errorAC: errorHandler,
      })
    }
  },

  loadProjectBudgets:(projectId) => {
    const msg = "loadProjectBudgets." + projectId
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => BudgetAPI.getProjectBudgets(projectId),
        successAC: (budgets) => BudgetActions.budgetsLoaded({budgets}),
        errorAC: errorHandler
      })
    }
  },

  // loadBudgets: (msg, criteria = {}, payload = {}) => {
  // },

  // setDefault:({budgetId, isDefault}) => {
  //   const msg = "Set default " + budgetId + " " + isDefault
  //   return (dispatch) => {
  //
  //     Utils.doRemoteAction(dispatch)({
  //       msg,
  //       remoteAction: () => BudgetAPI.setDefault({budgetId: budgetId, isDefault: isDefault}),
  //       successAC: () => createAction(ActionType.BUDGET_DEFAULT_SET)({budgetId, isDefault}),
  //       errorAC: errorHandler
  //     })
  //   }
  // },
  // viewBudget:({budgetId}) => {
  //   const msg = "View budget " + budgetId
  //   return (dispatch) => {
  //
  //     Utils.doRemoteAction(dispatch)({
  //       msg,
  //       remoteAction: () => BudgetAPI.getBudgets({_id: budgetId}),
  //       successAC: (budgets) => createAction(ActionType.VIEW_BUDGET)({budget: budgets[0]}),
  //       errorAC: (err) => dispatch(GlobalActions.error(err))
  //     })
  //   }
  // },
  deleteBudget:({budget, xhr}) => {
    const msg = "Deleting budget " + budget._id
    return (dispatch) => {
      const title = 'Confirm'
      const callback = () => {

        Utils.doRemoteAction(dispatch)({
          msg,
          remoteAction: ()=> BudgetAPI.deleteBudget(budget._id, xhr),
          successAC: ()=> BudgetActions.budgetDeleted({budgetId: budget._id}),
          errorAC: errorHandler
        })
      }
      const cancel = () => null
      const dialog = {
        callback, cancel, title,
        message: `Delete budget ${budget.name}?`
      }

      dispatch(GlobalActions.displayDialogYesNo(dialog))
    }
  },

  editBudget: (budgetId) => {
    const msg = "Editing budget " + budgetId
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => BudgetAPI.getBudget(budgetId),
        successAC: (budget) => BudgetActions.budgetsLoaded({budget, forEdit: true}),
        errorAC: errorHandler
      })
    }
  },

  //
  // addBudgetRole:() => {
  //   return {
  //     type: ActionType.ADD_BUDGET_ROLE
  //   }
  // },

  saveBudget:(budget, callback, xhr) => {
    const msg = "Saving budget"
    return (dispatch) => {

      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: ()=> BudgetAPI.saveBudget(budget, xhr),
        successAC: (saved) => {
          if (callback) callback(true)
          return BudgetActions.budgetSaved({budget: saved})
        },
        errorAC: errorHandler
      })
    }
    return {type: ActionTypes.SAVE_ACTIVE_BUDGET}
  },
  //
  // cancelBudgetUpdate:createAction(ActionType.CANCEL_BUDGET_UPDATE),

  // const backToSummary({projectId}) {
  //   const msg = "Budget summary "+projectId
  //   return (dispatch) => {
  //
  //     doRemoteAction(dispatch)({
  //       msg,
  //       remoteAction: () => BudgetApi.getBudgets({_id: budgetId}),
  //       successAC: (budgets) => createAction(ActionType.VIEW_BUDGET)({budget: budgets[0]}),
  //       errorAC: (err) => dispatch(GlobalActions.error(err))
  //     })
  //   }
  // },
  //
  // updateFte:(roleIdx, month, newValue) => {
  //   return {
  //     type: ActionType.FTE_UPDATED,
  //     payload: {
  //       roleIdx, month, newValue
  //     }
  //   }
  // }
}
