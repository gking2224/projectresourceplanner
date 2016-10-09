import { ActionTypes } from '../constants'
import update from 'react-addons-update'
import { BudgetUtils } from '../utils'

const DEFAULT_STATE = {activeBudgetId: null, resourceId: null}

const budgetScreen = (state = DEFAULT_STATE, action) => {

  switch (action.type) {
  case ActionTypes.BUDGETS_LOADED:
    return (action.payload.forView) ? Object.assign(state, {activeBudgetId: action.payload.budget._id}) : state
  case ActionTypes.BUDGET_SAVED:
    return Object.assign(state, {activeBudgetId: action.payload.budget._id})
  case ActionTypes.VIEW_RESOURCE_SUMMARY:
    return Object.assign(state, {resourceId: action.payload.resourceId})

  default:
    return state
  }
}

export default budgetScreen
