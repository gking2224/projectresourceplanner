import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import pd from 'react-prevent-default'
import ContextMenu from './ContextMenu'

const ContextMenuWrapper = React.createClass({

  statics: {

  },

  getDefaultProps: function() {
    return {
      displayDelay: 1100,
      hideDelay: 1000,
      displayOnEmpty: false
    }
  },

  getInitialState: function() {
    return {
      displayed: false,
      menumouseover: false,
      mouseover: false,
      windowClickListener: () => this.hideMenu(true)
    }
  },

  shouldComponentUpdate: function() {
    return true
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
    })
  },

  componentDidMount: function() {
    window.addEventListener('click', this.state.windowClickListener)
  },

  componentWillUnmount: function() {
    if (this.state.hideTimeout) clearTimeout(this.state.hideTimeout)
    if (this.state.displayTimeout) clearTimeout(this.state.displayTimeout)
    window.removeEventListener(('click'), this.state.windowClickListener)
    this.setState({
      windowClickListener: undefined
    })
  },

  getValue: function() {
    const childrenWithValue = this.getChildren().filter(c => c.getValue)
    let rv
    switch (childrenWithValue.length) {
      case 0:
        rv = null
        break;
      case 1:
        rv = childrenWithValue[0].getValue()
        break;
      default:
        rv = childrenWithValue.map(c => c.getValue())
    }
    return rv
  },

  render: function() {
    const { x, y, displayed } = this.state
    const { children, items, callbacks } = this.props
    const cchildren = React.Children.map(children, (c, idx) => React.cloneElement(c, {ref: 'child'+(idx)}))
    return (
      <div className={'context-menu-wrapper'}
          onMouseOut={this.onMouseOutHandler}
          onMouseOver={this.onMouseOverHandler}>
        {cchildren}

        {(displayed) ?
          <ContextMenu
            onMouseOver={this.menuMouseOver} onMouseOut={this.menuMouseOut}
                       pos={{x: x, y: y}} items={items} getValue={this.getValue}
                       closeContextMenu={pd(this.hideMenu.bind(this, true))}/> :
          null}
      </div>
    )
  },

  displayMenu: function() {
    if (!this.state.displayed && (this.state.menumouseover || this.state.mouseover)) {

      let suppress = this.getChildren().filter(c => c.suppressContext).reduce(
        (b, c) => b || c.suppressContext(), false)
      if (!this.props.displayOnEmpty)
        suppress = this.getChildren().filter(c => c.getValue).reduce(
          (b, c) => b || !c.getValue(), suppress)
      this.setState({
        displayTimeout: undefined,
        displayed: !suppress
      })
    }
  },

  hideMenu: function(force = false) {
    if (this.state.displayed && (force || (!this.state.menumouseover && !this.state.mouseover))) {
      this.setState({
        hideTimeout: undefined,
        displayed: false
      })
    }
  },

  onMouseOverHandler: function(e) {
    this.setState({mouseover: true})

    if (!this.state.displayed) {
      this.setDisplayTimeout()
      this.setState({
        x: e.clientX,
        y: e.clientY
      })
    }
  },

  menuMouseOver: function() {
    this.setState({menumouseover: true})
  },

  menuMouseOut: function() {
    this.setState({menumouseover: false})
    this.setHideTimeout()
  },

  onMouseOutHandler: function() {
    this.setState({mouseover: false})
    this.setHideTimeout()
  },

  setHideTimeout: function(func, delay) {
    if (this.state.hideTimeout) clearTimeout(this.state.hideTimeout)
    this.setState({hideTimeout: setTimeout(this.hideMenu, this.props.hideDelay)})
  },

  setDisplayTimeout: function() {
    if (this.state.displayTimeout) clearTimeout(this.state.displayTimeout)
    this.setState({displayTimeout: setTimeout(this.displayMenu, this.props.displayDelay)})
  },

  getChildren: function() {
    return Object.keys(this.refs).map(r => this.refs[r])
  }

})
export default ContextMenuWrapper
