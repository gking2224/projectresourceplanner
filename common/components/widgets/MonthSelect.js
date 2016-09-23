import React, { Component, PropTypes } from 'react'
import { EditableDropDown } from '.'
import { Utils } from '../../utils'


const MonthSelect = (props) => {

  const { initialMonth = 0 } = props

  const newProps = Object.assign({}, props)
  delete newProps.initialMonth

  return (
    <EditableDropDown labels={Utils.months()} values={Utils.month_Indices()} initialValue={initialMonth} {...newProps} />
  )
}
export { MonthSelect }
