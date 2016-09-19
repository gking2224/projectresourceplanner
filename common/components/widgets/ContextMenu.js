import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import pd from 'react-prevent-default'
import keycode from 'keycode'
import classNames from 'classnames'
import mouse from 'mouse-event'

import ContextMenuItem from './ContextMenuItem'
import CloseControl from './CloseControl'
import './ContextMenu.scss'

const ContextMenu = React.createClass({

  getDefaultProps: function() {
  },

  getInitialState: function() {
    return {
      displayCloseControl: true
    }
  },

  shouldComponentUpdate: function() {
    return true
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
    })
  },

  render: function() {
    const { items, callbacks, label, closeContextMenu, pos, onMouseOver, onMouseOut } = this.props
    const style = {
      left: (pos.x-10)+'px',
      top: (pos.y-10)+'px',
    }
    return (
      <div onMouseOver={onMouseOver} onMouseOut={onMouseOut} style={style} className={'context-menu'}>
        {(label) ? <label>{label}</label> : null}
        <ul>
          {items.map((item, idx) => {
            if (!item) return null
            const [itemLabel, itemCallback] = item
            return item && (
              <ContextMenuItem
                key={idx}
                label={itemLabel}
                callback={(val)=> {
                  itemCallback(val)
                  closeContextMenu()
                }}
                getValue={this.props.getValue}
              />
            )
          })}
        </ul>
      </div>
    )
  },

  displayMenu() {
  },

})
export default ContextMenu
