import { Constants } from '../constants'

export const BudgetUtils = {
  nilForecast: () => ([0,0,0,0,0,0,0,0,0,0,0,0]),

  createNewBudget: (projectId, year) => ({projectId, year, name: 'New Budget', roles: []}),

  emptyRole: () => ({
    ftes: BudgetUtils.nilForecast(),
    allocations: [],
  }),

  emptyAllocation: () => ({
    forecast: BudgetUtils.nilForecast(),
    actuals: BudgetUtils.nilForecast()
  }),

  budgetActualsToDate: function(budget, reportingMonth) {
    return budget.roles.reduce( (t, r) => t + this.roleActualsToDate(r, reportingMonth), 0)
  },

  roleActualsToDate: function(role, reportingMonth) {
    return role.allocations.reduce( (t, ra) => t + this.allocationActualsToDate(ra, reportingMonth), 0)
  },

  allocationActualsToDate: function(alloc, reportingMonth) {
    let total = 0
    for (let i = 0; i <= reportingMonth; i++) {
      total += (new Number(alloc.actuals[i] || 0) * (alloc.rate || 0))
    }
    return total
  },

  budgetRemainingForecast: function(budget, reportingMonth) {
    return budget.roles.reduce( (t, r) => t + this.roleRemainingForecast(r, reportingMonth), 0)
  },

  roleRemainingForecast: function(role, reportingMonth) {
    return role.allocations.reduce( (t, ra) => t + this.allocationRemainingForecast(ra, reportingMonth), 0)
  },

  allocationRemainingForecast: function(alloc, reportingMonth) {
    let total = 0
    for (let i = reportingMonth + 1; i < 12; i++) {
      total += (new Number(alloc.forecast[i] || 0) * (alloc.rate || 0))
    }
    return total.valueOf()
  },

  fteYearTotal: function(budget, value = false) {
    return budget.roles.reduce( (t, role) => t + this.roleFteYearTotal(role, value), 0).valueOf()
  },

  roleFteYearTotal: function(role, value = false) {
    return role.ftes.reduce( (t, month) => t + (new Number(month ||0) * ((value) ? (role.rate || 0) : 1)), 0)
  },

  budgetFteMonthTotals: function(budget, value = false) {
    return Constants.MONTH_INDICES.map(m => this.fteMonthTotal(budget, m, value))
  },

  fteMonthTotal: function(budget, month, value = false) {
    return budget.roles.reduce( (t, r) =>
      t + (new Number(r.ftes[month] || 0) * ((value) ? (r.rate || 0) : 1)), 0).valueOf()
  },

  allocationMonthTotals: function(allocations, type, value = false) {
    return Constants.MONTH_INDICES.map((month) => allocations.reduce((total, ra) =>
        (total + ((new Number(ra[type][month] || 0)).valueOf() * ((value) ? (ra.rate || 0) : 1))), 0)
    )
  }

}
