import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import BudgetListItem from './BudgetListItem'
import { Utils } from '../../utils'
import { Permissions } from '../../constants'

const ProjectBudgetList = ({ budgets, toggleDefault, addNewBudget }, { getSessionInfo }) => {

  return (
    <div id="project-budget-summary">
      <h2>Budgets</h2>
      {budgetsByYear(budgets, toggleDefault, addNewBudget, getSessionInfo() )}
    </div>
  )
}

const budgetsByYear = (budgets = [], toggleDefault, addNewBudget, sessionInfo) => {
  const years = [...new Set(Object.keys(budgets).map(b => budgets[b].year))].sort().map(n => new Number(n).valueOf())

  const additionalYear = (years.length > 0) ? years[years.length - 1] + 1 : 2016
  return (
    <div>
      {years.map(y => yearSummary(y, budgets, toggleDefault, addNewBudget, sessionInfo))}
      {(Utils.hasPermission(sessionInfo, Permissions.Budget.EDIT)) &&
        yearSummary(additionalYear, budgets, toggleDefault, addNewBudget, sessionInfo)}
    </div>
  )
}

const yearSummary = (year, budgets, toggleDefault, addNewBudget, sessionInfo) => {
  const yearBudgets = Object.keys(budgets).filter(b => budgets[b].year == year).map(b => budgets[b])
  const key = year
  return (
    <div key={key}>
      <h4><span>{year.toString()}</span></h4>
      <ul>
        {yearBudgets.map(b => renderBudget(b, toggleDefault(year, yearBudgets)))}
      </ul>
      {(Utils.hasPermission(sessionInfo, Permissions.Budget.EDIT)) && renderAddButton(year, addNewBudget)}
    </div>
  )
}

const renderBudget = (budget, onDefaultToggle) => {
  return (
    <BudgetListItem key={budget._id} budget={budget} toggleDefault={onDefaultToggle(budget)}/>
  )
}

const renderAddButton = (year, addNewBudget) => {
  return (
    <button onClick={addNewBudget(year)}>New Budget</button>
  )
}

ProjectBudgetList.contextTypes = {
  getSessionInfo: PropTypes.func,
}
export { ProjectBudgetList }
