import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import clone from 'clone'
import classNames from 'classnames'

import { Permissions, Constants, Paths } from '../../constants'
import { BudgetActions, ProjectActions, GlobalActions } from '../../actions'
import { EditableInput, LabelledField } from '../widgets'
import { BudgetRoleRow } from './BudgetRoleRow'
import BudgetSummary from './BudgetSummary'
import { ResourceProjectSummary } from './ResourceProjectSummary'
import { Utils, BudgetUtils } from '../../utils'

import './Budget.scss'

const Budget = React.createClass({

  contextTypes: {
    router: PropTypes.object,
    getSessionInfo: PropTypes.func,
    staticRefData: PropTypes.object,
    RefData: PropTypes.object
  },

  getInitialState: function () {

    return {
      budget: (this.props.budget && clone(this.props.budget)),
      viewFteValue: false,
      filters: {},
      project: null,
      dirty: false,
      readonly: !Utils.hasPermission(this.context.getSessionInfo(), Permissions.Budget.EDIT),
      project: this.props.project,
      resource: this.resourceFromId(this.props.params.resourceId)
    }
  },

  resourceFromId: function(resourceId) {
    const { resources } = this.context.staticRefData
    return (resourceId && resources) && resources.find(r => r._id === resourceId)
  },

  componentDidMount: function() {
    const { params, loadBudget, project } = this.props

    // url indicates new budget
    if (params && params.projectId && params.year) {
      this.setState({
        pending: true,
        dirty: true,
        budget: BudgetUtils.createNewBudget(params.year, params.projectId)
      },
      this.lazyLoadProject.bind(this, params.projectId))
    }
    // load specific budget
    else if (params && params.budgetId) {
      this.setState({
        pending: true
      }, () => {
        loadBudget(params.budgetId)
        this.loadResourceSummary(params.resourceId)
      })
    }
  },

  lazyLoadProject: function(projectId) {
    const { project, loadProject } = this.props
    // load project if we have none or we do but id is different
    if ((!project && projectId) || (project && project._id !== projectId)) {
      this.setState({project : null}, loadProject.bind(this, projectId))
    }
  },

  loadResourceSummary: function(resourceId) {
    const { loadResourceSummary } = this.props
    if (resourceId)
      this.setState({pending: true, resource: this.resourceFromId(resourceId)},
        loadResourceSummary.bind(this, resourceId))
  },

  componentWillReceiveProps: function(nextProps) {
    const { loadBudget } = this.props
    const { params } = nextProps
    const { budget, resource } = this.state
    // switch to different budget from parameter
    if (budget && params && params.budgetId !== budget._id) {
      this.setState({
        budget: null,
        project: null,
        resource: this.resourceFromId(nextProps.params.resourceId)
      }, () => {
        loadBudget(params.budgetId)
      })
    }
    // budget object provided for the first time
    else if (!budget && nextProps.budget) {
      this.setState({
        project: null,
        budget: clone(nextProps.budget)
      }, this.lazyLoadProject.bind(this, nextProps.budget.project))
    }
    // reload resource summary if resource changed
    else if (params.resourceId && (!resource || resource._id !== params.resourceId)) {
      this.loadResourceSummary(params.resourceId)
    }
    else if (!budget._id && nextProps.budget) {
      this.setState({budget: nextProps.budget})
    }
  },

  shouldComponentUpdate: function(nextProps, nextState) {

    return true
  },

  componentDidUpdate: function() {
    // if (this.state.updateResourceSummary) {
    //   this.resourceSummary.getWrappedInstance().update()
    //   this.setState({updateResourceSummary: false})
    // }
  },

  roleUpdated : function(roleIdx) {
    return (role) => {
      return () =>
        this.setState(update(this.state, {budget: {roles: {$splice: [[roleIdx, 1, role]]}}}), this.updated)
    }
  },

  nameUpdated: function(name) {
    this.setState(update(this.state, {budget: {name: {$set: name}}}), this.updated)
  },

  yearUpdated: function(year) {
    this.setState(update(this.state, {budget: {year: {$set: year}}}), this.updated)
  },

  deleteRole: function(roleIdx) {
    this.roleRowNodes.splice(roleIdx, 1)
    this.setState(update(this.state, {budget: {roles: {$splice: [[roleIdx, 1]]}}}), this.updated)
  },

  addRole: function() {
    this.roleRowNodes.forEach(ref => ref.hideAllocations())
    this.setState(update(this.state, {
      filters: {$set: {}},
      budget: {roles: {$push: [BudgetUtils.emptyRole()]}}}), this.updated)
  },

  updated: function() {
    this.setState({dirty: true}, this.loadResourceSummary.bind(this, this.state.resourceId))
  },

  focusPreviousRole: function(roleIdx) {
    return () => {
      const next = (roleIdx > 0) && this.roleRowNodes[roleIdx - 1]
      if (next) next.focusLastField()
    }
  },

  focusNextRole: function(roleIdx) {
    return () => {
      const next = (roleIdx + 1 < this.roleRowNodes.length) && this.roleRowNodes[roleIdx + 1]
      if (next) next.focusFirstField()
    }
  },

  render: function () {

    const { project, resourceSummary, projects } = this.props
    const { budget, resource } = this.state

    return (
      <div>
        {(budget && project) && this.renderBudget()}
        {(resourceSummary) && <ResourceProjectSummary resource={resource}
                                                      budgets={resourceSummary.budgetList}
                                                      projects={projects}
                                                      currentBudget={this.state.budget} />}
      </div>
    )
  },

  renderBudget() {
    const { project, readonly } = this.props
    const { budget } = this.state

    const { name, year } = budget
    return (
      <div id="budget-detail">
        <h2>Budget Detail</h2>
        <LabelledField small label={'Project'}>
          <EditableInput initialContent={project.name} initialReadonly={true} allowInlineEdit={false}/>
        </LabelledField>
        <LabelledField small label={'Year'}>
          <EditableInput initialContent={year}
                         onComplete={this.yearUpdated}
                         allowInlineEdit={!readonly}
          />
        </LabelledField>
        <LabelledField small label={'Name'}>
          <EditableInput initialContent={name}
                         onComplete={this.nameUpdated}
                         allowInlineEdit={!readonly}
          />
        </LabelledField>
        {this.renderRoles()}
        {this.renderBudgetActionButtons()}
        <BudgetSummary budget={budget} />
      </div>
    )
  },

  filtersInclude: function(role) {
    const monthFilters = Utils.months().map((m, idx) => this.monthFilter(role, m, idx))
    const filterArgs = [this.roleFilter(role), this.locationFilter(role), ...monthFilters]
    return filterArgs.reduce((b, f) => {
      const thisValue = this.filterIncludes(f[0], f[1], f[2])
      return b && thisValue
    }, true)
  },

  monthFilter: function(role, month, idx) {
    const {filters} = this.state

    const allocFtes = role.resourceAllocations.map(ra => [ra.forecast[idx], ra.actuals[idx]])
    return [month, filters[month], [role.fteRequirement[idx], ...allocFtes]]
  },

  roleFilter: function(role) {
    const {resources} = this.context.staticRefData
    const {filters} = this.state

    const allocNames = role.resourceAllocations.map(ra => resources.find(r=> r._id === ra.resourceId))
      .filter(ar => ar)
      .map(ar => ar.firstName + ' ' + ar.surname)
    return ['role', filters.role, [role.role, ...allocNames]]
  },

  locationFilter: function(role) {
    const { locations } = this.context.staticRefData
    const {filters} = this.state

    const roleLocation = locations.find(l => l._id === role.location)
    const roleLocations = (roleLocation) ? [roleLocation.name, roleLocation.country, roleLocation.city] : []
    const ll = role.resourceAllocations.map(ra => locations.find(l => l._id === ra.locationId) )
    return ['location', filters.location, [...roleLocations, ...ll.map(l=>l && l.name || ''), ...ll.map(l=>l && l.city || ''), ...ll.map(l=>l && l.country || '')]]
  },

  filterIncludes: function(type, filter, values) {
    return !filter || values.reduce( (b, v) =>
      b || (v && v.indexOf(filter) !== -1), false)
  },

  renderRoles: function() {
    const { budget, viewFteValue, resource } = this.state
    const { readonly } = this.props

    const visibleRoles = budget.roles.map((r, idx) => Object.assign(r, {idx: idx})).filter(r => this.filtersInclude(r))
    this.roleRowNodes = visibleRoles.map(b => null)
    const viewRoleAllocations = (roleIdx) => {
      return () => {
        this.roleRowNodes.filter((r, idx) => r && idx !== roleIdx).forEach(ref =>
          ref.hideAllocations()
        )
      }
    }
    return (
      <div id="budget-roles">
        <h4>Roles</h4>
        <div>
          <table>
            {(budget.roles.length > 0) && this.tableHeader()}
            {visibleRoles.map((r, idx) =>
              <BudgetRoleRow ref={(n) => this.roleRowNodes[idx] = n} key={'role_'+r.idx}
                             initialRole={r} roleIdx={r.idx}
                             readonly={readonly}
                             roleUpdated={this.roleUpdated(r.idx)}
                             viewFteValue={viewFteValue}
                             viewRoleAllocations={viewRoleAllocations(idx)}
                             focusNextRole={this.focusNextRole(idx)}
                             focusPreviousRole={this.focusPreviousRole(idx)}
                             highlightResource={resource ? resource._id : null}
                             setFilter={this.setFilter}
                             viewResourceSummary={this.viewResourceSummary}
                             deleteRole={this.deleteRole.bind(this, idx)}
              />
            )}
            {(visibleRoles.length > 0) && this.renderFteGrandTotals()}
            {(visibleRoles.length == 0 && budget.roles.length > 0) &&
              <tbody><tr><td colSpan={18}>No roles match filter</td></tr></tbody>}
          </table>
          {!readonly && <button onClick={this.addRole}>Add Role</button>}
        </div>
      </div>
    )
  },

  renderFteGrandTotals: function() {
    const { budget, viewFteValue } = this.state
    const months = Constants.MONTH_INDICES

    const fteMonthTotals = BudgetUtils.budgetFteMonthTotals(budget, viewFteValue)
    const fteGrandTotal = fteMonthTotals.reduce( (gt, t) => t + gt, 0)
    return (
      <thead>
        <tr>
          <th rowSpan={3} colSpan={4}>Total</th>
          <th>Budgeted</th>
          {fteMonthTotals.map( (monthTotal, idx) =>
            <th key={'ftegrandTotal'+idx}>{monthTotal}</th>
          )}
          <th>{fteGrandTotal}</th>
          <th rowSpan={3} colSpan={2}>&nbsp;</th>
        </tr>
        {['forecast', 'actuals'].map( (type) => this.renderTotals(months, type, fteMonthTotals, fteGrandTotal) )}
      </thead>
    )
  },

  renderTotals: function(months, type, fteMonthTotals, fteGrandTotal) {
    const typeTotals = months.map(m => this.typeMonthTotal(m, type))
    const typeGrandTotal = typeTotals.reduce( (gt, t) => t + gt, 0)
    return (
      <tr className={'total'} key={type+'grandTotal'}>
        <th>{(type === 'forecast') ? 'Forecast' : 'Actuals'}</th>
        {typeTotals.map( (t, idx) =>
          <th key={type+'grandTotal'+idx} className={classNames({over: t > fteMonthTotals[idx]})}>{t}</th>)}
        <th className={classNames('grandTotal', type, {over: typeGrandTotal > fteGrandTotal})}>{typeGrandTotal}</th>
      </tr>
    )
  },

  cancel: function() {

  },

  viewResourceSummary: function(resourceId) {
    return () => {
      this.context.router.push(Paths.Budget.viewWithResource(this.state.budget._id, resourceId))
      // this.props.loadResourceSummary(resourceId)
    }
  },

  typeMonthTotal: function(month, type) {
    const { budget, viewFteValue } = this.state
    return budget.roles.reduce( (t1, r) =>
      r.resourceAllocations.reduce( (t2, ra) =>
        t2 + (new Number(ra[type][month] || 0) * ((viewFteValue) ? (ra.rate || 0) : 1)),
        0),
      0)
  },

  setFilter: function(type, value) {
    return () => {
      let f = this.state.filters || {}
      f[type] = value
      this.setState({
        filters: f
      })
    }
  },

  clearFilters: function() {
    this.setState({filters: {}})
  },

  renderFilterField: function(className, filter, idx = 0) {
    const { filters } = this.state
    return (
      <th key={'filter_'+className+'_'+idx} className={classNames('filter', className)}>
        <EditableInput immediateFire={true} initialReadonly={false} initialContent={filters[filter]}
                       onChange={this.setFilter.bind(this, filter)} />
      </th>
    )
  },

  tableHeader: function() {
    return (
      <thead>
      <tr id="filters">
        {this.renderFilterField('role', 'role')}
        {this.renderFilterField('location', 'location')}
        <th colSpan={3}>&nbsp;</th>
        {Utils.months().map( (m, idx) => this.renderFilterField('fte', m, idx))}
        <th colSpan={2}>&nbsp;</th>
      </tr>
      <tr>
        <th>Role</th>
        <th>Location</th>
        <th>Contract Type</th>
        <th>Cost</th>
        <th></th>
        {Utils.months().map(m => <th key={'monthHeader'+m}>{m}</th>)}
        <th>Total</th>
        <th>Comment</th>
        <th>Actions</th>
      </tr>
      </thead>
    )
  },

  toggleFTEValues: function() {
    const viewFteValue = !this.state.viewFteValue
    this.setState({viewFteValue: viewFteValue})
  },
  renderBudgetActionButtons: function() {
    const { budget, viewFteValue, dirty } = this.state
    const { readonly } = this.props

    const duplicate = () => {
      this.save(Object.assign({}, clone(this.state.budget), {_id: undefined, name: 'Copy of '+budget.name, isDefault: false}))
    }
    return (<div>
      {dirty && !readonly && <button onClick={this.save(budget)}>Save</button>}
      <button onClick={this.cancel}>Cancel</button>
      <button onClick={this.toggleFTEValues}>View {(viewFteValue) ? 'FTEs' : 'Values'}</button>
      {!readonly && <button onClick={duplicate}>Duplicate</button>}
      <button onClick={this.clearFilters}>Clear filters</button>
    </div>)
  },

  save: function(budget) {
    return () => this.props.save(budget, (saved) => this.setState({dirty: !saved}))
  },

  cancel: function() {

    if (this.state.dirty) {
      this.props.confirmCancel({
        callback: this.navigateToProject,
        cancel: () => {},
        title: "Cancel",
        message: 'Changes will be lost - are you sure?'
      })
    }
    else this.navigateToProject()
  },

  navigateToProject: function() {
    this.context.router.push("/projects/" + this.props.project._id)
  }
})

export {Budget} // for unit testing
export default connect(
  state => {
    return {
      budget: state.model.budgets.activeBudgetId ?
        state.model.budgets.budgetList.find(b => b._id === state.model.budgets.activeBudgetId) : null,
      project: (state.model.budgets.activeProjectId && state.model.projects.projectList) ?
        state.model.projects.projectList.find(p => p._id === state.model.budgets.activeProjectId) :
        null,
      projects: state.model.projects.projectList,
      resourceSummary: state.model.budgets.resourceSummary
    }
  },
  dispatch => ({
    save: (budget, callback) => dispatch(BudgetActions.saveBudget(budget, callback)),
    confirmCancel: (dialog) => dispatch(GlobalActions.displayDialogYesNo(dialog)),
    budgetUpdated: (budget) => dispatch(BudgetActions.budgetUpdated({budget})),
    loadBudget: (budgetId) => dispatch(BudgetActions.loadBudget(budgetId)),
    loadProject: (projectId) => dispatch(ProjectActions.loadProject(projectId)),
    loadResourceSummary: (resourceId) => dispatch(BudgetActions.loadResourceSummary({resourceId}))
  })
)(Budget)
