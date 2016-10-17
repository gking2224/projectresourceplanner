import { ActionTypes } from '../constants'
import update from 'react-addons-update'
import { BudgetUtils, ReducerUtils } from '../utils'

const Budgets = (state = {}, action) => {

  switch (action.type) {
  case ActionTypes.BUDGETS_LOADED:
    return ReducerUtils.addEntity(state, action.payload.budgets || action.payload.budget)

  case ActionTypes.BUDGET_DELETED:
    return update(state, {[action.payload.budgetId]: {$set: undefined}})

  case ActionTypes.BUDGET_SAVED:
    return ReducerUtils.addEntity(state, action.payload.budget)

  case ActionTypes.VIEW_RESOURCE_SUMMARY:
    return ReducerUtils.addEntity(state, action.payload.budgets)
  default:
    return state
  }
}

export default Budgets
