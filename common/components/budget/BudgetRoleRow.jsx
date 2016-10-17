import React, { PropTypes } from 'react'
import update from 'react-addons-update'
import classNames from 'classnames'
import clone from 'clone'

import { BudgetUtils } from '../../utils'
import { FteCell } from '.'
import { EditableInput, EditableDropDown, DeleteControl } from '../widgets'
import { default as helper } from './BudgetNavigationFunctions'

class BudgetRoleRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editingMonth: -1,
      editingType: 'none',
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { role, highlightResource } = nextProps
    const { modifyingAllocations } = this.state


    const highlight = this.highlightingResource(highlightResource, role)
    const viewAllocations = highlight || modifyingAllocations || this.state.viewAllocations
    this.setState({viewAllocations})
  }

  shouldComponentUpdate = () => this.props.role !== undefined

  contractTypeUpdated = (val) => {
    const { RefData } = this.context
    const locationId = this.props.role.locationId
    const rate = RefData.Locations.rateById(locationId, val)
    this.updated({contract: {$set: val}, rate: {$set: rate}})
  }

  fieldUpdated = field => val => this.updated({[field]: {$set: val}})

  locationUpdated = (val) => {
    const { RefData } = this.context
    const contractType = this.props.role.contractType
    const rate = RefData.Locations.rateById(val, contractType)
    this.updated({locationId: {$set: val}, rate: {$set: rate}})
  }

  focusFirstField = () => {
    this.setState({editingMonth: 0, editingType: 'fte', editingAllocationIdx: null})
  }

  focusLastField = () => {
    const { viewAllocations, role } = this.state
    if (viewAllocations && role.allocations.length > 0) {
      this.setState({editingMonth: 11, editingType: 'actuals', editingAllocationIdx: role.allocations.length - 1})
    } else {
      this.setState({editingMonth: 11, editingType: 'fte', editingAllocationIdx: null})
    }
  }

  allocationRefGen = (allocationIdx, type, month) => `${type}_${this.props.roleIdx}_${allocationIdx}_${month}`

  allocationLocation = (allocation) => {
    if (allocation) return allocation.locationId
    else return null
  }

  resourceLocation = (resource) => {
    if (resource) return resource.locationId
    else return null
  }

  toggleViewAllocations = () => {
    const currentlyVisible = this.state.viewAllocations
    this.setState({
      updating: false,
      viewAllocations: !currentlyVisible,
      modifyingAllocations: (currentlyVisible) ? false : this.state.modifyingAllocations,
    })
    if (!currentlyVisible) this.props.collapseOtherRoles()
  }

  updated = updateSpec => this.props.roleUpdated(updateSpec)

  updatedFunc = updateSpec => () => this.updated(updateSpec)

  highlightingResource = (highlight = this.props.highlightResource, role = this.props.role) =>
    highlight && role.allocations.find(ra => ra.resourceId === highlight)

  removeAllocation = allocationIdx => () =>
    this.setState(update(this.state, {modifyingAllocations: {$set: true}}),
      this.updatedFunc({allocations: {$splice: [[allocationIdx, 1]]}}))

  duplicateAllocation = allocationIdx => () => {
    const dupe = clone(this.props.role.allocations[allocationIdx])
    dupe._id = null

    this.setState(update(this.state, {modifyingAllocations: {$set: true}}),
      this.updatedFunc({allocations: {$splice: [[allocationIdx, 0, dupe]]}}))
  }

  allocationResourceUpdated = allocationIdx => (resourceId) => {
    const { Resources } = this.context.RefData

    const allocation = this.props.role.allocations[allocationIdx]
    const resource = Resources.byId(resourceId)
    this.updated({allocations: {[allocationIdx]: {
      resourceId: {$set: resourceId},
      rate: {$set: resource.billRate || allocation.rate},
      locationId: {$set: resource.locationId || allocation.locationId},
      contractType: {$set: resource.contractType || allocation.contractType},
    }}})
  }

  allocationLocationUpdated = allocationIdx => (locationId, updateRate = true) => {
    const {Locations} = this.context.RefData
    const { role } = this.props

    const contractType = role.allocations[allocationIdx].contractType
    const rate = (updateRate) ? Locations.rateById(locationId, contractType) : role.allocations[allocationIdx].rate

    this.updated({allocations: {[allocationIdx]: {locationId: {$set: locationId}, rate: {$set: rate}}}})
  }

  allocationFieldUpdated = (allocationIdx, field, type) => (value) => {
    if (type) {
      this.updated({allocations: {[allocationIdx]: {[type]: {[field]: {$set: value}}}}})
    } else {
      this.updated({allocations: {[allocationIdx]: {[field]: {$set: value}}}})
    }
  }

  addAllocation = () => {
    this.setState(
      update(this.state, {modifyingAllocations: {$set: true}},
        this.updated({allocations: {$push: [BudgetUtils.emptyAllocation()] }}))
    )
  }

  allocationContractTypeUpdated = allocationIdx => (contractType) => {
    const {Locations} = this.context.RefData
    const { role } = this.props

    const locationId = role.allocations[allocationIdx].locationId
    const rate = Locations.rateById(locationId, contractType)

    this.updated({allocations: {[allocationIdx]: {
      locationId: {$set: locationId},
      rate: {$set: rate},
      contractType: {$set: contractType},
    }}})
  }

  fteTotalReducer = rate => (total, fte) => {
    if (this.props.viewFteValue) return total + (rate * Number(fte || 0))
    return total + Number(fte || 0)
  }

  hideAllocations = () => {
    if (!this.highlightingResource()) {
      this.setState({updating: false, viewAllocations: false, modifyingAllocations: false})
    }
  }

  splitAllocation = (allocationIdx, month) => () => {
    const alloc = this.props.role.allocations[allocationIdx]
    this.updated({allocations: {
      $splice: [[allocationIdx, 1, this.zeroMonths(alloc, month), this.zeroMonths(alloc, (month - 1) * -1)]],
    }})
  }

  zeroMonths = (alloc, month) => {
    const inc = month / Math.abs(month)

    const newAlloc = clone(alloc)
    for (let i = Math.abs(month); i < 12 && i >= 0; i += inc) {
      newAlloc.forecast[i] = 0
      newAlloc.actuals[i] = 0
    }

    return newAlloc
  }

  updateState = (spec) => {
    this.setState(update(this.state, spec))
  }

  renderRoleAllocationButtons = () => (
    <tr className={'allocationButtons'}>
      <td colSpan={20}><button onClick={this.addAllocation}>Add Allocation</button></td>
    </tr>
  )

  renderAllocation = (allocation, allocationIdx) =>
    ['forecast', 'actuals'].map(type => this.renderAllocations(type, allocation, allocationIdx))

  renderAllocationsTotals = () => ['forecast', 'actuals'].map(type => this.renderAllocationsTotal(type))

  renderAllocations = (type, allocation, allocationIdx) => {

    const { roleIdx, viewResourceSummary, viewFteValue, readonly } = this.props
    const { ContractTypes, Locations, Resources } = this.context.RefData

    const key = `${type}_${roleIdx}_${allocationIdx}`
    const rate = allocation.rate || 0
    const total = allocation[type].reduce(this.fteTotalReducer(rate), 0)
    const className = (allocationIdx % 2 === 0) ? 'even' : 'odd'
    const resource = Resources.byId(allocation.resourceId)
    const resources = Resources.listAll()
    const loc = this.allocationLocation(allocation) || this.resourceLocation(resource)
    return (
      <tr className={classNames(className, 'allocation')} ref={() => {}} key={key}>
        {(type === 'forecast') &&
          [
            <td className={'resource'} key={`${key}_resource`} rowSpan={2}>
              <EditableDropDown
                controlKey={`${key}_resource`}
                allowInlineEdit={!readonly}
                className={classNames(
                  {highlight: allocation.resourceId && allocation.resourceId === this.props.highlightResource})}
                initialValue={allocation.resourceId}
                values={resources.map(r => r._id)}
                labels={resources.map(r => r.displayName)}
                onChange={this.allocationResourceUpdated(allocationIdx)}
              />
              {(allocation.resourceId) &&
                <button onClick={viewResourceSummary(allocation.resourceId)}>{String.fromCharCode(128065)}</button>
              }
            </td>,
            <td className={'location'} key={`${key}_location`} rowSpan={2}>
              <EditableDropDown
                controlKey={key}
                allowInlineEdit={!readonly}
                initialValue={loc}
                values={Locations.ids()}
                labels={Locations.names()}
                onChange={this.allocationLocationUpdated(allocationIdx)}
              />
            </td>,
            <td className={'contractType'} key={`${key}_contract`} rowSpan={2}>
              <EditableDropDown
                controlKey={`${key}_contract`}
                allowInlineEdit={!readonly}
                initialValue={allocation.contractType}
                values={ContractTypes.codes()}
                labels={ContractTypes.codes()}
                onChange={this.allocationContractTypeUpdated(allocationIdx)}
              />
            </td>,
          ]
        }

        {(type === 'forecast') &&
          <td className={'rate'} rowSpan={2}>
            <EditableInput
              initialContent={allocation.rate}
              allowInlineEdit={!readonly}
              onComplete={this.allocationFieldUpdated(allocationIdx, 'rate')}
            />
          </td>
        }
        <td className={'forecastActuals'}>{(type === 'forecast') ? 'Forecast' : 'Actuals'}</td>
        {allocation[type].map((fte, month) =>
          <FteCell
            className={classNames({over: (!viewFteValue && fte > 1)})}
            key={this.allocationRefGen(allocationIdx, type, month)}
            viewFteValue={viewFteValue} readonly={readonly}
            fte={fte} rate={rate}
            month={month} type={type} allocationIdx={allocationIdx}
            updateState={this.updateState}
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

        {(type === 'forecast') &&
        <td className={'comment'} rowSpan={2}>
          <EditableInput
            initialContent={allocation.comment}
            allowInlineEdit={!readonly}
            onComplete={this.allocationFieldUpdated(allocationIdx, 'comment')}
            className={'allocation_comment'}
          />
        </td>}
        {(type === 'forecast') &&
          <td rowSpan={2}>
            {!readonly && <DeleteControl onDelete={this.removeAllocation(allocationIdx)} />}
            {!readonly &&
              <button onClick={this.duplicateAllocation(allocationIdx)}>{String.fromCharCode(9166)}</button>}
          </td>
        }
      </tr>
    )
  }

  renderAllocationsTotal = (type) => {
    const { roleIdx, viewFteValue, role } = this.props
    const { allocations } = role
    const monthTotals = BudgetUtils.allocationMonthTotals(allocations, type, viewFteValue)
    const roleRate = role.rate || 0
    const typeYrTotal = monthTotals.reduce((runningTotal, monthTotal) => runningTotal + monthTotal, 0)
    const fteYrTotal = BudgetUtils.roleFteYearTotal(role, viewFteValue).valueOf()
    const key = `role_${roleIdx}_${type}_total`
    return (
      <tr className={'total'} key={key}>
        {(type === 'forecast') && <td rowSpan={2} colSpan={4}>Total</td>}
        <td>{(type === 'forecast') ? 'Forecast' : 'Actuals'}</td>
        {monthTotals.map((monthTotal, idx) =>
          <td
            key={`${key}_${idx}`}
            className={classNames('fte', {
              over: monthTotal > (role.ftes[idx] * ((viewFteValue) ? roleRate : 1)),
            })}
          >{monthTotal}</td>
        )}
        <td className={classNames('fte', {over: typeYrTotal > fteYrTotal})}>{typeYrTotal}</td>
        {(type === 'forecast') && <td rowSpan={2} colSpan={2} >&nbsp;</td>}
      </tr>
    )
  }

  renderRoleActions = () => {
    const { readonly } = this.props
    return (
      (!readonly) ? <DeleteControl onDelete={this.props.deleteRole} /> : <span />
    )
  }

  render() {
    const { role } = this.props
    const { roleIdx, viewFteValue, readonly } = this.props
    const { Locations, ContractTypes } = this.context.RefData

    const key = `fte_${roleIdx}`
    const fteTotal = BudgetUtils.roleFteYearTotal(role, viewFteValue)
    return (
      <tbody className={classNames(this.props.className, 'role-row', (roleIdx % 2 === 0) ? 'even' : 'odd')}>
        <tr className={'role'}>
          <td className={'roleName'}>
            <button onClick={this.toggleViewAllocations}>{this.state.viewAllocations ? '-' : '+'}</button>
            {/* <ContextMenuWrapper items={[['Filter on \''+role.role+'\'', setFilter('role', role.role)]]}>*/}
            <EditableInput
              allowInlineEdit={!readonly}
              initialContent={role.name}
              onComplete={this.fieldUpdated('name')}
            />
            {/* </ContextMenuWrapper>*/}
          </td>
          <td className={'location'}>
            <EditableDropDown
              allowInlineEdit={!readonly}
              controlKey={`${key}_location`}
              initialValue={role.locationId}
              labels={Locations.names()}
              values={Locations.ids()}
              onChange={this.locationUpdated}
            />
          </td>
          <td className={'contract'}>
            <EditableDropDown
              controlKey={`${key}_contract`}
              allowInlineEdit={!readonly}
              initialValue={role.contract}
              values={ContractTypes.codes()}
              labels={ContractTypes.codes()}
              onChange={this.contractTypeUpdated}
            />
          </td>
          <td className={'rate'}>
            <EditableInput
              initialContent={role.rate}
              allowInlineEdit={!readonly}
              onComplete={this.fieldUpdated('rate')}
            />
          </td>
          <td className={'budgetedForecastActual'}>Budgeted</td>
          {role.ftes.map((fte, month) =>
            <FteCell
              key={key + month}
              fte={fte}
              readonly={readonly}
              rate={role.rate || ''}
              viewFteValue={viewFteValue}
              edit={helper.editFteCell.bind(this, month, 'fte', null)}
              editNext={helper.editNextFteCell.bind(this, month, 'fte', null)}
              editPrevious={helper.editPreviousFteCell.bind(this, month, 'fte', null)}
              editDown={helper.editDownRow.bind(this, month, 'fte', null)}
              editUp={helper.editUpRow.bind(this, month, 'fte', null)}
              isEditing={helper.isEditingFteCell.bind(this, month, 'fte', null)}
              onCancel={helper.cancelEditFteCell.bind(this, month, 'fte', null)}
              onChange={helper.onChangeFteCell.bind(this, month, 'fte', null)}
              fillRight={helper.fillRight.bind(this, month, 'fte', null)}
              fillLeft={helper.fillLeft.bind(this, month, 'fte', null)}
            />
          )}
          <td className={classNames('fte', 'total')}>{fteTotal}</td>
          <td className={'comment'}>
            <EditableInput
              initialContent={role.comment}
              allowInlineEdit={!readonly}
              onComplete={this.fieldUpdated('comment')}
            />
          </td>
          <td className={'actions'}>{this.renderRoleActions()}</td>
        </tr>

        {this.state.viewAllocations && role.allocations &&
        role.allocations.map((a, idx) => this.renderAllocation(a, idx))}
        {this.state.viewAllocations && role.allocations && this.renderAllocationsTotals()}
        {this.state.viewAllocations && !readonly && this.renderRoleAllocationButtons()}
      </tbody>
    )
  }
}

BudgetRoleRow.propTypes = {
  // MODEL
  role: PropTypes.shape({
    allocations: PropTypes.array,
    contractType: PropTypes.string,
    locationId: PropTypes.number,
  }),
  // FUNCTIONS
  roleUpdated: PropTypes.func,
  collapseOtherRoles: PropTypes.func,
  deleteRole: PropTypes.func,
  viewResourceSummary: PropTypes.func,
  // UI
  highlightResource: PropTypes.number,
  roleIdx: PropTypes.number,
  readonly: PropTypes.bool,
  viewFteValue: PropTypes.bool,
  className: PropTypes.string
}

BudgetRoleRow.contextTypes = {
  RefData: PropTypes.object
}

export default BudgetRoleRow
