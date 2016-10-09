import update from 'react-addons-update'


const addRoleUpdateFte = (month, fte, roleUpdates) => {
  const rv = roleUpdates
  if (rv.ftes === undefined) rv.ftes = []
  rv.ftes[month] = {$set: fte}
  return rv
}

const addRoleUpdateallocations = (allocationIdx, type, month, fte, roleUpdates) => {

  const rv = roleUpdates
  if (rv.allocations === undefined) rv.allocations = []
  if (rv.allocations[allocationIdx] === undefined) rv.allocations[allocationIdx] = {}
  if (rv.allocations[allocationIdx][type] === undefined) rv.allocations[allocationIdx][type] = []
  rv.allocations[allocationIdx][type][month] = {$set: fte}
  return rv
}

const NavHelper = {
  isEditingFteCell(month, type, allocationIdx) {
    return (
      this.state.editingMonth === month && this.state.editingType === type &&
      (
        (!this.state.editingAllocationIdx && !allocationIdx) ||
        (this.state.editingAllocationIdx === allocationIdx)
      )
    )
  },

  editFteCell(month, type, allocationIdx) {
    this.setState(
      {editingMonth: month, editingType: type, editingAllocationIdx: allocationIdx})
  },

  editPreviousFteCell(month, type, allocationIdx) {
    if (month > 0) {
      this.setState({editingMonth: (month - 1), editingType: type, editingAllocationIdx: allocationIdx})
    }
    else if (type === 'forecast' && allocationIdx === 0) {
      this.setState({editingMonth: 11, editingType: 'fte', editingAllocationIdx: null})
    }
    else if (type === 'forecast' && allocationIdx > 0) {
      this.setState({editingMonth: 11, editingType: 'actuals', editingAllocationIdx: (allocationIdx - 1)})
    }
    else if (type === 'actuals') {
      this.setState({editingMonth: 11, editingType: 'forecast', editingAllocationIdx: allocationIdx})
    }
    else {
      this.setState({editingMonth: null, editingType: null, editingAllocationIdx: null})
      this.props.focusPreviousRole()
    }
  },

  editUpRow(month, type, allocationIdx) {
    if (type === 'actuals') this.setState({editingType: 'forecast'}, this.forceUpdate)
    else if (type === 'forecast' && allocationIdx > 0) {
      this.setState({editingType: 'actuals', editingAllocationIdx: (allocationIdx - 1)})
    }
    else if (type === 'forecast') {
      this.setState({editingType: 'fte', editingAllocationIdx: null})
    }
    else {
      this.setState({editingMonth: null, editingType: null, editingAllocationIdx: null})
      this.props.focusPreviousRole()
    }
  },

  editDownRow(month, type, allocationIdx) {
    if (type === 'forecast') this.setState({editingType: 'actuals'})
    else if (type === 'fte' && this.state.viewAllocations && this.state.role.allocations.length > 0) {
      this.setState({editingType: 'forecast', editingAllocationIdx: 0})
    }
    else if (type === 'actuals' && this.state.role.allocations.length > (allocationIdx + 1)) {
      this.setState({editingType: 'forecast', editingAllocationIdx: (allocationIdx + 1)})
    }
    else {
      this.setState({editingMonth: null, editingType: null, editingAllocationIdx: null})
      this.props.focusNextRole()
    }
  },

  editNextFteCell(month, type, allocationIdx) {
    if (month < 11) {
      this.setState({editingMonth: (month + 1), editingType: type, editingAllocationIdx: allocationIdx})
    }
    else if (type === 'fte' && this.state.viewAllocations && this.state.role.allocations.length > 0) {
      this.setState({editingMonth: 0, editingType: 'forecast', editingAllocationIdx: 0})
    }
    else if (type === 'forecast') {
      this.setState({editingMonth: 0, editingType: 'actuals', editingAllocationIdx: allocationIdx})
    }
    else {
      this.setState({editingMonth: null, editingType: null, editingAllocationIdx: null})
      this.props.focusNextRole()
    }
  },

  cancelEditFteCell(month, type, allocationIdx) {
    if (NavHelper.isEditingFteCell.bind(this, month, type, allocationIdx)()) {
      this.setState(
        {editingMonth: null, editingType: null, editingAllocationIdx: null})
    }
  },

  onChangeFteCell(month, type, allocationIdx, val) {
    // const val =  (value == 0) ? "" : new Number(value || 0)
    switch (type) {
    case 'fte':
      this.updated({ftes: {[month]: {$set: val}}})
      break;
    default:
      this.updated({allocations: {[allocationIdx]: {[type]: {[month]: {$set: (val)}}}}})
    }
  },

  fillRight(month, type, allocationIdx, val) {
    // const val =  (value == 0) ? "" : new Number(value || 0)
    let i = (month)

    const stateUpdates = {editingMonth: {$set: null}, editingType: {$set: null}, editingAllocationIdx: {$set: null}}
    let roleUpdates = {}
    for (; i < 12; i++) {
      switch (type) {
      case 'fte':
        roleUpdates = addRoleUpdateFte(i, val, roleUpdates)
        break;
      default:
        roleUpdates = addRoleUpdateallocations(allocationIdx, type, i, val, roleUpdates)
      }
    }
    this.setState(update(this.state, stateUpdates), this.updated.bind(this, roleUpdates))
  },

  fillLeft(month, type, allocationIdx, val) {
    // const val =  (value == 0) ? "" : new Number(value || 0)
    let i = month
    const stateUpdates = {editingMonth: {$set: null}, editingType: {$set: null}, editingAllocationIdx: {$set: null}}
    let roleUpdates = {}
    for (; i >= 0; i--) {
      switch (type) {
      case 'fte':
        roleUpdates = addRoleUpdateFte(i, val, roleUpdates)
        break;
      default:
        roleUpdates = addRoleUpdateallocations(allocationIdx, type, i, val, roleUpdates)
      }
    }
    this.setState(update(this.state, stateUpdates), this.updated.bind(this, roleUpdates))
  }
}

export default NavHelper
