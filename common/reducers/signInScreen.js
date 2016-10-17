import { ActionTypes } from '../constants'
import update from 'react-addons-update'
import { BudgetUtils } from '../utils'

const DEFAULT_STATE = {displaySignInForm: false}

const signInScreen = (state = DEFAULT_STATE, action) => {

  switch (action.type) {
    case ActionTypes.SIGN_IN_REQUIRED:
      return update(state, {displaySignInForm: {$set: true}, displayMessage: {$set: action.payload.errorMessage}})
    case ActionTypes.DISPLAY_SIGN_IN:
    return update(state, {displaySignInForm: {$set: true}})
  case ActionTypes.AUTHENTICATED:
    return update(state, {
      displaySignInForm: {$set: false},
      displayMessage: {$set: null}}
    )

  default:
    return state
  }
}

export default signInScreen
