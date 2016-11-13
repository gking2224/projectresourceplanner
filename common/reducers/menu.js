/* @flow */
import * as ActionTypes from '../constants/actionTypes'

const menu = (
  state = {
    activeItem: null,
    items: ['Projects']
  },
  action : number
) => {
  const a : string = 3

  switch (action.type) {

  case ActionTypes.MENU_SELECTED:
    return Object.assign({}, state, {activeItem: action.payload})

  case ActionTypes.BUDGETS_LOADED:
    return Object.assign({}, state, {activeItem: 'Budgets'})

  default:
    return state
  }
}

export default menu
