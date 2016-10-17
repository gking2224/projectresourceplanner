import { ActionTypes } from '../constants'

const dialog = (
  state = {},
  //   visible: false,
  //   timeout: 0,
  //   modal: false,
  //   title: '',
  //   message: '',
  //   //type: 'ok', // 'yesno', 'okcancel'
  //   severity: 'normal', // 'warn', error',
  //   cancel: null,
  //   callback: null
  // },
  action) => {

  switch (action.type) {

    case ActionTypes.DIALOG_YES_NO:
      const newState = Object.assign({}, state, action.payload, {visible: true, type: 'yesno'})
      return newState

    case ActionTypes.DIALOG_OK_CANCEL:
      return Object.assign({}, state, action.payload, {visible: true, type: 'okcancel'})

    case ActionTypes.DIALOG_OK:
      return Object.assign({}, state, action.payload, {visible: true, type: 'ok'})

    case ActionTypes.CLEAR_DIALOG:
      return Object.assign({}, state, action.payload, {visible: false})


    default:
      return state
  }
}

export default dialog
