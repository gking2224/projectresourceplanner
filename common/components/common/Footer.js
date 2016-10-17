import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Dialog from './Dialog.js'
let Footer = () => {

  return (
    <div id="footer-ctr">
      <Dialog />
    </div>
  )
}

let dispatchToProps = dispatch => ({
})
let stateToProps = state => ({
})

export { Footer }

export default connect()(Footer)
