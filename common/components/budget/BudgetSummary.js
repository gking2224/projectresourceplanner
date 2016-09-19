import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { BudgetUtils } from '../../utils'
import { LabelledField } from '../widgets'

const BudgetSummary = React.createClass({


  getInitialState: function () {
    return {
    }
  },

  componentDidMount: function() {
  },

  componentWillReceiveProps: function(nextProps) {
  },

  componentDidUpdate: function() {
  },

  render: function () {

    const { budget } = this.props
    const reportingMonth = 3

    const fteTotal = BudgetUtils.fteYearTotal(budget, true)
    const ytd = BudgetUtils.budgetActualsToDate(budget, reportingMonth)
    const remaining = BudgetUtils.budgetRemainingForecast(budget, reportingMonth)
    const yearForecast = ytd + remaining

    return (
      <div id="budget-summary-ctr">
        <h2>Summary</h2>
        <LabelledField label={'Total Budget'}>{fteTotal}</LabelledField>
        <LabelledField label={'Actuals To Date'}>{ytd}</LabelledField>
        <LabelledField medium label={'Full Year Forecast'}>
          <span className={classNames({over:yearForecast > fteTotal})}>{yearForecast}</span>
        </LabelledField>
        <LabelledField medium label={'Delta'}>
          <span>{yearForecast - fteTotal}</span>
        </LabelledField>
      </div>
    )
  },

})

export default BudgetSummary
