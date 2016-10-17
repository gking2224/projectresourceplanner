import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import './LabelledField.scss'

const LabelledField = ({label, className, children, small, medium, large}) => {
  if (!small && !medium && !large) medium = true
  return (
    <div className={classNames('labelled-field', className)}>
      <label className={classNames({small, medium, large})}>{label}</label>
      {children}
    </div>
  )
}

export default LabelledField
