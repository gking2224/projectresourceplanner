import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import pd from 'react-prevent-default'
import keycode from 'keycode'
import classNames from 'classnames'
import mouse from 'mouse-event'

export const EditableInput = React.createClass({

  input: null,

  getDefaultProps: function() {
    return {
      immediateFire: false,
      allowInlineEdit: true,
      blankEditHandle: '-',
      initialReadonly: true
    }
  },

  getInitialState: function() {
    return {
      readonly: this.props.initialReadonly,
      content: this.props.initialContent
    }
  },

  shouldComponentUpdate: function() {
    return true
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (!this.state.readonly && prevState.readonly) {
      this.input.focus()
      this.input.select()
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      content: nextProps.initialContent,
      readonly: nextProps.initialReadonly
    })
  },

  render: function() {
    const { className, allowInlineEdit, blankEditHandle, onChange  } = this.props
    const { readonly, content } = this.state

    if (readonly) {
      let label = (content) ? content : ((allowInlineEdit) ? blankEditHandle : '')
      return (
        <span onMouseUp={this.onMouseUpHandler} className={classNames(className, 'editableInput', {'editable': allowInlineEdit})}>{label}</span>
      )
    }
    else {
      return (
        <input ref={n => {
          this.input = n
        }}
               className={classNames(className, 'editableInput')}
               defaultValue={content}
               onBlur={this.onBlurHandler}
               onKeyUp={this.onKeyUpHandler}
               onChange={(!onChange)?null:this.onChangeHandler}
               onKeyDown={this.onKeyDownHandler}
        />
      )
    }
  },

  onChangeHandler: function() {
    this.fireChange(false)
  },

  onKeyDownHandler: function(e) {

    if (keycode(e) === 'tab') {
      if (!e.shiftKey) {
        this.fireExitFunction(e, this.props.onTab)
      }
      else if (e.shiftKey) {
        this.fireExitFunction(e, this.props.onShiftTab)
      }
    }
    else if (keycode(e) === 'right' && !e.altKey) {
      if (typeof this.input.selectionEnd !== 'undefined' && this.input.selectionEnd === this.input.value.length) {
        this.fireExitFunction(e, this.props.onRight)
      }
    }
    else if (keycode(e) === 'left' && !e.altKey) {
      if (typeof this.input.selectionStart !== 'undefined' && this.input.selectionStart === 0) {
        this.fireExitFunction(e, this.props.onLeft)
      }
    }
  },

  fireExitFunction: function(e, func, fireChange = true) {
    if (func) {
      if (e) e.preventDefault()
      if (fireChange) this.fireChange(true)
      this.resetReadonly()
      func(this.input.value)
    }
  },

  getValue: function() {
    return this.state.content
  },

  onMouseUpHandler: function() {
    if (this.props.allowInlineEdit) {
      if (this.props.requestEdit) {
        this.props.requestEdit()
      }
      else {
        this.setState({readonly: false})
      }
    }
  },

  onKeyUpHandler: function(e) {
    if (keycode(e) === 'enter') {
      this.fireChange(true)
      this.resetReadonly()
    }
    else if (keycode(e) === 'esc') {
      this.fullReset()
    }
    else if (keycode(e) === 'down') {
      this.fireExitFunction(e, this.props.onDown)
    }
    else if (keycode(e) === 'up') {
      this.fireExitFunction(e, this.props.onUp)
    }
    else if (keycode(e) === 'right' && e.altKey) {
      this.fireExitFunction(e, this.props.onAltRight)
    }
    else if (keycode(e) === 'left' && e.altKey) {
      this.fireExitFunction(e, this.props.onAltLeft)
    }
    else if (keycode(e) === 'down' && e.altKey) {
      this.fireExitFunction(e, this.props.onAltDown)
    }
    else if (keycode(e) === 'up' && e.altKey) {
      this.fireExitFunction(e, this.props.onAltUp)
    }
    else if (this.props.immediateFire) {
      this.fireChange(false)
    }
  },

  onBlurHandler: function() {
    this.fireChange(true)
    this.resetReadonly()
  },

  edit: function() {
    if (this.props.allowInlineEdit) {
      this.setState({readonly: false}, () => {
        this.input.focus()
        this.input.select()
      })
    }
  },

  fireChange: function(complete) {
    if (this.input.value !== this.props.initialContent) {
      if (this.props.onChange) {
        this.props.onChange(this.input.value)
      }
      else this.setState({content: this.input.value})
      if (complete) {
        if (this.props.onComplete) {
          this.props.onComplete(this.input.value)
        }
        else this.setState({content: this.input.value})
      }
    }
  },

  fullReset: function() {
    if (this.props.cancelEdit) {
      this.props.cancelEdit()
    }
    else {
      this.setState({content: this.props.initialContent})
    }
  },

  resetReadonly: function() {
    if (this.props.cancelEdit) {
      this.props.cancelEdit()
    }
    else {
      this.setState({readonly: this.props.initialReadonly})
    }
  },

  suppressContext: function() {
    return !this.state.readonly
  }

})

