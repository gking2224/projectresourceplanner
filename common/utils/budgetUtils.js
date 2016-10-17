import { Constants } from '../constants'

const BudgetUtils = {
  nilForecast: () => ([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),

  createNewBudget: (projectId, year) => ({projectId, year, name: 'New Budget', roles: []}),

  emptyRole: () => ({
    ftes: BudgetUtils.nilForecast(),
    allocations: [],
  }),

  emptyAllocation: () => ({
    forecast: BudgetUtils.nilForecast(),
    actuals: BudgetUtils.nilForecast()
  }),

  budgetActualsToDate(budget, reportingMonth) {
    if (budget.roles) {
      return budget.roles.reduce((t, r) => t + this.roleActualsToDate(r, reportingMonth), 0)
    }
    else return 0
  },

  roleActualsToDate(role, reportingMonth) {
    return role.allocations.reduce((t, ra) => t + this.allocationActualsToDate(ra, reportingMonth), 0)
  },

  allocationActualsToDate(alloc, reportingMonth) {
    let total = 0
    for (let i = 0; i <= reportingMonth; i++) {
      total += (Number(alloc.actuals[i] || 0) * (alloc.rate || 0))
    }
    return total
  },

  budgetRemainingForecast(budget, reportingMonth) {
    if (budget.roles) {
      return budget.roles.reduce((t, r) => t + this.roleRemainingForecast(r, reportingMonth), 0)
    }
    else return 0
  },

  roleRemainingForecast(role, reportingMonth) {
    return role.allocations.reduce((t, ra) => t + this.allocationRemainingForecast(ra, reportingMonth), 0)
  },

  allocationRemainingForecast(alloc, reportingMonth) {
    let total = 0
    for (let i = reportingMonth + 1; i < 12; i++) {
      total += (Number(alloc.forecast[i] || 0) * (alloc.rate || 0))
    }
    return total.valueOf()
  },

  fteYearTotal(budget, value = false) {
    if (budget.roles) {
      return budget.roles.reduce((t, role) => t + this.roleFteYearTotal(role, value), 0).valueOf()
    }
    else return 0
  },

  roleFteYearTotal(role, value = false) {
    return role.ftes.reduce((t, month) => t + (Number(month ||0) * ((value) ? (role.rate || 0) : 1)), 0)
  },

  budgetFteMonthTotals(budget, value = false) {
    return Constants.MONTH_INDICES.map(m => this.fteMonthTotal(budget, m, value))
  },

  fteMonthTotal(budget, month, value = false) {
    if (budget.roles) {
      return budget.roles.reduce((t, r) =>
      t + (Number(r.ftes[month] || 0) * ((value) ? (r.rate || 0) : 1)), 0).valueOf()
    }
    else return 0
  },

  allocationMonthTotals(allocations, type, value = false) {
    return Constants.MONTH_INDICES.map(month => allocations.reduce((total, ra) =>
        (total + ((Number(ra[type][month] || 0)).valueOf() * ((value) ? (ra.rate || 0) : 1))), 0)
    )
  }

}

export default BudgetUtils
