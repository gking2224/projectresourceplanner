import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import { Utils, SecurityUtils } from '../../utils'

function mapStateToProps(state) {
  return { sessionInfo: state.sessionInfo }
}

/**
 * Watches changes to sessionInfo in the state.
 * Provides updates to subscribers
 * @param Component
 * @returns {*}
 */
const sessionListening = (Component) => {

  const SessionListening = React.createClass({

    getInitialState() {
      this.listenerId = 0
      this.listeners = []
      return {}
    },

    getChildContext() {
      return {
        isUserSignedIn: this.isUserSignedIn,
        isPermissioned: this.isPermissioned,
        withSession: this.withSession,
        getSessionInfo: (listener) => {
          return (listener) ?
            [this.props.sessionInfo, this.addSessionInfoListener(listener)] :
            this.props.sessionInfo
        }
      }
    },

    setWrapped(node) {
      this.wrapped = node
    },

    getSessionInfo() {
      return this.props.sessionInfo
    },

    componentWillReceiveProps(nextProps) {
      const { sessionInfo } = nextProps
      const { securityToken: newToken } = sessionInfo
      const { sessionInfo: currentSessionInfo } = this.props
      const { securityToken: currentToken } = currentSessionInfo

      if ((!currentToken && newToken) || (currentToken && !newToken)) {
        if (newToken) this.notifySignedIn(sessionInfo)
        else this.notifySignedOut()
        this.notifyListeners(sessionInfo)
      }
    },

    addSessionInfoListener(listener) {
      const id = this.listenerId + 1
      this.listenerId = id
      this.listeners.push({id, listener})
      return this.unsubscribeFunc(id)
    },

    unsubscribeFunc(id) {
      return () => {
        const idx = this.listeners.findIndex(l => l.id === id)
        this.listeners.splice(idx, 1)
      }
    },

    notifyListeners(sessionInfo) {

      this.listeners.filter(s => s !== null).forEach(s =>
        s.listener(sessionInfo))
    },

    withSession(func) {
      const { sessionInfo } = this.props
      if (this.isUserSignedIn()) func(sessionInfo)
    },

    isUserSignedIn() {
      const { sessionInfo } = this.props
      return SecurityUtils.isSignedIn(sessionInfo)
    },

    isPermissioned(perm) {
      const { sessionInfo } = this.props
      return Utils.hasPermission(sessionInfo, perm)
    },

    notifySignedIn(sessionInfo) {
      const { userSignedIn } = this.wrapped
      if (userSignedIn && typeof userSignedIn === 'function') userSignedIn(sessionInfo)
    },

    notifySignedOut() {
      const { userSignedOut } = this.wrapped
      if (userSignedOut && typeof userSignedOut === 'function') userSignedOut()
    },

    render() {
      return (<Component
        {...this.props}
        {...this.state}
        ref={n => this.setWrapped(n)}
        getSessionInfo={this.getSessionInfo}
        withSession={this.withSession}
        isUserSignedIn={this.isUserSignedIn}
        isPermissioned={this.isPermissioned}
      />)
    }
  })

  SessionListening.childContextTypes = {
    getSessionInfo: PropTypes.func,
    isUserSignedIn: PropTypes.func,
    isPermissioned: PropTypes.func,
    withSession: PropTypes.func
  }
  return connect(mapStateToProps)(SessionListening)

}

export default sessionListening
