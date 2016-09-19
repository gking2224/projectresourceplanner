import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as menuActions from '../actions/menuActions'

let Menu = ({menu, menuItemClicked, signIn, signOut, sessionInfo}) => {

  const { activeItem, items } = menu
  return (
    <div id="menu">
      <ul>
        {items.map((item, idx) =>
          <Link key={'menu'+idx} to={'/'+item.toLowerCase()}>{item}</Link>
        )}
      </ul>
      {sessionControls(sessionInfo, signIn, signOut)}
    </div>
  )
}

const sessionControls = (sessionInfo, signIn, signOut) => {
  if (sessionInfo.loggedOnUser) {
    return (
      <div>
        <span>Logged in as {sessionInfo.loggedOnUser.firstName} {sessionInfo.loggedOnUser.surname}</span>
        <a href="#" onClick={e => signOut(e)}>Sign out</a>
      </div>
    )
  }
  else {
    return (<a href="#" onClick={e => signIn(e)}>Sign in</a>)
  }
}

let dispatchToProps = dispatch => ({
  menuItemClicked: (i) => dispatch(menuActions.menuItemClicked(i)),
  signOut: (e) => {e.preventDefault(); dispatch(menuActions.signOut())},
  signIn: (e) => {e.preventDefault(); dispatch(menuActions.signIn())}
})
let stateToProps = state => ({
  menu: state.menu,
  sessionInfo: state.sessionInfo
})

export { Menu }

export default connect(stateToProps, dispatchToProps)(Menu)
