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

  contextTypes: {
    RefData: PropTypes.object
  },

  getInitialState: function () {
    return {
      role: this.props.initialRole,
      viewAllocations: this.highlightingResource(this.props.highlightResource, this.props.initialRole),
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
    const { highlightResource, roleIdx } = nextProps
    const { role, modifyingAllocations, updating } = this.state


    const highlight = this.highlightingResource(highlightResource, role)
    this.setState({viewAllocations: (highlight || modifyingAllocations || (updating && this.state.viewAllocations))})
  },

  componentWillUpdate: function(nextProps, nextState) {
  },

  componentDidUpdate: function() {
  },

  render: function() {
    if (typeof this.state.role.resourceAllocations.forecast === 'undefined') {
      update(this.state, {role: {resourceAllocations: {
        'forecast': {$set: BudgetUtils.nilForecast()}
      }}})
    }
    const { role } = this.state
    const { roleIdx, viewFteValue, readonly, setFilter } = this.props
    const { Locations, ContractTypes } = this.context.RefData

    const fieldUpdated = (field) => (val) => {
      this.state.role[field] = val
      this.updated()
    }
    const locationUpdated = (val) => {
      const { Locations } = this.context.RefData
      const rate = Locations.rateById(val, 'P')
      this.setState(update(this.state, {role: {
        location: {$set: val},
        rate: {$set: rate}
      }}), this.updated)
    }
    const key = 'fte_'+roleIdx
    const fteTotal = BudgetUtils.roleFteYearTotal(role, viewFteValue)
    return (
      <tbody className={classNames(this.props.className, 'role-row', (roleIdx % 2 == 0)?'even':'odd')}>
        <tr className={'role'}>
          <td className={'roleName'}>
            <button onClick={this.toggleViewAllocations}>{this.state.viewAllocations?'-':'+'}</button>
            {/*<ContextMenuWrapper items={[['Filter on \''+role.role+'\'', setFilter('role', role.role)]]}>*/}
              <EditableInput allowInlineEdit={!readonly} initialContent={role.role} onComplete={fieldUpdated('role')}/>
            {/*</ContextMenuWrapper>*/}
          </td>
          <td className={'location'}>
            <EditableDropDown
              allowInlineEdit={!readonly}
              controlKey={key+'location'}
              initialValue={role.location}
              labels={Locations.names()}
              values={Locations.ids()}
              onChange={locationUpdated}
            />
          </td>
          <td className={'contract'}>
          <EditableDropDown
            controlKey={key+'contract'}
            allowInlineEdit={!readonly}
            initialValue={role.contract}
            values={ContractTypes.codes()}
            labels={ContractTypes.codes()}
            onChange={fieldUpdated('contract')}
            />
          </td>
          <td className={'rate'}>
            <EditableInput initialContent={role.rate} allowInlineEdit={!readonly}
                           onComplete={fieldUpdated('rate')}/>
          </td>
          <td className={'budgetedForecastActual'}>Budgeted</td>
          {role.fteRequirement.map((fte, month) =>
            <FteCell
              key={key+month}
              fte={fte}
              readonly={readonly}
              rate={role.rate || ''}
              viewFteValue={viewFteValue}
              edit={helper.editFteCell.bind(this, month, 'fte', null)}
              editNext={helper.editNextFteCell.bind(this, month, 'fte', null)}
              editPrevious={helper.editPreviousFteCell.bind(this, month, 'fte', null)}
              editDown={helper.editDownRow.bind(this, month, 'fte', null)}
              editUp={helper.editUpRow.bind.bind(this, month, 'fte', null)}
              isEditing={helper.isEditingFteCell.bind(this, month, 'fte', null)}
              onCancel={helper.cancelEditFteCell.bind(this, month, 'fte', null)}
              onChange={helper.onChangeFteCell.bind(this, month, 'fte', null)}
              fillRight={helper.fillRight.bind(this, month, 'fte', null)}
              fillLeft={helper.fillLeft.bind(this, month, 'fte', null)}
            />
          )}
          <td className={classNames('fte', 'total')}>{fteTotal}</td>
          <td className={'comment'}>
            <EditableInput initialContent={role.comment} allowInlineEdit={!readonly} onComplete={fieldUpdated('comment')}/>
          </td>
          <td className={'actions'}>{this.renderRoleActions()}</td>
        </tr>

        {this.state.viewAllocations && role.resourceAllocations &&
          role.resourceAllocations.map( (a, idx) => this.renderAllocation(a, idx))}
        {this.state.viewAllocations && role.resourceAllocations && this.renderAllocationsTotals()}
        {this.state.viewAllocations && !readonly && this.renderRoleAllocationButtons()}
      </tbody>
    )
  },

  renderRoleAllocationButtons: function() {
    return (
      <tr className={'allocationButtons'}>
        <td colSpan={20}><button onClick={this.addResourceAllocation}>Add Allocation</button></td>
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

    const { roleIdx, viewResourceSummary, viewFteValue, readonly } = this.props
    const { ContractTypes, Locations, Resources } = this.context.RefData

    const key = type+'_'+roleIdx+'_'+allocationIdx
    const rate = allocation.rate || 0
    const total = allocation[type].reduce(
      (t, a) => (this.props.viewFteValue) ? t + (rate * new Number(a || 0)) : t + new Number(a || 0), 0)
    const className = (allocationIdx % 2 == 0) ? 'even' : 'odd'
    const resource = Resources.byId(allocation.resourceId)
    const resources = Resources.listAll()
    const loc = (allocation.locationId) ? allocation.locationId : ((resource) ? resource.location : '')
    return (
      <tr className={classNames(className, 'allocation')} ref={(n) => {}} key={key}>
        {(type === 'forecast') &&
          [
            <td className={'resource'} key={key+'_resource'} rowSpan={2}>
              {/*<ContextMenuWrapper items={[*/}
                  {/*['View summary for \''+Resources.displayName(resource)+'\'', viewResourceSummary(allocation.resourceId)]*/}
              {/*]}>*/}
              <EditableDropDown
                controlKey={key+'_resource'}
                allowInlineEdit={!readonly}
                className={classNames({highlight: allocation.resourceId && allocation.resourceId === this.props.highlightResource})}
                initialValue={allocation.resourceId}
                values={resources.map(r => r._id)}
                labels={resources.map(r => r.displayName)}
                onChange={this.allocationResourceUpdated(allocationIdx)} />

              {/*</ContextMenuWrapper>*/}
              {(allocation.resourceId) && <button onClick={viewResourceSummary(allocation.resourceId)}>{String.fromCharCode(128065)}</button>}
            </td>,
            <td className={'location'} key={key+'location'} rowSpan={2}>
              <EditableDropDown
                controlKey={key}
                allowInlineEdit={!readonly}
                initialValue={loc}
                values={Locations.ids()}
                labels={Locations.names()}
                onChange={this.allocationLocationUpdated(allocationIdx)}
              />
            </td>,
            <td className={'contractType'} key={key+'_contract'} rowSpan={2}>
              <EditableDropDown
                controlKey={key+'contract'}
                allowInlineEdit={!readonly}
                initialValue={allocation.contract}
                values={ContractTypes.codes()}
                labels={ContractTypes.codes()}
                onChange={this.allocationFieldUpdated(allocationIdx, 'contract')}
              />
            </td>
          ]
        }

        {(type === 'forecast') &&
          <td className={'rate'} rowSpan={2}>
            <EditableInput initialContent={allocation.rate} allowInlineEdit={!readonly}
                           onComplete={this.allocationFieldUpdated(allocationIdx, 'rate')}
                           className={'forecast_rate_'+allocationIdx}/>
          </td>
        }
        <td className={'forecastActuals'}>{(type === 'forecast') ? 'Forecast' : 'Actuals'}</td>
        {allocation[type].map((fte, month) =>
          <FteCell className={classNames({over: (!viewFteValue && fte > 1)})}
                   key={this.allocationRefGen(allocationIdx, type, month)}
                   viewFteValue={viewFteValue} readonly={readonly}
                   fte={fte} rate={rate}
                   split={this.splitAllocation(allocationIdx, month)}
                   edit={helper.editFteCell.bind(this, month, type, allocationIdx)}
                   editNext={helper.editNextFteCell.bind(this, month, type, allocationIdx)}
                   editPrevious={helper.editPreviousFteCell.bind(this, month, type, allocationIdx)}
                   editDown={helper.editDownRow.bind(this, month, type, allocationIdx)}
                   editUp={helper.editUpRow.bind(this, month, type, allocationIdx)}
                   isEditing={helper.isEditingFteCell.bind(this, month, type, allocationIdx)}
                   onCancel={helper.cancelEditFteCell.bind(this, month, type, allocationIdx)}
                   onChange={helper.onChangeFteCell.bind(this, month, type, allocationIdx)}
                   fillRight={helper.fillRight.bind(this, month, type, allocationIdx)}
                   fillLeft={helper.fillLeft.bind(this, month, type, allocationIdx)}
          />
        )}
        <td className={classNames('total', 'fte')}>{total}</td>
        <td className={'comment'}>
          <EditableInput initialContent={allocation[type].comment} allowInlineEdit={!readonly}
                         onComplete={this.allocationFieldUpdated(allocationIdx, 'comment', type)}
                         className={type+'_comment_'+allocationIdx}/>
        </td>
        {(type === 'forecast') &&
          <td rowSpan={2}>
            {!readonly && <DeleteControl onDelete={this.removeAllocation(allocationIdx)} />}
            {!readonly && <button onClick={this.duplicateAllocation(allocationIdx)}>{String.fromCharCode(9166)}</button>}
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
        {(type == 'forecast') && <td rowSpan={2} colSpan={4}>Total</td>}
        <td>{(type === 'forecast') ? 'Forecast' : 'Actuals'}</td>
        {monthTotals.map((monthTotal, idx) =>
          <td key={key+'_'+idx}
              className={classNames('fte', {
                over: monthTotal > (role.fteRequirement[idx] * ((viewFteValue) ? roleRate : 1))
              })}
          >{monthTotal}</td>
        )}
        <td className={classNames('fte', {over: typeYrTotal > fteYrTotal})}>{typeYrTotal}</td>
        {(type == 'forecast') && <td rowSpan={2} colSpan={2} >&nbsp;</td>}
      </tr>
    )
  },

  focusFirstField: function() {
    this.setState({editingMonth: 0, editingType: 'fte', editingAllocationIdx: null})
  },

  focusLastField: function() {
    const { viewAllocations, role } = this.state
    if (viewAllocations && role.resourceAllocations.length > 0)
      this.setState({editingMonth: 11, editingType: 'actuals', editingAllocationIdx: this.state.role.resourceAllocations.length-1})
    else
      this.setState({editingMonth: 11, editingType: 'fte', editingAllocationIdx: null})

  },

  allocationRefGen: function(allocationIdx, type, month) {
    return type + '_'+this.props.roleIdx+'_'+allocationIdx+'_' + month
  },

  renderRoleActions: function() {
    const { readonly } = this.props
    return (
      (!readonly) ? <DeleteControl onDelete={this.props.deleteRole}/> : <span></span>
    )
  },

  toggleViewAllocations: function() {
    const currentlyVisible = this.state.viewAllocations
    this.setState({
      updating: false,
      viewAllocations: !currentlyVisible,
      modifyingAllocations: (currentlyVisible) ? false : this.state.modifyingAllocations
    })
    if (!currentlyVisible) this.props.viewRoleAllocations()
  },

  updated: function() {
    this.setState({updating: true}, this.props.roleUpdated(this.state.role))
  },

  highlightingResource: function(highlight = this.props.highlightResource, role = this.state.role) {
    return highlight && role.resourceAllocations.find( ra => ra.resourceId === highlight)
  },

  removeAllocation: function(allocationIdx) {
    return () => this.setState(update(this.state,
      {modifyingAllocations: {$set: true}, role: {resourceAllocations: {$splice: [[allocationIdx, 1]]}}}), this.updated)
  },

  duplicateAllocation: function(allocationIdx) {
    return () => {
      const dupe = clone(this.state.role.resourceAllocations[allocationIdx])
      this.setState(update(this.state, {
          role: {resourceAllocations: {$splice:[[allocationIdx, 0, dupe]]}},
          modifyingAllocations: {$set: true}
        })
        , this.updated)
    }
  },

  allocationResourceUpdated: function(allocationIdx) {
    const updateLocation = this.allocationLocationUpdated(allocationIdx)
    return (resourceId) => {
      const { Resources } = this.context.RefData

      const allocation = this.state.role.resourceAllocations[allocationIdx]
      const resource = Resources.byId(resourceId)
      const rate = resource.billRate || allocation.rate
      this.setState(
        update(this.state, {
          role: {resourceAllocations: {[allocationIdx]: {resourceId: {$set: resourceId}, rate: {$set: rate}}}}}),
        updateLocation(resource.location, !resource.billRate)
      )
    }
  },

  allocationLocationUpdated: function(allocationIdx) {
    return (locationId, updateRate = true) => {
      const {Locations} = this.context.RefData
      const { role } = this.state

      const rate = (updateRate) ? Locations.rateById(locationId, 'P') : role.resourceAllocations[allocationIdx].rate
      this.setState(
        update(this.state, {
          role: {resourceAllocations: {[allocationIdx]: {locationId: {$set: locationId}, rate: {$set: rate}}}}}),
        this.updated)
    }
  },


  allocationFieldUpdated: function(allocationIdx, field, type) {
    return (value) => {
      if (type) {
        this.setState(
          update(this.state, {role: {resourceAllocations: {[allocationIdx]: {[type]: {[field]: {$set: value}}}}}}),
          this.updated
        )
      }
      else {
        this.setState(
          update(this.state, {role: {resourceAllocations: {[allocationIdx]: {[field]: {$set: value}}}}}),
          this.updated
        )
      }
    }
  },


  addResourceAllocation: function() {
    this.setState(
      update(this.state, {
        modifyingAllocations: {$set: true},
        role: {resourceAllocations: {$push: [BudgetUtils.emptyAllocation()] }}}),
      this.updated
    )
  },

  hideAllocations: function() {
    if (!this.highlightingResource())
      this.setState({updating: false, viewAllocations: false, modifyingAllocations: false})
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
  }
})

export {BudgetRoleRow}
