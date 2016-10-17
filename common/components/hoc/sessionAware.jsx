import React, { PropTypes } from 'react'
import { Utils, SecurityUtils } from '../../utils'

const sessionAware = (Component) => {

  const SessionAware = React.createClass({


    contextTypes: {
      getSessionInfo: PropTypes.func,
    },

    getInitialState() {
      const sessionInfoAndUnsubscribe = this.context.getSessionInfo(this.sessionInfoUpdated)
      return {
        sessionInfo: sessionInfoAndUnsubscribe[0],
        unsubscribe: sessionInfoAndUnsubscribe[1],
      }
    },

    componentWillUnmount() {
      this.state.unsubscribe()
    },

    setWrapped(node) {
      this.wrapped = node
    },

    getSessionInfo() {
      return this.state.sessionInfo
    },

    sessionInfoUpdated(sessionInfo) {

      const previouslySignedIn = this.isUserSignedIn()

      const {userSignedIn = () => null, userSignedOut = () => null} = this.wrapped

      this.setState({sessionInfo}, () => {
        const signedIn = this.isUserSignedIn()
        if (!previouslySignedIn && signedIn) userSignedIn()
        else if (previouslySignedIn && !signedIn) userSignedOut()
      })
    },

    withSession(func) {
      if (this.isUserSignedIn()) func(this.state.sessionInfo)
    },

    isUserSignedIn() {
      return SecurityUtils.isSignedIn(this.state.sessionInfo)
    },

    isPermissioned(perm) {
      return Utils.hasPermission(this.state.sessionInfo, perm)
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
  return SessionAware

}

export default sessionAware
