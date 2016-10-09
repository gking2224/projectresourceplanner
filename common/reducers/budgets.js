import { ActionTypes } from '../constants'
import update from 'react-addons-update'
import { BudgetUtils, ReducerUtils } from '../utils'


const Budgets = (
    state = {},
    action) => {

  let newState

  switch (action.type) {

    case ActionTypes.BUDGETS_LOADED:

      return ReducerUtils.addEntity(state, action.payload.budgets || action.payload.budget)

      // newState = replaceOrAddBudgets(state, action.payload.budgets)
      // if (action.payload.forEdit && action.payload.budgets.length === 1) {
      //   newState = update(newState, {
      //     activeBudgetId: {$set: action.payload.budgets[0]._id},
      //     activeProjectId: {$set: action.payload.budgets[0].project}
      //   })
      // }
      // return newState

    // case ActionTypes.PROJECTS_LOADED:
    //   return update(state, {
    //     activeProjectId: {$set: action.payload.projectId},
    //     activeBudgetId: {$set: null},
    //     budgetList: {$set: (action.payload.projects.length > 1) ? undefined : state.budgetList}
    //   })

    case ActionTypes.BUDGET_DELETED:
      return update(state, {[action.payload.budgetId]: {$set: undefined}})

    case ActionTypes.BUDGET_SAVED:
      return ReducerUtils.addEntity(state, action.payload.budget)
      // newState = replaceOrAddBudget(state, action.payload.budget)
      // return Object.assign(newState, {activeBudgetId: action.payload.budget._id})

    case ActionTypes.VIEW_RESOURCE_SUMMARY:
      return ReducerUtils.addEntity(state, action.payload.budgets)
      // return update(state, {resourceSummary: {$set: {
      //   budgetList: action.payload.budgets,
      //   resourceId: action.payload.resourceId
      // }}})
    default:
      return state
  }
}

const deleteBudget = (state, budgetId) => {
  const idx = state.budgetList.findIndex(b => b._id === budgetId)
  if (idx === -1) return state
  else return update(state, {budgetList: {$splice: [[idx, 1]]}})
}

const replaceOrAddBudget = (state, budget) => {
  if (!state.budgetList) return update(state, {budgetList: {$set: [budget]}})
  const idx = state.budgetList.findIndex(b => b._id === budget._id)
  if (idx === -1) return update(state, {budgetList: {$push: [budget]}})
  else return update(state, {budgetList: {$splice: [[idx, 1, budget]]}})
}

const replaceOrAddBudgets = (state, budgets) => {
  let newState = state
  budgets.forEach( b => {
    newState = replaceOrAddBudget(newState, b)
  })
  return newState
}

export default Budgets
