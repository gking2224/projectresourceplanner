
import Datastore from 'nedb'

import { upsertOptions, errHandler } from '.'
import { Server } from '../utils'
import { ProjectApi } from './projectApi'

const datastore = new Datastore('data/budgets2.db')
datastore.loadDatabase(errHandler)

const SERVICE = 'budgets'

const BudgetApi = {

  getProjectBudgets: (projectId, sessionInfo, xhr) =>
    Server.doGet({service: SERVICE, resource: `/budgets/project/${projectId}`, sessionInfo, xhr}),

  getBudgets: ( sessionInfo, xhr ) => Server.doGet({service: SERVICE, resource: '/budgets', sessionInfo, xhr}),

  getBudget: (budgetId, sessionInfo, xhr) => Server.doGet({service: SERVICE, resource: `/budgets/${budgetId}`, sessionInfo, xhr}),

  saveBudget: (budget, sessionInfo, xhr) => {
    let resource = '/budgets'
    if (budget._id) {
      resource = `${resource}/${budget._id}`
      return Server.doPut({service: SERVICE, resource, body: budget, sessionInfo, xhr})
    }
    else {
      return Server.doPost({service: SERVICE, resource, body: budget, sessionInfo, xhr})
    }
  },
  deleteBudget: (budgetId, sessionInfo, xhr) =>
    Server.doDelete({service: SERVICE, resource: `budgets/${budgetId}`, sessionInfo, xhr}),

  getBudgetsReferencingResource: (resourceId, sessionInfo, xhr) =>
    Server.doGet({service: SERVICE, resource: `/budgets/resource/${resourceId}`, sessionInfo, xhr})
}
export default BudgetApi
