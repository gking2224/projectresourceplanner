import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const Budgets = ({children}) => {


  return (
    <div id="budgets-ctr">
      {children}
    </div>
  )
}
export default Budgets
