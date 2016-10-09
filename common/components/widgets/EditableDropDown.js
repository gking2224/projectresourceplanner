import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import keycode from 'keycode'
import classNames from 'classnames'

export const EditableDropDown = React.createClass({
  getDefaultProps: function() {
    return {
      initialReadonly: true,
      allowInlineEdit: true,
      allowBlank: false
    }
  },

  getInitialState: function() {
    const values = this.props.values || this.props.labels.map( (l, idx) => idx)
    const labels = this.props.labels
    if ((this.props.allowBlank || !this.props.initialValue) && values[0]) {
      values.splice(0, 0, '')
      labels.splice(0, 0, '')
    }
    const initialIdx = values.indexOf(this.props.initialValue)
    const selectedValue = (initialIdx >= 0) ? values[initialIdx] : ''
    const selectedLabel = (initialIdx >= 0) ? labels[initialIdx] : ''

    return {
      values, labels,
      selectedValue, selectedLabel,
      readonly: this.props.initialReadonly
    }
  },

  shouldComponentUpdate: function() {
    return true
  },

  componentDidUpdate: function() {
    if (this.state.grabFocus) {
      this.input.focus()
      this.setState({grabFocus: false})
    }
  },

  componentWillUpdate: function() {
    const { values, labels } = this.state
  },

  componentWillReceiveProps: function(nextProps, nextState) {
    const { values, labels } = this.state
    const initialIdx = values.indexOf(nextProps.initialValue)
    const selectedValue = (initialIdx >= 0) ? values[initialIdx] : ''
    const selectedLabel = (initialIdx >= 0) ? labels[initialIdx] : ''

    // if we don't allow no value and a value is selected, take the initial empty value out
    const deleteTopValue = nextProps.initialValue && !labels[0] && !this.props.allowBlank
    this.setState(update(this.state, {
      selectedValue: {$set: selectedValue},
      selectedLabel: {$set: selectedLabel},
      readonly: {$set: nextProps.initialReadonly},
      values: {$splice: [[0, (deleteTopValue)?1:0]]},
      labels: {$splice: [[0, (deleteTopValue)?1:0]]}
    }))
  },

  render: function() {

    const { className, controlKey, allowInlineEdit } = this.props
    const { readonly, selectedLabel, values, labels, selectedValue } = this.state

    if (readonly) {
      let label = (selectedLabel) ? selectedLabel : ((allowInlineEdit) ? 'Click to select...' : '')
      return (
        <span className={classNames(className, 'editableDropdown', {editable: allowInlineEdit})}
              onMouseOver={this.onMouseOverHandler}
              onMouseOut={this.onMouseOutHandler}
              onMouseUp={this.onMouseUpHandler}>
          {label}
        </span>
      )
    }
    else {

      return (
        <select className={classNames(className, 'editableDropdown')}
                ref={n => this.input = n}
                value={selectedValue}
                onBlur={this.onBlurHandler}
                onKeyUp={this.onKeyUpHandler}
                onChange={this.onChangeHandler}
        >
          {labels.map((o, idx) => this.option(o, values[idx], controlKey))}
        </select>
      )
    }
  },

  option: function(option, value, controlKey) {
    const key = controlKey + '_' + value
    return (
      <option key={key} value={value}>{option}</option>
    )
  },

  onChangeHandler: function() {
    const { values } = this.state
    const value = values[this.input.selectedIndex]
    if (value || this.props.allowBlank) {
      if (this.props.onChange) {
        this.props.onChange(value)
      }
      this.setState({selectedValue: value, readonly: this.props.initialReadonly})
    }
  },


  onMouseUpHandler: function() {
    if (this.props.allowInlineEdit) {
      this.setState({readonly: false, grabFocus: true})
    }
  },

  getValue: function() {
    return this.state.selectedValue
  },

  onKeyUpHandler: function(e) {
    if (keycode(e) === 'enter') {
      this.setState({readonly: true})
      this.onChangeHandler()
    }
  },

  onBlurHandler: function() {
    if (!this.state.readonly && this.props.initialReadonly) {
      this.setState({readonly:true})
    }
  },

  suppressContext: function() {
    return !this.state.readonly
  }
})
export default EditableDropDown
