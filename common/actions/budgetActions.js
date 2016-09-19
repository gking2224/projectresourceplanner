import { createAction } from 'redux-actions'

import * as ActionType from '../constants/actionTypes'
import { GlobalActions } from '.'
import { BudgetAPI } from '../api'
import { Utils } from '../utils'

const errorHandler = (err) => GlobalActions.error(err)

export const BudgetActions = {
  budgetDeleted: createAction(ActionType.BUDGET_DELETED),
  // budgetUpdated: createAction(ActionType.BUDGET_UPDATED),
  budgetSaved: createAction(ActionType.BUDGET_SAVED),
  budgetsLoaded: createAction(ActionType.BUDGETS_LOADED),
  viewResourceSummary: createAction(ActionType.VIEW_RESOURCE_SUMMARY),

  loadResourceSummary:({resourceId}) => {
    const msg = "loadResourceSummary " + resourceId
    return (dispatch) => {

      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => BudgetAPI.getBudgetsReferencingResource({resourceId: resourceId}),
        successAC: ({budgets, projects}) => {
          return BudgetActions.viewResourceSummary({resourceId, budgets, projects})
        },
        errorAC: errorHandler
      })
    }
  },

  // newBudget:(projectId, year) => {
  //   const msg = "newBudget " + projectId
  //   return (dispatch) => {
  //
  //     Utils.doRemoteAction(dispatch)({
  //       msg,
  //       remoteAction: () => ProjectAPI.loadProjects({_id: projectId}),
  //       successAC: (projects) => createAction(ActionType.NEW_BUDGET)({
  //         project: projects[0],
  //         year
  //       }),
  //       errorAC: errorHandler(dispatch)
  //     })
  //   }
  // },

  loadBudget: (budgetId) => {
    const msg = "loadBudget." + budgetId
    return BudgetActions.loadBudgets(msg, {_id: budgetId}, {forEdit: true})
  },

  loadProjectBudgets:(projectId) => {
    const msg = "loadProjectBudgets." + projectId
    return BudgetActions.loadBudgets(msg, {project: projectId}, {projectId})
  },

  loadBudgets: (msg, criteria = {}, payload = {}) => {
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => BudgetAPI.getBudgets(criteria),
        successAC: (budgets) => BudgetActions.budgetsLoaded(Object.assign(payload, {budgets})),
        errorAC: errorHandler
      })
    }
  },

  setDefault:({budgetId, isDefault}) => {
    const msg = "Set default " + budgetId + " " + isDefault
    return (dispatch) => {

      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => BudgetAPI.setDefault({budgetId: budgetId, isDefault: isDefault}),
        successAC: () => createAction(ActionType.BUDGET_DEFAULT_SET)({budgetId, isDefault}),
        errorAC: errorHandler
      })
    }
  },
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
  deleteBudget:({budget}) => {
    const msg = "Deleting budget " + budget._id
    return (dispatch) => {
      const title = 'Confirm'
      const callback = () => {

        Utils.doRemoteAction(dispatch)({
          msg,
          remoteAction: ()=> BudgetAPI.deleteBudget(budget._id),
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
  // editBudget:() => {
  //   return {
  //     type: ActionType.EDIT_BUDGET
  //   }
  // },
  //
  // addBudgetRole:() => {
  //   return {
  //     type: ActionType.ADD_BUDGET_ROLE
  //   }
  // },

  saveBudget:(budget, callback) => {
    const msg = "Saving budget"
    return (dispatch) => {

      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: ()=> BudgetAPI.saveBudget(budget),
        successAC: (saved) => {
          if (callback) callback(true)
          return BudgetActions.budgetSaved({budget: saved})
        },
        errorAC: errorHandler
      })
    }
    return {type: ActionType.SAVE_ACTIVE_BUDGET}
  }
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
