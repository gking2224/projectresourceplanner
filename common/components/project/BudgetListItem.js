import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Permissions } from '../../constants/permissions'
import { Utils } from '../../utils'
import { Paths } from '../../constants'
import {BudgetActions } from '../../actions'
import { ToggleControl, DeleteControl, ToggleTypes } from '../widgets'

const BudgetListItem = ({budget, deleteBudget, sessionInfo, toggleDefault}) => {
  return (
    <li>
      {budgetNameControl(budget._id, budget.name, sessionInfo)}
      {Utils.hasPermission(sessionInfo, Permissions.Budget.EDIT) &&
        <ToggleControl on={budget.isDefault} onClick={toggleDefault} type={ToggleTypes.CHECK} />}
      {(Utils.hasPermission(sessionInfo, Permissions.Budget.DELETE)) &&
        budgetDeleteControl(budget, sessionInfo, deleteBudget)}
    </li>
  )
}

const budgetNameControl = (id, name, sessionInfo) => {
  return (
    <span className="budgetName">
      {(Utils.hasPermission(sessionInfo, Permissions.Budget.VIEW_DETAIL)) ?
        <Link to={Paths.Budget.view(id)}>{name}</Link> :
        <span>{name}</span>
      }
    </span>
  )
}

const budgetDeleteControl = (budget, sessionInfo, deleteBudget) => {

  return (
    <DeleteControl onDelete={deleteBudget.bind(null, budget)} />
  )
}

export default connect(
  state => ({
    sessionInfo: state.sessionInfo
  }),
  dispatch => ({
    viewBudget: budgetId => dispatch(BudgetActions.viewBudget({budgetId})),
    deleteBudget: budget => dispatch(BudgetActions.deleteBudget({budget})),
  })
)(BudgetListItem)
