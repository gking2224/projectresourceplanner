import update from 'react-addons-update'

export const NavHelper = {
  isEditingFteCell: function (month, type, allocationIdx) {
    return (
      this.state.editingMonth === month && this.state.editingType === type &&
      (
        (!this.state.editingAllocationIdx && !allocationIdx) ||
        (this.state.editingAllocationIdx === allocationIdx)
      )
    )
  },

  editFteCell: function(month, type, allocationIdx) {
    this.setState(
      {editingMonth: month, editingType: type, editingAllocationIdx: allocationIdx})
  },

  editPreviousFteCell: function(month, type, allocationIdx) {
    if (month > 0)
      this.setState({editingMonth: --month, editingType: type, editingAllocationIdx: allocationIdx},
        this.forceUpdate)
    else if (type === 'forecast' && allocationIdx == 0)
      this.setState({editingMonth: 11, editingType: 'fte', editingAllocationIdx: null},
        this.forceUpdate)
    else if (type === 'forecast' && allocationIdx > 0)
      this.setState({editingMonth: 11, editingType: 'actuals', editingAllocationIdx: --allocationIdx},
        this.forceUpdate)
    else if (type === 'actuals')
      this.setState({editingMonth: 11, editingType: 'forecast', editingAllocationIdx: allocationIdx},
        this.forceUpdate)
    else {
      this.setState({editingMonth: null, editingType: null, editingAllocationIdx: null},
        this.forceUpdate)
      this.props.focusPreviousRole()
    }
  },

  editUpRow: function(month, type, allocationIdx) {
    if (type == 'actuals') this.setState({editingType: 'forecast'}, this.forceUpdate)
    else if (type == 'forecast' && allocationIdx  > 0)
      this.setState({editingType: 'actuals', editingAllocationIdx: --allocationIdx}, this.forceUpdate)
    else if (type === 'forecast')
      this.setState({editingType: 'fte', editingAllocationIdx: null},
        this.forceUpdate)
    else {
      this.setState({editingMonth: null, editingType: null, editingAllocationIdx: null},
        this.forceUpdate)
      this.props.focusPreviousRole()
    }
  },

  editDownRow: function(month, type, allocationIdx) {
    if (type == 'forecast') this.setState({editingType: 'actuals'}, this.forceUpdate)
    else if (type === 'fte' && this.state.viewAllocations && this.state.role.resourceAllocations.length > 0)
      this.setState({editingType: 'forecast', editingAllocationIdx: 0}, this.forceUpdate)
    else if (type === 'actuals' && this.state.role.resourceAllocations.length > (allocationIdx+1))
      this.setState({editingType: 'forecast', editingAllocationIdx: ++allocationIdx}, this.forceUpdate)
    else {
      this.setState({editingMonth: null, editingType: null, editingAllocationIdx: null},
        this.forceUpdate)
      this.props.focusNextRole()
    }
  },

  editNextFteCell: function(month, type, allocationIdx) {
    if (month < 11)
      this.setState({editingMonth: (month + 1), editingType: type, editingAllocationIdx: allocationIdx},
        this.forceUpdate)
    else if (type === 'fte' && this.state.viewAllocations && this.state.role.resourceAllocations.length > 0)
      this.setState({editingMonth: 0, editingType: 'forecast', editingAllocationIdx: 0},
        this.forceUpdate)
    else if (type === 'forecast')
      this.setState({editingMonth: 0, editingType: 'actuals', editingAllocationIdx: allocationIdx},
        this.forceUpdate)
    else {
      this.setState({editingMonth: null, editingType: null, editingAllocationIdx: null},
        this.forceUpdate)
      this.props.focusNextRole()
    }
  },

  cancelEditFteCell: function(month, type, allocationIdx) {
    if (NavHelper.isEditingFteCell.bind(this, month, type, allocationIdx)())
      this.setState(
        {editingMonth: null, editingType: null, editingAllocationIdx: null}, this.forceUpdate)
  },

  onChangeFteCell: function(month, type, allocationIdx, val) {
    // const val =  (value == 0) ? "" : new Number(value || 0)
    switch (type) {
      case 'fte':
        this.setState(update(this.state, {role: {fteRequirement: {[month]: {$set: val}}}}), this.updated)
        break;
      default:
        this.setState(update(this.state, {role: {resourceAllocations: {[allocationIdx]: {[type]: {[month]: {$set: (val)}}}}}}), this.updated)
    }
  },

  fillRight: function(month, type, allocationIdx, val) {
    // const val =  (value == 0) ? "" : new Number(value || 0)
    let i = (month )
    let state = this.state
    for ( ; i < 12; i++) {
      switch (type) {
        case 'fte':
          state = update(state, {
            role: {fteRequirement: {[i]: {$set: val}}},
            editingMonth: {$set: null}, editingType: {$set: null}, editingAllocationIdx: {$set: null}
          })
          break;
        default:
          state = update(state, {
            role: {resourceAllocations: {[allocationIdx]: {[type]: {[i]: {$set: val}}}}},
            editingMonth: {$set: null}, editingType: {$set: null}, editingAllocationIdx: {$set: null}})
      }
    }
    this.setState(state, this.updated)
  },

  fillLeft: function(month, type, allocationIdx,val) {
    // const val =  (value == 0) ? "" : new Number(value || 0)
    let i = (month )
    let state = this.state
    for (; i >= 0; i--) {
      switch (type) {
        case 'fte':
          state = update(state, {
            role: {fteRequirement: {[i]: {$set: val}}},
            editingMonth: {$set: null}, editingType: {$set: null}, editingAllocationIdx: {$set: null}
          })
          break;
        default:
          state = update(state, {
            role: {resourceAllocations: {[allocationIdx]: {[type]: {[i]: {$set: val}}}}},
            editingMonth: {$set: null}, editingType: {$set: null}, editingAllocationIdx: {$set: null}
          })
      }
    }
    this.setState(state, this.updated)
  }
}
