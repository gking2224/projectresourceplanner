import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import clone from 'clone'
import classNames from 'classnames'

import { Permissions, Constants, Paths } from '../../constants'
import { BudgetActions, ProjectActions, GlobalActions } from '../../actions'
import { EditableInput } from '../widgets'
import BudgetRoleRow from './BudgetRoleRow'
import BudgetDetail from './BudgetDetail'
import BudgetSummary from './BudgetSummary'
import { Utils, BudgetUtils } from '../../utils'

import './Budget.scss'

const Budget = React.createClass({

  propTypes: {
    // MODEL
    budget: PropTypes.shape({
      _id: PropTypes.number,
    }),
    project: PropTypes.shape({
      _id: PropTypes.number
    }),
    params: PropTypes.shape({

    }),
    // FUNCTIONS
    createNewBudget: PropTypes.func,
    updateBudget: PropTypes.func,
    loadBudget: PropTypes.func,
    confirmCancel: PropTypes.func,
    editBudget: PropTypes.func,
    save: PropTypes.func,

    // UI
    editing: PropTypes.bool,
    children: PropTypes.arrayOf({

    })
  },

  contextTypes: {
    router: PropTypes.object,
    getSessionInfo: PropTypes.func,
    staticRefData: PropTypes.object,
    RefData: PropTypes.object,
  },

  getInitialState () {

    const sessionInfoAndUnsubscribe = this.context.getSessionInfo(this.sessionInfoUpdated)
    const sessionInfo = sessionInfoAndUnsubscribe[0]
    return {
      sessionInfo,
      unsubscribe: sessionInfoAndUnsubscribe[1],
      viewFteValue: false,
      filters: {},
      permissioned: Utils.hasPermission(sessionInfo, Permissions.Budget.EDIT),
      readonly: true,
      dirty: false,
    }
  },

  componentDidMount() {
    const { params, createNewBudget, loadBudget} = this.props

    if (params && params.projectId && params.year) {
      // url indicates new budget
      createNewBudget(params.projectId, params.year)
    } else if (params && params.budgetId) {
      // load specific budget
      loadBudget(params.budgetId)
    }
  },

  componentWillReceiveProps(nextProps) {
    const { params, loadProject, loadBudget, budget } = nextProps

    if (budget && params && Number(params.budgetId) !== budget._id) {
      // switch to different budget from parameter
      loadBudget(params.budgetId)
    }
    if (nextProps.budget && (!nextProps.project || nextProps.project._id !== nextProps.budget.projectId)) {
      loadProject(nextProps.budget.projectId)
    }
    this.setState({
      readonly: !nextProps.editing || !this.state.permissioned
    })
  },

  shouldComponentUpdate(nextProps) {
    return (nextProps.budget && nextProps.project) !== undefined
  },

  componentDidUpdate() {},

  componentWillUnmount() {
    this.state.unsubscribe()
  },

  fireUpdates(stateSpec, budgetSpec) {
    const { budget, updateBudget } = this.props
    if (stateSpec) {
      this.setState(update(this.state, stateSpec), () => {
        if (budgetSpec) updateBudget(update(budget, budgetSpec))
      })
    }
  },

  fireBudgetUpdate(budgetSpec) {
    if (budgetSpec) this.fireUpdates({dirty: {$set: true}}, budgetSpec)
  },

  roleUpdated(roleIdx) {
    return updateSpec => this.fireBudgetUpdate({roles: {[roleIdx]: updateSpec}})
  },

  nameUpdated(name) {
    this.fireBudgetUpdate({name: {$set: name}})
  },

  yearUpdated(year) {
    this.fireBudgetUpdate({year: {$set: year}})
  },

  deleteRole(roleIdx) {
    return () => {
      this.roleRowNodes.splice(roleIdx, 1)
      this.fireBudgetUpdate({roles: {$splice: [[roleIdx, 1]]}})
    }
  },

  addRole() {
    this.roleRowNodes.forEach(ref => ref.hideAllocations())
    this.fireUpdates({dirty: {$set: true}, filters: {$set: {}}}, {roles: {$push: [BudgetUtils.emptyRole()]}})
  },

  focusPreviousRole(roleIdx) {
    return () => {
      const next = (roleIdx > 0) && this.roleRowNodes[roleIdx - 1]
      if (next) next.focusLastField()
    }
  },

  focusNextRole(roleIdx) {
    return () => {
      const next = (roleIdx + 1 < this.roleRowNodes.length) && this.roleRowNodes[roleIdx + 1]
      if (next) next.focusFirstField()
    }
  },

  sessionInfoUpdated(sessionInfo) {
    const permissioned = Utils.hasPermission(sessionInfo, Permissions.Budget.EDIT)
    this.setState({
      permissioned,
      readonly: !this.props.editing || !permissioned
    })
  },

  filtersInclude(role) {
    const monthFilters = Utils.months().map((m, idx) => this.monthFilter(role, m, idx))
    const filterArgs = [this.roleFilter(role), this.locationFilter(role), ...monthFilters]
    return filterArgs.reduce((b, f) => {
      const thisValue = this.filterIncludes(f[0], f[1], f[2])
      return b && thisValue
    }, true)
  },

  monthFilter(role, month, idx) {
    const {filters} = this.state

    const allocFtes = role.allocations.map(ra => [ra.forecast[idx], ra.actuals[idx]])
    return [month, filters[month], [role.ftes[idx], ...allocFtes]]
  },

  roleFilter(role) {
    const {resources} = this.context.staticRefData
    const {filters} = this.state

    const allocNames = role.allocations.map(ra => resources[ra.resourceId])
      .filter(ar => ar)
      .map(ar => `${ar.firstName} ${ar.surname}`)
    return ['role', filters.role, [role.role, ...allocNames]]
  },

  locationFilter(role) {
    const { locations } = this.context.staticRefData
    const {filters} = this.state

    const roleLocation = locations[role.location]
    const roleLocations = (roleLocation) ? [roleLocation.name, roleLocation.country, roleLocation.city] : []
    const ll = role.allocations.map(ra => locations[ra.locationId])
    return ['location', filters.location,
      [...roleLocations, ...ll.map(l => l && (l.name || '')),
        ...ll.map(l => l && (l.city || '')), ...ll.map(l => l && (l.country || ''))]]
  },

  filterIncludes(type, filter, values) {
    return !filter || values.reduce((b, v) =>
      b || (v && v.indexOf(filter) !== -1), false)
  },

  saveRoleRowRef(idx) {
    return (node) => {
      this.roleRowNodes[idx] = node
    }
  },

  viewResourceSummary(resourceId) {
    return () => {
      this.context.router.push(Paths.Budget.viewWithResource(this.props.budget._id, resourceId))
      // this.props.loadResourceSummary(resourceId)
    }
  },

  typeMonthTotal(month, type) {
    const { viewFteValue } = this.state
    const { budget } = this.props
    return budget.roles.reduce((t1, r) =>
        r.allocations.reduce((t2, ra) =>
          t2 + (Number(ra[type][month] || 0) * ((viewFteValue) ? (ra.rate || 0) : 1)),
          0),
      0)
  },

  setFilter(type, value) {
    return () => {
      const f = this.state.filters || {}
      f[type] = value
      this.setState({
        filters: f,
      })
    }
  },

  resourceFromId(resourceId) {
    const { resources } = this.context.staticRefData
    return (resourceId && resources) && resources[resourceId]
  },

  renderBudget() {
    const { budget } = this.props
    const { readonly } = this.state

    return (
      <div id="budget-detail">
        <BudgetDetail
          {...this.props} readonly={readonly} yearUpdated={this.yearUpdated} nameUpdated={this.nameUpdated}
        />

        {this.renderRoles()}
        {this.renderBudgetActionButtons()}
        <BudgetSummary budget={budget} />
      </div>
    )
  },

  renderRoles() {
    const { viewFteValue, resource, readonly } = this.state
    const { budget } = this.props

    const visibleRoles = budget.roles.map((r, idx) => Object.assign(r, {idx})).filter(r => this.filtersInclude(r))
    this.roleRowNodes = visibleRoles.map(() => null)
    // hide other role row allocations
    const collapseOtherRoles = roleIdx => () => {
      this.roleRowNodes.filter((r, idx) => r && idx !== roleIdx).forEach(ref => ref.hideAllocations())
    }
    return (
      <div id="budget-roles">
        <h4>Roles</h4>
        <div>
          <table>
            {(budget.roles.length > 0) && this.tableHeader()}
            {visibleRoles.map((r, idx) =>
              <BudgetRoleRow
                ref={this.saveRoleRowRef(idx)}
                key={`role_${r.idx}`}
                role={r} roleIdx={r.idx}
                readonly={readonly}
                roleUpdated={this.roleUpdated(r.idx)}
                viewFteValue={viewFteValue}
                collapseOtherRoles={collapseOtherRoles(idx)}
                focusNextRole={this.focusNextRole(idx)}
                focusPreviousRole={this.focusPreviousRole(idx)}
                highlightResource={resource ? resource._id : null}
                setFilter={this.setFilter}
                viewResourceSummary={this.viewResourceSummary}
                deleteRole={this.deleteRole(idx)}
              />
            )}
            {(visibleRoles.length > 0) && this.renderFteGrandTotals()}
            {(visibleRoles.length === 0 && budget.roles.length > 0) &&
              <tbody><tr><td colSpan={18}>No roles match filter</td></tr></tbody>}
          </table>
          {!readonly && <button onClick={this.addRole}>Add Role</button>}
        </div>
      </div>
    )
  },

  renderFteGrandTotals() {
    const { viewFteValue } = this.state
    const { budget } = this.props
    const months = Constants.MONTH_INDICES

    const fteMonthTotals = BudgetUtils.budgetFteMonthTotals(budget, viewFteValue)
    const fteGrandTotal = fteMonthTotals.reduce((gt, t) => t + gt, 0)
    return (
      <thead>
        <tr>
          <th rowSpan={3} colSpan={4}>Total</th>
          <th>Budgeted</th>
          {fteMonthTotals.map((monthTotal, idx) =>
            <th key={`ftegrandTotal_${idx}`}>{monthTotal}</th>
          )}
          <th>{fteGrandTotal}</th>
          <th rowSpan={3} colSpan={2}>&nbsp;</th>
        </tr>
        {['forecast', 'actuals'].map(type => this.renderTotals(months, type, fteMonthTotals, fteGrandTotal))}
      </thead>
    )
  },

  renderTotals(months, type, fteMonthTotals, fteGrandTotal) {
    const typeTotals = months.map(m => this.typeMonthTotal(m, type))
    const typeGrandTotal = typeTotals.reduce((gt, t) => t + gt, 0)
    return (
      <tr className={'total'} key={`${type}_grandTotal`}>
        <th>{(type === 'forecast') ? 'Forecast' : 'Actuals'}</th>
        {typeTotals.map((t, idx) =>
          <th key={`${type}_grandTotal_${idx}`} className={classNames({over: t > fteMonthTotals[idx]})}>{t}</th>)}
        <th className={classNames('grandTotal', type, {over: typeGrandTotal > fteGrandTotal})}>{typeGrandTotal}</th>
      </tr>
    )
  },

  clearFilters() {
    this.setState({filters: {}})
  },

  renderFilterField(className, filter, idx = 0) {
    const { filters } = this.state
    return (
      <th key={`filter_${className}_${idx}`} className={classNames('filter', className)}>
        <EditableInput
          immediateFire
          initialReadonly={false}
          initialContent={filters[filter]}
          onChange={this.setFilter(filter)}
        />
      </th>
    )
  },

  tableHeader() {
    return (
      <thead>
        <tr id="filters">
          {this.renderFilterField('role', 'role')}
          {this.renderFilterField('location', 'location')}
          <th colSpan={3}>&nbsp;</th>
          {Utils.months().map((m, idx) => this.renderFilterField('fte', m, idx))}
          <th colSpan={2}>&nbsp;</th>
        </tr>
        <tr>
          <th>Role</th>
          <th>Location</th>
          <th>Contract Type</th>
          <th>Cost</th>
          <th />
          {Utils.months().map(m => <th key={`monthHeader${m}`}>{m}</th>)}
          <th>Total</th>
          <th>Comment</th>
          <th>Actions</th>
        </tr>
      </thead>
    )
  },

  toggleFTEValues() {
    const viewFteValue = !this.state.viewFteValue
    this.setState({viewFteValue})
  },

  renderBudgetActionButtons() {
    const { viewFteValue, dirty, readonly, permissioned } = this.state
    const { budget } = this.props

    const duplicate = () => {
      this.save(Object.assign({}, clone(this.state.budget), {
        _id: undefined, name: `Copy of ${budget.name}`, isDefault: false}))
    }
    return (<div>
      {dirty && !readonly && <button onClick={this.save(budget)}>Save</button>}
      {!dirty && permissioned && <button onClick={this.edit(budget)}>Edit</button>}
      <button onClick={this.cancel}>Cancel</button>
      <button onClick={this.toggleFTEValues}>View {(viewFteValue) ? 'FTEs' : 'Values'}</button>
      {!readonly && <button onClick={duplicate}>Duplicate</button>}
      <button onClick={this.clearFilters}>Clear filters</button>
    </div>)
  },

  render () {
    const { project, budget, children } = this.props
    return (
      <div>
        {(budget && project) && this.renderBudget()}
        {children}
      </div>
    )
  },

  save(budget) {
    return () => this.props.save(budget, saved => this.setState({dirty: !saved}))
  },

  edit(budget) {
    return () => this.props.editBudget(budget._id)
  },

  cancel() {

    if (this.state.dirty) {
      this.props.confirmCancel({
        callback: this.navigateToProject,
        cancel: () => {},
        title: 'Cancel',
        message: 'Changes will be lost - are you sure?',
      })
    } else {
      this.navigateToProject()
    }
  },

  navigateToProject() {
    this.context.router.push(`/projects/${this.props.project._id}`)
  },
})

export {Budget} // for unit testing
export default connect(
  (state) => {
    const budget = state.model.wip.budget || state.model.budgets[state.screens.budget.activeBudgetId]
    return {
      editing: (state.model.wip.budget !== null),
      budget,
      project: (budget) ? state.model.projects[budget.projectId] : null,
      projects: state.model.projects,
      resourceSummary: state.model.resourceSummary,
    }
  },
  dispatch => ({
    save: (budget, callback) => dispatch(BudgetActions.saveBudget(budget, callback)),
    confirmCancel: dialog => dispatch(GlobalActions.displayDialogYesNo(dialog)),
    loadBudget: budgetId => dispatch(BudgetActions.loadBudget(budgetId)),
    loadProject: projectId => dispatch(ProjectActions.loadProject(projectId)),
    editBudget: budgetId => dispatch(BudgetActions.editBudget(budgetId)),
    updateBudget: budget => dispatch(BudgetActions.updateBudget({budget})),
    createNewBudget: (projectId, year) => dispatch(BudgetActions.createNewBudget(projectId, year)),
    // loadResourceSummary: resourceId => dispatch(BudgetActions.loadResourceSummary(resourceId)),
  })
)(Budget)
