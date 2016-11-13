import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import cookie from 'react-cookie'

import { RefData } from '../utils'
import { Header, SignIn, Footer } from '../components/common'
import { sessionListening } from '../components/hoc'
import { SecurityActions, StaticDataActions } from '../actions'

const TOKEN_COOKIE_NAME = '__securityToken'

function mapStateToProps(state) {
  return {
    activeItem: state.menu.activeItem,
    staticRefData: state.staticRefData,
    displaySignInForm: state.screens.signIn.displaySignInForm
  }
}

function mapDispatchToProps(dispatch) {
  return {
    validateToken: token => dispatch(SecurityActions.validate(token)),
    loadRefData: s => dispatch(StaticDataActions.seedRefData(s))
  }
}

const App = React.createClass({
  getInitialState() {
    const c = cookie.load(TOKEN_COOKIE_NAME)
    return {
      tokenCookie: c
    }
  },

  getChildContext() {
    return {
      staticRefData: this.props.staticRefData,
      RefData: RefData(this.props.staticRefData)
    }
  },

  componentDidMount() {
    if (this.state.tokenCookie) {
      this.props.validateToken(this.state.tokenCookie)
    }
  },

  userSignedIn(sessionInfo) {
    cookie.save(TOKEN_COOKIE_NAME, sessionInfo.securityToken, { path: '/' })
    this.loadRefData(sessionInfo)
  },

  userSignedOut() {
    cookie.save(TOKEN_COOKIE_NAME, null, { path: '/' })
  },

  loadRefData(sessionInfo) {
    const { loadRefData } = this.props
    loadRefData(sessionInfo)
  },

  render() {
    const { displaySignInForm } = this.props

    return (
      <div>
        <Header />
        {(displaySignInForm) && <SignIn />}
        {(!displaySignInForm) && this.renderChildren()}
        <Footer />
      </div>
    )
  },

  renderChildren() {
    const { children } = this.props
    return (
      <div>
        {children}
      </div>
    )
  }
})

App.propTypes = {
  sessionInfo: PropTypes.shape({
    loggedOnUser: PropTypes.shape({
      userId: PropTypes.number,
      username: PropTypes.string,
      firstName: PropTypes.string,
      surname: PropTypes.string
    }),
    permissions: PropTypes.arrayOf(PropTypes.string),
    roles: PropTypes.arrayOf(PropTypes.string)
  })
}

App.childContextTypes = {
  staticRefData: PropTypes.object,
  RefData: PropTypes.object
}

export { App }

export default connect(mapStateToProps, mapDispatchToProps)(
  sessionListening(App)
)
