import { ActionTypes } from '../constants'
import update from 'react-addons-update'
import { BudgetUtils } from '../utils'

const DEFAULT_STATE = null

const budgetWip = (state = DEFAULT_STATE, action) => {

  switch (action.type) {

  case ActionTypes.NEW_BUDGET:
    return BudgetUtils.createNewBudget(action.payload.project._id, action.payload.year)

  case ActionTypes.BUDGETS_LOADED:
    return (action.payload.forEdit) ? action.payload.budget : DEFAULT_STATE

  case ActionTypes.BUDGET_UPDATED:
    return action.payload.budget

  case ActionTypes.BUDGET_SAVED:
    return DEFAULT_STATE

  default:
    return state
  }
}

export default budgetWip
