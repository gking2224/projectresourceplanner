import * as ActionType from '../constants/actionTypes'

export function menuItemClicked(i) {
  return {
    type: ActionType.MENU_SELECTED,
    payload: i
  }
}

export function signOut() {
  return {
    type: ActionType.SIGN_OUT
  }
}

export function signIn() { // dummy behaviour for now
  return {
    type: ActionType.SIGN_IN,
    user: {
      id: 'gking',
      firstName: 'Graham',
      surname: 'King',
      roles: ['user']
    },
    permissions: [
      'project.view.summary', 'project.view.detail', 'project.add', 'project.delete', 'budget.delete', 'budget.edit', 'budget.view.detail'
    ]
  }
}
