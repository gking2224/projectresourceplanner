import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ToggleControl, ToggleTypes } from '.'
import './CollapseableSection.scss'

const CollapseableSection = React.createClass({

  getInitialState: function() {

    return {
      expanded: this.props.initialExpanded,
    }
  },
  render: function() {

    const {children, toggleType = ToggleTypes.STAR, label} = this.props
    const {expanded} = this.state

    return (
      <div>
        <div className={'toggle-header'}>
          <ToggleControl onClick={this.onToggle} type={toggleType} on={!expanded}/>
          {(label) ? <label onClick={this.onToggle}>{label}</label> : null}
        </div>
        {(expanded) ?
          <div className={'toggle-content'}>
            {children}
          </div> :
          null
        }
      </div>
    )
  },
  onToggle: function() {
    this.setState({
      expanded: !this.state.expanded,
    }, this.sendToggleEvent)
  },

  sendToggleEvent: function() {
    if (this.state.expanded && this.props.onOpen) this.props.onOpen()
    if (!this.state.expanded && this.props.onClose) this.props.onClose()
  },

})
export default CollapseableSection
