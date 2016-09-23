import { createAction } from 'redux-actions'

import { ActionTypes } from '../constants'

const MenuActions = {

  signOut: () => createAction(ActionTypes.SIGN_OUT)(),

  signIn: () => {
    const action = createAction(ActionTypes.SIGN_IN)({
      user: {
        id: 'gking',
        firstName: 'Graham',
        surname: 'King',
        roles: ['user'],
      },
      permissions: [
        'project.view.summary', 'project.view.detail', 'project.add', 'project.delete',
        'budget.delete', 'budget.edit', 'budget.view.detail',
      ],
    })
    return action
  },
}

export default MenuActions
