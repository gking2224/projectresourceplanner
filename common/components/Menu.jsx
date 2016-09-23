import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { MenuActions } from '../actions'
import { ClickableText } from './widgets'


const renderSignIn = (signIn) => {

  return (
    <ClickableText id={'sign-in'} action="signIn" onClick={signIn}>Sign in</ClickableText>
  )
}

const renderSignOut = (sessionInfo, signOut) => {
  return (
    <div id={'sign-out'}>
      <span>Logged in as {sessionInfo.loggedOnUser.firstName} {sessionInfo.loggedOnUser.surname}</span>
      <ClickableText action="signOut" onClick={signOut}>Sign out</ClickableText>
    </div>
  )
}
const sessionControls = (sessionInfo, signIn, signOut) => {

  return (
    <div id={'session-controls'}>
      {(!sessionInfo.loggedOnUser) && renderSignIn(signIn)}
      {(sessionInfo.loggedOnUser) && renderSignOut(sessionInfo, signOut)}
    </div>
  )
}

const Menu = React.createClass({

  getInitialState: function() {
    const sessionInfoAndUnsubscribe = this.context.getSessionInfo(this.sessionInfoUpdated)
    return {
      sessionInfo: sessionInfoAndUnsubscribe[0],
      unsubscribe: sessionInfoAndUnsubscribe[1],
    }
  },

  componentWillUnmount: function() {
    this.state.unsubscribe()
  },

  sessionInfoUpdated: function(sessionInfo) {
    this.setState({sessionInfo})
  },

  render: function() {
    const { menu, signIn, signOut } = this.props
    const { sessionInfo } = this.state

    return (
      <div id="menu-bar">
        <ul id="menu-items">
          {menu.items.map((item, idx) =>
            <Link activeClassName={'active'} key={`menu${idx}`} to={`/${item.toLowerCase()}`}>{item}</Link>
          )}
        </ul>
        {sessionControls(sessionInfo, signIn, signOut)}
      </div>
    )
  },

})

const dispatchToProps = dispatch => ({
  signOut: () => dispatch(MenuActions.signOut()),
  signIn: () => dispatch(MenuActions.signIn()),
})

const stateToProps = state => ({
  menu: state.menu,
})

Menu.contextTypes = {
  getSessionInfo: PropTypes.func.isRequired,
}

Menu.propTypes = {
  menu: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  signIn: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
}

export { Menu }

export default connect(stateToProps, dispatchToProps)(Menu)
