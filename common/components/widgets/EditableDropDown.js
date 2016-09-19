import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import pd from 'react-prevent-default'
import keycode from 'keycode'
import classNames from 'classnames'

export const EditableDropDown = React.createClass({
  getDefaultProps: function() {
    return {
      initialReadonly: true,
      allowInlineEdit: true
    }
  },

  getInitialState: function() {
    return {
      selectedValue: this.props.initialValue,
      selectedLabel: this.props.labels[this.props.values.indexOf(this.props.initialValue)],
      readonly: this.props.initialReadonly,
      allowInlineEdit: this.props.allowInlineEdit
    }
  },

  shouldComponentUpdate: function() {
    return true
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      selectedValue: nextProps.initialValue,
      selectedLabel: nextProps.labels[nextProps.values.indexOf(nextProps.initialValue)]
    })
  },

  render: function() {

    const { className, controlKey, labels, values, allowInlineEdit } = this.props
    const { readonly, selectedLabel, selectedValue } = this.state

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
    this.setState({selectedValue: this.input.value})
    if (this.props.onChange) {
      this.props.onChange(this.input.value)
    }
  },


  onMouseUpHandler: function() {
    if (this.props.allowInlineEdit) {
      this.setState({readonly: false})
      setTimeout(() =>this.input.focus(), 10)
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
