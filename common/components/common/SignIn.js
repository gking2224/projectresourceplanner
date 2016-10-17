import React, {  PropTypes } from 'react'
import { connect } from 'react-redux'
import { SecurityActions } from '../../actions'

const SignIn = React.createClass({

  setPassword(n) {
    this.password = n
  },

  setUsername(n) {
    this.username = n
  },

  render() {
    return (
      <div id="sign-in-form">
        <label>Username</label><input ref={n => this.setUsername(n)} type="text" />
        <label>Password</label><input ref={n => this.setPassword(n)} type="password" />
        <input
          type="button"
          value="Sign In"
          onClick={() => this.props.signIn(this.username.value, this.password.value)}
        />
        {this.props.displayMessage && <span>{this.props.displayMessage}</span>}
      </div>
    )
  }
})

const dispatchToProps = dispatch => ({
    signIn: (username, password) => dispatch(SecurityActions.signIn(username, password)),
})
const stateToProps = state => ({
  displayMessage: state.screens.signIn.displayMessage
})

export { SignIn }

export default connect(stateToProps, dispatchToProps)(SignIn)
