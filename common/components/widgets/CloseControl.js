import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import pd from 'react-prevent-default'
import keycode from 'keycode'
import classNames from 'classnames'
import mouse from 'mouse-event'


const CloseControl = React.createClass({

  shouldComponentUpdate: function() {
    return true
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
    })
  },

  render: function() {
    const { hide, onClose } = this.props
    return (
      <span className={'close-control'}>
        {(!hide) ? <a href='#' onClick={onClose}>x</a> : <span>&nbsp;</span>}
      </span>
    )
  }


})
export default CloseControl
