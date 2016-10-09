
import Datastore from 'nedb'

import { upsertOptions, errHandler } from '.'
import { Server } from '../utils'
import { ProjectApi } from './projectApi'

const datastore = new Datastore('data/budgets2.db')
datastore.loadDatabase(errHandler)

const SERVICE = 'budgets'

export const BudgetAPI = {

  getProjectBudgets: (projectId, xhr) =>
    Server.doGet({service: SERVICE, resource: `/budgets/project/${projectId}`, xhr}),

  getBudgets: xhr => Server.doGet({service: SERVICE, resource: '/budgets', xhr}),

  getBudget: (budgetId, xhr) => Server.doGet({service: SERVICE, resource: `/budgets/${budgetId}`, xhr}),

  saveBudget: (budget, xhr) => {
    let resource = '/budgets'
    if (budget._id) {
      resource = `${resource}/${budget._id}`
      return Server.doPut({service:SERVICE, resource, body: budget, xhr})
    }
    else {
      return Server.doPost({service:SERVICE, resource, body: budget, xhr})
    }
  },
  deleteBudget: (budgetId) => Server.doDelete({service: SERVICE, resource: `budgets/${budgetId}`, xhr}),

  setDefault: ({budgetId, isDefault}) => {
    return new Promise((fulfill, reject)=> {
      datastore.update({_id: budgetId}, {$set: {isDefault: isDefault}}, (err, n) => {
        if (err) reject(err)
        else if (n !== 1) reject("num deleted != 1")
        else fulfill()
      })
    })
  },

  getBudgetsReferencingResource: (resourceId, xhr) =>
    Server.doGet({service: SERVICE, resource: `/budgets/resource/${resourceId}`, xhr}),
}
