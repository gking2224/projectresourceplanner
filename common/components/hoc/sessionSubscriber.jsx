import React, { PropTypes } from 'react'

const sessionSubscriber = (Component) => {

  const SessionSubscriber = React.createClass({

    contextTypes: {
      getSessionInfo: PropTypes.func,
      withSession: PropTypes.func,
      isUserSignedIn: PropTypes.func,
      isPermissioned: PropTypes.func,
    },

    getInitialState() {
      const sessionInfoAndUnsubscribe = this.context.getSessionInfo(this.sessionInfoUpdated)
      return {
        sessionInfo: sessionInfoAndUnsubscribe[0],
        unsubscribeSessionInfo: sessionInfoAndUnsubscribe[1],
        userSignedIn: this.context.isUserSignedIn()
      }
    },

    componentWillUnmount() {
      const { unsubscribeSessionInfo } = this.state

      unsubscribeSessionInfo()
    },

    setWrapped(node) {
      this.wrapped = node
    },

    getSessionInfo() {
      return this.state.sessionInfo
    },

    sessionInfoUpdated(sessionInfo) {

      const { isUserSignedIn } = this.context
      const { userSignedIn: previouslySignedIn } = this.state

      // functions on the wrapped component
      const {userSignedIn = () => null, userSignedOut = () => null} = this.wrapped

      this.setState({sessionInfo, userSignedIn: isUserSignedIn()}, () => {
        const nowSignedIn = this.state.userSignedIn
        if (!previouslySignedIn && nowSignedIn) userSignedIn(sessionInfo)
        else if (previouslySignedIn && !nowSignedIn) userSignedOut()
      })
    },

    render() {
      return (
        <Component
          {...this.props}
          {...this.state}
          ref={n => this.setWrapped(n)}
          getSessionInfo={this.getSessionInfo}
          withSession={this.context.withSession}
          isUserSignedIn={this.context.isUserSignedIn}
          isPermissioned={this.context.isPermissioned}
        />
      )
    }

  })
  return SessionSubscriber

}

export default sessionSubscriber
