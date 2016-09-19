import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'

import classNames from 'classnames'
import { Link } from 'react-router'
import { Paths } from '../../constants/paths'

import './Budget.scss'

const ResourceProjectSummary = React.createClass({

  months: [0,1,2,3,4,5,6,7,8,9,10,11],

  getInitialState: function () {
    return {
      defaultBudgetsOnly: false,
      types: ['forecast', 'actuals'],
      defaultOnly: false,
      showForecast: true,
      showActuals: true,
      budgets: this.props.budgets || []
    }
  },

  shouldComponentUpdate: function (nextProps) {
    return true
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(
      update(this.state, {budgets: {$set: (nextProps.budgets || [])}}),
      this.updateCurrentBudget.bind(this, nextProps))
  },

  updateCurrentBudget: function(props) {
    const { currentBudget } = props
    if (currentBudget) {
      if (!currentBudget._id) {
        this.setState(update(this.state, {budgets: {$push: [currentBudget]}}))
      }
      else if (currentBudget) {
        const idx = this.state.budgets.findIndex( (b) => b._id === currentBudget._id)
        this.setState(update(this.state, {budgets: {$splice: [[idx, 1, currentBudget]]}}))
      }
    }
  },

  componentDidMount: function() {
    this.setState(
      {budgets: this.props.budgets},
      this.updateCurrentBudget.bind(this, this.props))
  },

  loadResourceSummary: function() {
    // const { loadResourceSummary } = this.props
    // if (this.state.resourceId) loadResourceSummary(this.state.resourceId)
  },

  update: function() {
    // const { resource, loadResourceSummary } = this.props
    // if (resource) loadResourceSummary(resource._id)
  },

  render: function () {
    const data = this.resourceData()

    return (
      <div id="resource-summary">
        {(data) ? this.renderResourceSummary(data) : null}
      </div>
    )
  },

  renderResourceSummary: function(data) {
    const {resource} = this.props
    const showTotals = (
      this.state.showForecast || this.state.showActuals) && !(this.state.showForecast && this.state.showActuals)
    return (
      <div id="resource-summary">
        <h2>Resource Summary - {resource.firstName} {resource.surname}</h2>
        {this.renderControls()}
        <table style={{border: '1px solid black'}}>
          {this.renderHeader()}
          <tbody>
            {data.map((e, idx) => this.renderRow(e, 'resource_sumary_'+idx, showTotals))}
          </tbody>
          <thead>
            {(this.state.showForecast) ? this.renderTotals(data, 'forecast') : null}
            {(this.state.showActuals) ? this.renderTotals(data, 'actuals') : null}
          </thead>
        </table>
      </div>
    )
  },

  renderHeader: function() {
    return (
      <thead><tr className={'total'}>
        <th>Year</th><th>Project</th><th>Budget</th><th>Role</th><th>Location</th><th>Rate</th><th>&nbsp;</th>
        <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>May</th><th>Jun</th>
        <th>Jul</th><th>Aug</th><th>Sep</th><th>Oct</th><th>Nov</th><th>Dec</th>
      </tr></thead>
    )
  },

  renderTotals: function(data, type) {

    const key = 'resourceSummary_ftetotal_'+type
    const monthTotals = this.months.map(m => data.filter(d => d.typeFtes.value.type === type)
      .reduce((t, d) => t + new Number(d.typeFtes.value.ftes[m]), 0))
    return (
      <tr key={key}>
        <th colSpan={7}>Total {(type === 'forecast')?'Forecast':'Actuals'}</th>
        {monthTotals.map( (t, m) =><th key={key+'_'+m} className={classNames({over: t > 1})}>{t}</th>)}
      </tr>
    )
  },

  setTypes: function() {
    const types = []
    if (this.state.showForecast) types.push('forecast')
    if (this.state.showActuals) types.push('actuals')
    this.setState(({types}))
  },

  renderControls: function() {
    const onDefaultOnlyChange = () => this.setState({defaultOnly: this.defaultCheckbox.checked})
    const onShowForecastChange = () => this.setState({showForecast: this.forecastCheckbox.checked}, this.setTypes)
    const onShowActualsChange = () => this.setState({showActuals: this.actualsCheckbox.checked}, this.setTypes)
    return (
      <div>
        <label><input ref={n=>this.defaultCheckbox = n} type="checkbox" onChange={onDefaultOnlyChange} checked={this.state.defaultOnly} />Show default budgets only</label>
        <label><input ref={n=>this.forecastCheckbox = n} type="checkbox" onChange={onShowForecastChange} checked={this.state.showForecast} />Show Forecast</label>
        <label><input ref={n=>this.actualsCheckbox = n} type="checkbox" onChange={onShowActualsChange} checked={this.state.showActuals} />Show Actuals</label>
      </div>
    )
  },

  renderRow: function(rowData, key) {
    const { resource } = this.props
    const { year, project, budget, role, allocation, typeFtes } = rowData
    const budgetPath = budget && Paths.Budget.viewWithResource(budget.value._id, resource._id)
    return (
      <tr key={key+'_row'}>
        {(year) ? this.renderCell(year, key+'_year') : null}
        {(project) ? this.renderCell(project, key+'_project', false) : null}
        {(budget) ? this.renderCell({value:budget.value.name, rows: budget.rows}, key+'_budget', budgetPath) : null}
        {(role) ? this.renderCell(role, key+'_role') : null}
        {(allocation) ? this.renderAllocationCells(allocation, key) : null}
        {this.renderFteCells(typeFtes, key)}
      </tr>
    )
  },

  renderCell: function(cellData, key, path) {

    return (
      (cellData) ?
        <td key={key} rowSpan={cellData.rows}>
          {(path) ? <Link to={path}>{cellData.value}</Link> : <span>{cellData.value}</span>}
        </td> :
        null
    )
  },

  renderFteCells: function(typeFtes, key, showTotals) {

    const { value, rows } = typeFtes
    const { ftes, type } = value
    const rowSpan = rows + ((showTotals) ? 1 : 0)

    return (
      [
        <td rowSpan={rowSpan} key={key+'_'+type}>{(type == 'forecast') ? 'Forecast' : 'Actuals'}</td>,
        ftes.map( (fte, m) =>
          <td className={'fte'} rowSpan={rowSpan} key={key+'_'+type+'_'+m}>{(fte == "0") ? <span>&nbsp;</span> : fte}</td>)
      ]
    )
  },

  renderAllocationCells: function(allocation, key, showTotals) {
    const rowSpan = allocation.rows + ((showTotals) ? 1 : 0)
    return (
      (allocation) ?
        [
          <td key={key + '_location'} rowSpan={rowSpan}>{this.locationName(allocation.value.locationId)}</td>,
          <td key={key + '_rate'} rowSpan={rowSpan}>{allocation.value.rate}</td>,
        ] :
        null
    )
  },

  resourceData: function() {
    const { budgets } = this.state
    const { resource, projects } = this.props
    if (!budgets || !resource || !projects) return null
    const years = [... new Set(budgets.map(b => b.year))]
    let rv = []
    years.forEach((y) => rv = [...this.yearData({years:years.length}, y)])
    return rv
  },

  filterBudgets: function(year, project) {

    const { budgets } = this.state
    let b
    if (year) b = [...new Set(budgets.filter(bb => bb.year === year))]
    else if (project) b  = budgets.filter(bb => bb.project === project._id)

    const rv = (this.state.defaultOnly) ? b.filter(b => (b.isDefault)) : b
    return rv
  },

  yearData: function(nums, year) {
    const { projects } = this.props

    const bProjects = [...new Set(this.filterBudgets(year).map((b) => projects.find(p => p._id === b.project)))]
    let expandNums = this.expandNums(nums, {year: this.yearRows(year, bProjects)});
    let rv = []
    bProjects.forEach((p, idx) => {
      (idx === 0) ?
        rv = [...rv, ...this.projectData(expandNums, p, year)] :
        rv = [...rv, ...this.projectData(expandNums, p)]
    })
    return rv
  },

  projectData: function(nums, project, year) {

    const pBudgets = this.filterBudgets(null, project)
    let expandNums = this.expandNums(nums, {project: this.projectRows(project, pBudgets)});
    let rv = []
    pBudgets.map((b, idx) => {
      (idx === 0) ?
        rv = [...rv, ...this.budgetData(expandNums, b, project, year)] :
        rv = [...rv, ...this.budgetData(expandNums, b)]
    })
    return rv
  },

  yearRows: function(year, projects) {
    const rv = projects.reduce((t, p) => t + this.projectRows(p), 0)
    return rv
  },

  projectRows: function(project, b) {
    const pBudgets = b || this.filterBudgets(null, project)
    const rv = pBudgets.reduce((t, b) =>
      t + this.budgetRows(b), 0)
    return rv
  },

  budgetRows: function(budget, roles) {
    const { resource } = this.props

    const bRoles = roles || budget.roles.filter(r => r.resourceAllocations.filter(ra => ra.resourceId === resource._id).length > 0)
    const rv = bRoles.reduce((t, r) =>
      t + this.roleRows(r), 0)
    return rv
  },

  roleRows: function(role) {
    const { resource } = this.props
    const allocations = role.resourceAllocations.filter(ra => ra.resourceId === resource._id)
    const rv = allocations.reduce((t, a) => t + this.allocationRows(a), 0)
    return rv
  },

  allocationRows: function() {
    const rv = this.state.types.length
    return rv
  },

  budgetData: function(nums, budget, project, year) {
    const { resource } = this.props
    const rRoles = budget.roles.filter(r => r.resourceAllocations.filter(ra => ra.resourceId === resource._id).length > 0)
    let expandNums = this.expandNums(nums, {budget: this.budgetRows(budget, rRoles)})
    let rv = []
    rRoles.forEach( (r, idx) => {
      (idx === 0) ?
        rv = [...rv, ...this.budgetRoleData(expandNums, r, budget, project, year)] :
        rv = [...rv, ...this.budgetRoleData(expandNums, r)]
    })
    return rv
  },

  budgetRoleData: function(nums, role, budget, project, year) {
    const { resource } = this.props
    const allocations = role.resourceAllocations.filter(ra => ra.resourceId === resource._id)
    let expandNums = this.expandNums(nums, {role: this.roleRows(role)})
    let rv = []
    allocations.forEach( (a, idx) => {
      (idx === 0) ?
        rv = [...rv, ...this.allocationData(expandNums, a, role, budget, project, year)] :
        rv = [...rv, ...this.allocationData(expandNums, a)]
    })
    return rv
  },

  allocationData: function(nums, allocation, role, budget, project, year) {
    const types = this.state.types
    let expandNums = this.expandNums(nums, {allocation: this.allocationRows()});
    let rv = []
    const typeFtes = (type) => ({type: type, ftes: allocation[type]})
    types.forEach( (t, idx) => {
      (idx === 0) ?
        rv = [...rv, this.typeFteData(expandNums, typeFtes(t), allocation, role, budget, project, year)] :
        rv = [...rv, this.typeFteData(expandNums, typeFtes(t))]
    })
    return rv
  },

  typeFteData: function(nums, typeFtes, allocation, role, budget, project, year) {
    const rv = {
      year: (year) ? {value: year, rows: nums.year} : null,
      project: (project) ? {value: project.name, rows: nums.project} : null,
      budget: (budget) ? {value: budget, rows: nums.budget} : null,
      role: (role) ? {value: role.role, rows: nums.role} : null,
      allocation: (allocation) ?
        {value: {locationId: allocation.locationId, rate: allocation.rate}, rows : nums.allocation} :
        null,
      typeFtes: {value: typeFtes, rows: 1}
    }
    return rv
  },

  locationName: function(locationId) {
    return this.props.locations.find( l => l._id === locationId).name
  },

  expandNums: function(nums, o) {
    return Object.assign(nums, o)
  }
})

export { ResourceProjectSummary } // for unit testing
export default connect(
  state => ({
    // resource: (state.model.budgets.resourceSummary) ? state.staticRefData.resources.resourceList.find( r => r._id === state.model.budgets.resourceSummary.resourceId) : null,
    budgets: (state.model.budgets.resourceSummary) && state.model.budgets.resourceSummary.budgetList,
    projects: state.model.projects.projectList
  }),
  dispatch => ({
  }),
  null,
  {withRef: true}
)(ResourceProjectSummary)
