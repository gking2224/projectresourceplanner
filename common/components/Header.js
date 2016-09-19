import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Menu from './Menu'

let Header = ({remoteActions}) => {

  return (
    <div id="header-ctr">
      {serverActivity(remoteActions)}
      <Menu />
    </div>
  )
}

let dispatchToProps = dispatch => ({
})
let stateToProps = state => ({
  remoteActions: state.global.remoteActions
})

const serverActivity = (remoteActions) => {
  if (remoteActions.length > 0) {
    return (
      <div style={{float:'right'}}>Loading...</div>
    )
  }
}
export { Header } // for unit testing

export default connect(stateToProps, dispatchToProps)(Header)
