import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import pd from 'react-prevent-default'
import update from 'react-addons-update'
import clone from 'clone'
import classNames from 'classnames'

import { Permissions, Constants, Paths } from '../../constants'
import { BudgetActions, ProjectActions, GlobalActions } from '../../actions'
import { EditableInput, LabelledField } from '../widgets'
import BudgetRoleRow from './BudgetRoleRow'
import BudgetSummary from './BudgetSummary'
import ResourceProjectSummary from './ResourceProjectSummary'
import { Utils, BudgetUtils } from '../../utils'

import './Budget.scss'

const Budget = React.createClass({

  contextTypes: {
    router: PropTypes.object
  },

  roleRowNodes: [],

  getInitialState: function () {
    return {
      budget: (this.props.budget && clone(this.props.budget)),
      viewFteValue: false,
      filters: {},
      dirty: false,
      project: this.props.project,
      resource: this.resourceFromId(this.props.params.resourceId)
    }
  },

  resourceFromId: function(resourceId) {
    const { resources } = this.props
    return (resourceId && resources) && resources.find(r => r._id === resourceId)
  },

  componentDidMount: function() {
    const { params, loadBudget, project } = this.props
    // url indicates new project
    if (params && params.projectId && params.year) {
      this.setState({
        dirty: true,
        project: project,
        budget: BudgetUtils.createNewBudget(params.year, params.projectId)
      },
      this.lazyLoadProject.bind(this, params.projectId))
    }
    // load specific budget
    else if (params && params.budgetId) {
      loadBudget(params.budgetId)
      this.loadResourceSummary(params.resourceId)
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
    this.setState({resource: this.resourceFromId(resourceId)},
      loadResourceSummary.bind(this, resourceId))
  },

  componentWillReceiveProps: function(nextProps) {
    const { loadBudget } = this.props
    const { params, project } = nextProps
    const { budget, resource } = this.state
    // switch to different budget from parameter
    if (budget && params && params.budgetId !== budget._id) {
      this.setState({
        budget: null,
        project: null,
        resource: this.resourceFromId(nextProps.params.resourceId)
      }, () => {
        this.roleRowNodes = []
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
    if (params.resourceId && (!resource || resource._id !== params.resourceId)) {
      this.loadResourceSummary(params.resourceId)
    }
  },

  componentDidUpdate: function() {
    // if (this.state.updateResourceSummary) {
    //   this.resourceSummary.getWrappedInstance().update()
    //   this.setState({updateResourceSummary: false})
    // }
  },

  roleUpdated : function(roleIdx) {
    return (role) => {
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
    this.setState(update(this.state, {budget: {roles: {$splice: [[roleIdx, 1]]}}}), this.updated)
  },

  addRole: function() {
    this.setState(update(this.state, {budget: {roles: {$push: [BudgetUtils.emptyRole()]}}}), this.updated)
  },

  updated: function() {
    this.setState({dirty: true}, this.loadResourceSummary.bind(this, this.state.resourceId))
  },

  shouldComponentUpdate: function (nextProps) {
    return true
  },

  focusPreviousRole: function(roleIdx) {
    return () => {
      const next = (roleIdx > 0) && this.roleRowNodes[roleIdx - 1]
      if (next) next.getWrappedInstance().focusLastField()
    }
  },

  focusNextRole: function(roleIdx) {
    return () => {
      const next = (roleIdx + 1 < this.roleRowNodes.length) && this.roleRowNodes[roleIdx + 1]
      if (next) next.getWrappedInstance().focusFirstField()
    }
  },

  render: function () {

    const { project, locations } = this.props
    const { budget, resource } = this.state

    return (
      <div>
        {(budget && project) && this.renderBudget()}
        {(resource) && <ResourceProjectSummary locations={locations}
                                               resource={resource}
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
                         initialReadonly={true}
                         allowInlineEdit={!readonly}
          />
        </LabelledField>
        <LabelledField small label={'Name'}>
          <EditableInput initialContent={name}
                         onComplete={this.nameUpdated}
                         initialReadonly={true}
                         allowInlineEdit={!readonly}
          />
        </LabelledField>
        {this.renderRoles()}
        {this.renderBudgetActionButtons()}
        <BudgetSummary budget={budget} />
      </div>
    )
  },

  renderRoles: function() {
    const { budget, viewFteValue } = this.state
    const viewRoleAllocations = (roleIdx) => {
      this.roleRowNodes.filter((r, idx) => idx !== roleIdx ).forEach(ref =>
        ref.getWrappedInstance().hideAllocations()
      )
    }
    return (
      <div id="budget-roles">
        <h4>Roles</h4>
        <div>
          <table>
            {(budget.roles.length > 0) && this.tableHeader()}
            {budget.roles.map((r, idx) =>
              <BudgetRoleRow ref={(n) => this.roleRowNodes[idx] = n} key={'role_'+idx}
                             initialRole={r} roleIdx={idx}
                             roleUpdated={this.roleUpdated(idx)}
                             viewFteValue={viewFteValue}
                             viewRoleAllocations={viewRoleAllocations.bind(this, idx)}
                             focusNextRole={this.focusNextRole(idx)}
                             focusPreviousRole={this.focusPreviousRole(idx)}
                             roleFilter={this.state.filters['role']}
                             locationFilter={this.state.filters['location']}
                             janFteFilter={this.state.filters['janFte']}
                             febFteFilter={this.state.filters['febFte']}
                             marFteFilter={this.state.filters['marFte']}
                             aprFteFilter={this.state.filters['aprFte']}
                             mayFteFilter={this.state.filters['mayFte']}
                             junFteFilter={this.state.filters['junFte']}
                             julFteFilter={this.state.filters['julFte']}
                             augFteFilter={this.state.filters['augFte']}
                             sepFteFilter={this.state.filters['sepFte']}
                             octFteFilter={this.state.filters['octFte']}
                             novFteFilter={this.state.filters['novFte']}
                             decFteFilter={this.state.filters['decFte']}
                             highlightResource={this.state.highlightResource}
                             setFilter={this.setFilter}
                             viewResourceSummary={this.viewResourceSummary}
                             deleteRole={this.deleteRole.bind(this, idx)}
              />
            )}
            {(budget.roles.length > 0) && this.renderFteGrandTotals()}
          </table>
          <button onClick={pd(this.addRole)}>Add Role</button>
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
          <th rowSpan={3} colSpan={3}>Total</th>
          <th>Budgeted</th>
          {fteMonthTotals.map( (monthTotal, idx) =>
            <th key={'ftegrandTotal'+idx}>{monthTotal}</th>
          )}
          <th>{fteGrandTotal}</th>
          <th rowSpan={3}>&nbsp;</th>
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
    let f = this.state.filters || {}
    f[type] = value
    this.setState({
      filters: f
    })
  },

  clearFilters: function() {
    this.setState({
      filters: {}
    })
  },

  tableHeader: function() {
    const { locationFilter } = this.state
    return (
      <thead>
      <tr id="filters">
        <th className={classNames('filter', 'role')}><EditableInput immediateFire={true} initialReadonly={false} initialContent={this.state.filters['role']} className={classNames('filter', 'role')} onChange={this.setFilter.bind(this, 'role')} /></th>
        <th className={classNames('filter', 'location')}><EditableInput initialReadonly={false} initialContent={locationFilter}  className={classNames('filter', 'location')} onChange={this.setFilter.bind(this, 'location')} /></th>
        <th colSpan={2}>&nbsp;</th>
        <th className={classNames('filter', 'fte')}><EditableInput initialReadonly={false} onChange={this.setFilter.bind(this, 'janFte')} /></th>
        <th className={classNames('filter', 'fte')}><EditableInput initialReadonly={false} onChange={this.setFilter.bind(this, 'febFte')} /></th>
        <th className={classNames('filter', 'fte')}><EditableInput initialReadonly={false} onChange={this.setFilter.bind(this, 'marFte')} /></th>
        <th className={classNames('filter', 'fte')}><EditableInput initialReadonly={false} onChange={this.setFilter.bind(this, 'aprFte')} /></th>
        <th className={classNames('filter', 'fte')}><EditableInput initialReadonly={false} onChange={this.setFilter.bind(this, 'mayFte')} /></th>
        <th className={classNames('filter', 'fte')}><EditableInput initialReadonly={false} onChange={this.setFilter.bind(this, 'junFte')} /></th>
        <th className={classNames('filter', 'fte')}><EditableInput initialReadonly={false} onChange={this.setFilter.bind(this, 'julFte')} /></th>
        <th className={classNames('filter', 'fte')}><EditableInput initialReadonly={false} onChange={this.setFilter.bind(this, 'augFte')} /></th>
        <th className={classNames('filter', 'fte')}><EditableInput initialReadonly={false} onChange={this.setFilter.bind(this, 'sepFte')} /></th>
        <th className={classNames('filter', 'fte')}><EditableInput initialReadonly={false} onChange={this.setFilter.bind(this, 'octFte')} /></th>
        <th className={classNames('filter', 'fte')}><EditableInput initialReadonly={false} onChange={this.setFilter.bind(this, 'novFte')} /></th>
        <th className={classNames('filter', 'fte')}><EditableInput initialReadonly={false} onChange={this.setFilter.bind(this, 'decFte')} /></th>
        <th colSpan={2}>&nbsp;</th>
      </tr>
      <tr>
        <th>Role</th>
        <th>Location</th>
        <th>Cost</th>
        <th></th>
        <th>Jan</th>
        <th>Feb</th>
        <th>Mar</th>
        <th>Apr</th>
        <th>May</th>
        <th>Jun</th>
        <th>Jul</th>
        <th>Aug</th>
        <th>Sep</th>
        <th>Oct</th>
        <th>Nov</th>
        <th>Dec</th>
        <th>Total</th>
        <th>Actions</th>
      </tr>
      </thead>
    )
  },

  toggleFTEValues: function() {
    const viewFteValue = !this.state.viewFteValue
    this.setState({
      viewFteValue: viewFteValue,
      readonly: (viewFteValue) ? true : this.state.readonly
    })
  },
  renderBudgetActionButtons: function() {
    const { budget, readonly, viewFteValue, dirty } = this.state

    const duplicate = () => {
      save(Object.assign({}, clone(this.state.budget), {_id: undefined, name: 'Copy of '+budget.name, isDefault: false}))
    }
    return (<div>
      {(dirty) && <button onClick={this.save(budget)}>Save</button>}
      <button onClick={this.cancel}>Cancel</button>
      <button onClick={this.toggleFTEValues}>View {(viewFteValue) ? 'FTEs' : 'Values'}</button>
      <button onClick={duplicate}>Duplicate</button>
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
      sessionInfo: state.sessionInfo,
      budget: state.model.budgets.activeBudgetId ?
        state.model.budgets.budgetList.find(b => b._id === state.model.budgets.activeBudgetId) : null,
      project: (state.model.budgets.activeProjectId && state.model.projects.projectList) ?
        state.model.projects.projectList.find(p => p._id === state.model.budgets.activeProjectId) :
        null,
      readonly: !Utils.hasPermission(state.sessionInfo, Permissions.Budget.EDIT),
      locations: state.staticRefData.locations.locationList,
      resources: state.staticRefData.resources.resourceList
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
