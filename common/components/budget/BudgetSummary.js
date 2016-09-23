import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { BudgetUtils, Utils } from '../../utils'
import { LabelledField, MonthSelect } from '../widgets'

const BudgetSummary = React.createClass({


  getInitialState: function () {
    return {
      reportingMonth: new Date().getMonth()
    }
  },

  componentDidMount: function() {
  },

  componentWillReceiveProps: function(nextProps) {
  },

  componentDidUpdate: function() {
  },

  updateReportingMonth: function(month) {
    this.setState({reportingMonth: month})
  },

  render: function () {

    const { budget } = this.props
    const { reportingMonth } = this.state

    const fteTotal = BudgetUtils.fteYearTotal(budget, true)
    const ytd = BudgetUtils.budgetActualsToDate(budget, reportingMonth-1)
    const remaining = BudgetUtils.budgetRemainingForecast(budget, reportingMonth-1)
    const yearForecast = ytd + remaining

    return (
      <div id="budget-summary-ctr">
        <h2>Summary</h2>
        <LabelledField large label={'Reporting Month'}><MonthSelect initialMonth={reportingMonth} onChange={this.updateReportingMonth}/></LabelledField>
        <LabelledField large label={'Total Budget'}>{fteTotal}</LabelledField>
        <LabelledField large label={'Actuals YtD (Jan-'+Utils.months()[reportingMonth-1]+')'}>{ytd}</LabelledField>
        <LabelledField large label={'Forecast to EoY'}>
          <span className={classNames({over:yearForecast > fteTotal})}>{yearForecast}</span>
        </LabelledField>
        <LabelledField large label={'Delta'}>
          <span>{yearForecast - fteTotal}</span>
        </LabelledField>
      </div>
    )
  },

})

export default BudgetSummary
