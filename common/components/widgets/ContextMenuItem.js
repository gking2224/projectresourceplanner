import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import pd from 'react-prevent-default'
import keycode from 'keycode'
import classNames from 'classnames'
import mouse from 'mouse-event'

const ContextMenuItem = React.createClass({

  getDefaultProps: function() {
  },

  getInitialState: function() {
    return {
    }
  },

  shouldComponentUpdate: function() {
    return true
  },

  componentWillReceiveProps: function(nextProps) {
  },

  render: function() {
    const { label, callback } = this.props
    return (
      <li onClick={() => callback(this.props.getValue())}>{label}</li>
    )
  },

})
export default ContextMenuItem
