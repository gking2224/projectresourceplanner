import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'
import classNames from 'classnames'
import clone from 'clone'

import { Utils, BudgetUtils } from '../../utils'
import { FteCell } from './FteCell'
import { EditableInput, EditableDropDown, ContextMenuWrapper, DeleteControl } from '../widgets'
import { NavHelper as helper } from './BudgetNavigationFunctions'

const BudgetRoleRow = React.createClass({

  updated: function() {
    this.props.roleUpdated(this.state.role)
  },

  getInitialState: function () {
    return {
      role: this.props.initialRole,
      readonly: (this.props.viewFteValue || this.props.initialReadonly),
      viewAllocations: this.props.highlightResource && this.props.initialRole.resourceAllocations.find( ra=> ra.resourceId === this.props.highlightResource),
      editingMonth: -1,
      editingType: 'none'
    }
  },

  componentWillMount: function() {
  },

  shouldComponentUpdate: function (nextProps) {
    return true
  },

  componentWillReceiveProps: function (nextProps, nextState) {
    this.setState({
      filterExcludes: !this.matchRoleFilter(nextProps),
      readonly: (nextProps.viewFteValue || nextProps.initialReadonly),
      viewAllocations: (
        this.state.sticky ||
        nextProps.highlightResource &&
        nextProps.initialRole.resourceAllocations.find( ra=> ra.resourceId === nextProps.highlightResource))
    }, () => {
      this.setState({
        // sticky: false
        // filterExcludes: !this.matchRoleFilter(nextProps),
        // readonly: false,
        // role: nextProps.initialRole
      })
    })
  },

  removeAllocation: function(allocationIdx) {
    return () => this.setState(update(this.state,
      {role: {resourceAllocations: {$splice: [[allocationIdx, 1]]}}}), this.updated)
  },

  duplicateAllocation: function(allocationIdx) {
    return () => {
      const newState = update(this.state,
        {
          sticky: {$set: true},
          role: {resourceAllocations: {$splice:
            [[allocationIdx, 0, clone(this.state.role.resourceAllocations[allocationIdx])]]}}
        })
      this.setState(newState, this.updated)
    }
  },

  allocationResourceUpdated: function(allocationIdx, resourceId) {
    const { resources } = this.props

    const allocation = this.state.role.resourceAllocations[allocationIdx]
    const resource = Utils.resourceById(resourceId, resources)
    const updateLocation = (allocationIdx, locationId, updateRate) => () => {
      this.allocationLocationUpdated(allocationIdx, locationId, updateRate)
    }
    const rate = resource.billRate || allocation.rate
    this.setState(
      update(this.state,  {role: {resourceAllocations: {[allocationIdx]: {
        resourceId: {$set: resourceId},
        rate: {$set: rate }
      }}}}),
      updateLocation(allocationIdx, resource.location, !resource.billRate)
    )
  },

  allocationLocationUpdated: function(allocationIdx, locationId, updateRate = true) {
    const rate = (updateRate) ? this.locationRate(locationId) : this.state.role.resourceAllocations[allocationIdx].rate
    this.setState(
      update(this.state, {role: {resourceAllocations: {[allocationIdx]: {
        locationId: {$set: locationId},
        rate: {$set: rate}
      }}}}),
      this.updated)
  },

  locationRate: function(locationId, contract='P') {
    const { locationRates, locations } = this.props
    const location = locations.find(l => l._id === locationId)
    let rates = locationRates[location.city]
    if (!rates) rates = locationRates[location.country]
    if (!rates) rates = locationRates.defaults
    return rates[contract]
  },

  allocationRateUpdated: function(allocationIdx, rate) {
    this.setState(
      update(this.state, {role: {resourceAllocations: {[allocationIdx]: {rate: {$set: rate}}}}}),
      this.updated
    )
  },

  addResourceAllocation: function() {
    this.setState(
      update(this.state, {
        sticky: {$set: true},
        role: {resourceAllocations: {$push: [BudgetUtils.emptyAllocation()] }}}),
      this.updated
    )
  },

  hideAllocations: function() {
    this.setState({
      viewAllocations: false
    })
  },

  splitAllocation: function(allocationIdx, month) {
    return () => {
      const alloc = this.state.role.resourceAllocations[allocationIdx]
      this.setState(update(this.state, {
        role: {resourceAllocations: {
          $splice: [[allocationIdx, 1, this.zeroMonths(alloc, month), this.zeroMonths(alloc, (month - 1) * -1)]],
        }},
      }))
    }
  },

  zeroMonths: function(alloc, month) {
    const inc = month / Math.abs(month)

    const newAlloc = clone(alloc)
    for (let i = Math.abs(month); i < 12 && i >= 0; i += inc) {
      newAlloc.forecast[i] = 0
      newAlloc.actuals[i] = 0
    }

    return newAlloc
  },

  render: function() {
    if (typeof this.state.role.resourceAllocations.forecast === 'undefined') {
      update(this.state, {role: {resourceAllocations: {
        'forecast': {$set: BudgetUtils.nilForecast()}
      }}})
    }
    const { role, readonly, filterExcludes } = this.state
    const { roleIdx, locations, setRoleFilter, viewFteValue } = this.props
    if (filterExcludes) return null
    const roleUpdated = (val) => {
      this.state.role.role = val
      this.updated()
    }
    const locationUpdated = (val) => {
      const rate = this.locationRate(val)
      this.setState(update(this.state, {role: {
        location: {$set: val},
        rate: {$set: rate}
      }}), this.updated)
    }
    const rateUpdated = (val) => {
      this.state.role.rate = val
      this.updated()
    }
    const key = 'fte_'+roleIdx
    const fteTotal = BudgetUtils.roleFteYearTotal(role, viewFteValue)
    return (
      <tbody className={classNames(this.props.className, 'role-row', (roleIdx % 2 == 0)?'even':'odd')}>
        <tr className={'role'}>
          <td className={'roleName'}>
            <button onClick={this.toggleViewAllocations}>{this.state.viewAllocations?'-':'+'}</button>
            {/*<ContextMenuWrapper items={[['Filter on \''+role.role+'\'', ()=>setFilter('role', role.role)]]}>*/}
              <EditableInput initialContent={role.role} onComplete={roleUpdated}/>
            {/*</ContextMenuWrapper>*/}
          </td>
          <td className={'location'}>
            <EditableDropDown
              controlKey={key+'location'}
              initialValue={role.location}
              labels={locations.map(l => l.name)}
              values={locations.map(l => l._id)}
              onChange={locationUpdated}
            />
          </td>
          <td className={'rate'}>
            <EditableInput initialContent={role.rate} allowInlineEdit={!readonly}
                           initialReadonly={true} onComplete={rateUpdated}/>
          </td>
          <td className={'budgetedForecastActual'}>Budgeted</td>
          {role.fteRequirement.map((fte, month) =>
            <FteCell
              key={key+month}
              fte={fte}
              rate={role.rate || ''}
              viewFteValue={viewFteValue}
              edit={helper.editFteCell.bind(this, month, 'fte', null)}
              editNext={helper.editNextFteCell.bind(this, month, 'fte', null)}
              editPrevious={helper.editPreviousFteCell.bind(this, month, 'fte', null)}
              editDown={helper.editDownRow.bind(this, month, 'fte', null)}
              editUp={helper.editUpRow.bind.bind(this, month, 'fte', null)}
              isEditing={helper.isEditingFteCell.bind(this, month, 'fte', null)}
              cancelEdit={helper.cancelEditFteCell.bind(this, month, 'fte', null)}
              onChange={helper.onChangeFteCell.bind(this, month, 'fte', null)}
              fillRight={helper.fillRight.bind(this, month, 'fte', null)}
              fillLeft={helper.fillLeft.bind(this, month, 'fte', null)}
            />
          )}
          <td className={classNames('fte', 'total')}>{fteTotal}</td>
          <td className={'actions'}>{this.renderRoleActions()}</td>
        </tr>

        {(this.state.viewAllocations && role.resourceAllocations) &&
          role.resourceAllocations.map( (a, idx) => this.renderAllocation(a, idx))}
        {(this.state.viewAllocations && role.resourceAllocations) && this.renderAllocationsTotals()}
        {(this.state.viewAllocations) && this.renderRoleAllocationButtons()}
      </tbody>
    )
  },

  renderRoleAllocationButtons: function() {
    return (
      <tr className={'allocationButtons'}>
        <td colSpan={18}><button onClick={this.addResourceAllocation}>Add Allocation</button></td>
      </tr>
    )
  },

  renderAllocation: function(allocation, allocationIdx) {
    return ['forecast', 'actuals'].map(type => this.renderResourceAllocations(type, allocation, allocationIdx))
  },

  renderAllocationsTotals: function() {
    return ['forecast', 'actuals'].map(type => this.renderAllocationsTotal(type))
  },

  renderResourceAllocations: function(type, allocation, allocationIdx) {

    const { readonly } = this.state
    const { roleIdx, locations, resources, viewResourceSummary, viewFteValue } = this.props
    const key = type+'_'+roleIdx+'_'+allocationIdx
    const rate = allocation.rate || 0
    const total = allocation[type].reduce(
      (t, a) => (this.props.viewFteValue) ? t + (rate * new Number(a || 0)) : t + new Number(a || 0), 0)
    const className = (allocationIdx % 2 == 0) ? 'even' : 'odd'
    const resource = Utils.resourceById(allocation.resourceId, resources)
    const loc = (allocation.locationId) ? allocation.locationId : ((resource) ? resource.location : '')
    return (
      <tr className={classNames(className, 'allocation')} ref={(n) => {}} key={key}>
        {(type === 'forecast') &&
          [
            <td className={'resource'} key={key+'_resource'} rowSpan={2}>
              {/*<ContextMenuWrapper items={[*/}
                  {/*['View summary for \''+Utils.resourceName(resource)+'\'', viewResourceSummary(allocation.resourceId)]*/}
              {/*]}>*/}
                <EditableDropDown
                  controlKey={key}
                  allowInlineEdit={!readonly}
                  className={classNames({highlight: allocation.resourceId === this.props.highlightResource})}
                  initialValue={allocation.resourceId}
                  values={this.props.resources.map(r => r._id)}
                  labels={this.props.resources.map(r => r.firstName + ' ' + r.surname)}
                  onChange={this.allocationResourceUpdated.bind(this, allocationIdx)}
                />
              {/*</ContextMenuWrapper>*/}
              {(allocation.resourceId) && <button onClick={viewResourceSummary(allocation.resourceId)}>{String.fromCharCode(128065)}</button>}
            </td>,
            <td className={'location'} key={key+'location'} rowSpan={2}>
              <EditableDropDown
                controlKey={key}
                allowInlineEdit={!readonly}
                initialValue={loc}
                labels={locations.map(l => l.name)}
                values={locations.map(l => l._id)}
                onComplete={this.allocationLocationUpdated.bind(this, allocationIdx)}
              />
            </td>
          ]
        }

        {(type === 'forecast') &&
          <td className={'rate'} rowSpan={2}>
            <EditableInput initialContent={allocation.rate} allowInlineEdit={!readonly}
                           onComplete={this.allocationRateUpdated.bind(this, allocationIdx)}
                           className={'forecast_rate_'+allocationIdx}/>
          </td>
        }
        <td className={'forecastActuals'}>{(type === 'forecast') ? 'Forecast' : 'Actuals'}</td>
        {allocation[type].map((fte, month) =>
          <FteCell className={classNames({over: (!viewFteValue && fte > 1)})}
                   key={this.allocationRefGen(allocationIdx, type, month)}
                   viewFteValue={viewFteValue}
                   fte={fte}
                   rate={rate}
                   split={this.splitAllocation(allocationIdx, month)}
                   edit={helper.editFteCell.bind(this, month, type, allocationIdx)}
                   editNext={helper.editNextFteCell.bind(this, month, type, allocationIdx)}
                   editPrevious={helper.editPreviousFteCell.bind(this, month, type, allocationIdx)}
                   editDown={helper.editDownRow.bind(this, month, type, allocationIdx)}
                   editUp={helper.editUpRow.bind(this, month, type, allocationIdx)}
                   isEditing={helper.isEditingFteCell.bind(this, month, type, allocationIdx)}
                   cancelEdit={helper.cancelEditFteCell.bind(this, month, type, allocationIdx)}
                   onChange={helper.onChangeFteCell.bind(this, month, type, allocationIdx)}
                   fillRight={helper.fillRight.bind(this, month, type, allocationIdx)}
                   fillLeft={helper.fillLeft.bind(this, month, type, allocationIdx)}
          />
        )}
        <td className={classNames('total', 'fte')}>{total}</td>
        {(type === 'forecast') &&
          <td rowSpan={2}>
            <DeleteControl onDelete={this.removeAllocation(allocationIdx)} />
            <button onClick={this.duplicateAllocation(allocationIdx)}>{String.fromCharCode(9166)}</button>
          </td>
        }
      </tr>
    )
  },

  renderAllocationsTotal: function(type) {
    const { role } = this.state
    const { roleIdx, viewFteValue } = this.props
    const { resourceAllocations }  = role
    const monthTotals = BudgetUtils.allocationMonthTotals(resourceAllocations, type, viewFteValue)
    const roleRate = role.rate || 0
    const typeYrTotal = monthTotals.reduce( (runningTotal, monthTotal) => runningTotal + monthTotal, 0)
    const fteYrTotal = BudgetUtils.roleFteYearTotal(role, viewFteValue).valueOf()
    const key = 'role_'+roleIdx+'_'+type+'_total'
    return (
      <tr className={'total'} key={key}>
        {(type == 'forecast') && <td rowSpan={2} colSpan={3}>Total</td>}
        <td>{(type === 'forecast') ? 'Forecast' : 'Actuals'}</td>
        {monthTotals.map((monthTotal, idx) =>
          <td key={key+'_'+idx}
              className={classNames('fte', {
                over: monthTotal > (role.fteRequirement[idx] * ((viewFteValue) ? roleRate : 1))
              })}
          >{monthTotal}</td>
        )}
        <td className={classNames('fte', {over: typeYrTotal > fteYrTotal})}>{typeYrTotal}</td>
        {(type == 'forecast') && <td rowSpan={2} >&nbsp;</td>}
      </tr>
    )
  },

  focusFirstField: function() {
    this.setState({editingMonth: 0, editingType: 'fte', editingAllocationIdx: null},
      this.forceUpdate)
  },

  focusLastField: function() {
    if (this.state.viewAllocations && this.state.role.resourceAllocations > 0)
      this.setState({editingMonth: 11, editingType: 'actuals', editingAllocationIdx: this.state.role.resourceAllocations.length-1},
        this.forceUpdate)
    else
      this.setState({editingMonth: 11, editingType: 'fte', editingAllocationIdx: null},
        this.forceUpdate)

  },

  allocationRefGen: function(allocationIdx, type, month) {
    return type + '_'+this.props.roleIdx+'_'+allocationIdx+'_' + month
  },

  renderRoleActions: function() {
    return (
      <DeleteControl onDelete={this.props.deleteRole}/>
    )
  },

  toggleViewAllocations: function() {
    this.setState({
      viewAllocations: !this.state.viewAllocations
    })
    this.props.viewRoleAllocations()
  },

  matchRoleFilter: function(props) {
    const {roleFilter, resources} = props
    const {role} = this.state
    const allocResources = role.resourceAllocations.map(ra => resources.find(r=> r._id === ra.resourceId))
    const allocNames = allocResources.filter(ar => ar).map(ar => ar.firstName + ' ' + ar.surname)
    let rv
    if (!roleFilter || roleFilter === '') rv = true
    else rv =
      ((role.role && role.role.indexOf(roleFilter) != -1) ||
      (allocNames).filter(n => n.indexOf(roleFilter) != -1).length > 0)
    return rv
  }
})

export {BudgetRoleRow} // for unit testing
export default connect(
  state => {
    return {
      locations: state.staticRefData.locations.locationList,
      resources: state.staticRefData.resources.resourceList,
      locationRates: state.staticRefData.locationRates
    }
  },
  dispatch => ({
  }),
  null,
  {withRef: true}
)(BudgetRoleRow)
