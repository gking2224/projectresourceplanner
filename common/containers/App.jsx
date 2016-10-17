import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import cookie from 'react-cookie'

import { getEnvConfig, RefData } from '../utils'
import { Header, SignIn, Footer, Dialog } from '../components/common'
import { SecurityActions } from '../actions'

function mapStateToProps(state) {
  return {
    activeItem: state.menu.activeItem,
    staticRefData: state.staticRefData,
    sessionInfo: state.sessionInfo,
    displaySignInForm: state.screens.signIn.displaySignInForm
  }
}

function mapDispatchToProps(dispatch) {
  return {
    validateToken: token => dispatch(SecurityActions.validate(token))
  }
}

class App extends Component {

  constructor(props) {
    super(props)
    this.listenerId = 0
    this.listeners = []
    const c = cookie.load('token')
    this.state = { tokenCookie: c }
  }

  getChildContext() {
    return {
      staticRefData: this.props.staticRefData,
      RefData: RefData(this.props.staticRefData),
      // addSessionInfoListener: listener => this.addSessionInfoListener(listener),
      getSessionInfo: (listener) => {
        return (listener) ?
          [this.props.sessionInfo, this.addSessionInfoListener(listener)] :
          this.props.sessionInfo
      },
    }
  }

  componentDidMount() {
    if (this.state.tokenCookie && !this.props.sessionInfo.loggedOnUser) {
      this.props.validateToken(this.state.tokenCookie)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.tokenCookie && nextProps.sessionInfo && nextProps.sessionInfo.securityToken) {
      const token = nextProps.sessionInfo.securityToken
      this.setState({tokenCookie: token}, cookie.save('token', nextProps.sessionInfo.securityToken, { path: '/' }))
    }
    if (this.state.tokenCookie && !nextProps.sessionInfo.loggedOnUser) {
      this.setState({tokenCookie: null}, () => cookie.save('token', null, { path: '/' }))
    }
    this.listeners.filter(s => s !== null).forEach(s =>
      s.listener(nextProps.sessionInfo))
  }

  addSessionInfoListener(listener) {
    const id = this.listenerId++
    this.listeners.push({id, listener})
    // listener(this.props.sessionInfo)
    return this.unsubscribeFunc(id)
  }

  unsubscribeFunc(id) {
    return () => {
      const idx = this.listeners.findIndex(l => l.id === id)
      this.listeners.splice(idx, 1)
    }
  }

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
  }

  renderChildren() {
    const { children } = this.props
    return (
      <div>
        {children}
      </div>
    )
  }
}

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
  getSessionInfo: PropTypes.func,
  RefData: PropTypes.object,
  addSessionInfoListener: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
