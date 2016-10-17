import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { GlobalActions } from '../../actions'

const Dialog = ({dialog, clear}) => {
  const {title, message, type, visible, callback, cancel} = dialog
  if (!visible) return null
  else return (
    <div id="dialog-ctr">
      <h2>{title}</h2>
      <p>{message}</p>
      {buttons(type, callback, cancel, clear)}
    </div>
  )
}

const buttons = (type, callback, cancel, clear) => {

  const okAction = () => {
    clear()
    callback()
  }
  const cancelAction = () => {
    clear()
    cancel()
  }
  return (
    <div>
      {okButton(type, okAction)}
      {cancelButton(type, cancelAction)}
    </div>
    )
}

const okButton = (type, onClick) => {

  return (
      <div>
        <button onClick={onClick}>Ok</button>
      </div>
    )
}

const cancelButton = (type, onClick) => {
  if (type === 'ok') return null
  else return (
    <div>
      <button onClick={onClick}>Cancel</button>
    </div>
  )
}

let dispatchToProps = dispatch => ({
  clear: () => dispatch(GlobalActions.clearDialog())
})
let stateToProps = state => ({
  dialog: state.global.dialog
})

export { Dialog }

export default connect(stateToProps, dispatchToProps)(Dialog)
