
import Datastore from 'nedb'

import { upsertOptions, errHandler } from '.'

import { ProjectAPI } from './projectApi'

const datastore = new Datastore('data/budgets2.db')
datastore.loadDatabase(errHandler)

export const BudgetAPI = {


  getBudgets: (crit = {}) => {
    return new Promise((fulfill, reject) => {
      datastore.find(crit, (err, docs) => {
        if (err) reject(err)
        else fulfill(docs)
      })
    })
  },

  saveBudget: (budget) => {
    //budget.roles.forEach(r => r.resourceAllocations.forEach(a => a.resourceId='AM1IQjCtxE9MGq3h'))
    return new Promise((fulfill, reject) => {
      datastore.update({_id: budget._id}, budget, upsertOptions, (err, n, upsert) => {
        if (err) reject(err)
        else fulfill(upsert)
      })
    })
  },
  deleteBudget: (budgetId) => {
    return new Promise((fulfill, reject)=> {
      datastore.remove({_id: budgetId}, {}, (err, n) => {
        if (err) reject(err)
        else if (n !== 1) reject("num deleted != 1")
        else fulfill()
      })
    })
  },

  setDefault: ({budgetId, isDefault}) => {
    return new Promise((fulfill, reject)=> {
      datastore.update({_id: budgetId}, {$set: {isDefault: isDefault}}, (err, n) => {
        if (err) reject(err)
        else if (n !== 1) reject("num deleted != 1")
        else fulfill()
      })
    })
  },

  getBudgetsReferencingResource: ({resourceId}) => {
    return new Promise((fulfill, reject)=> {
      datastore.find({"roles.resourceAllocations.resourceId": resourceId}, (err, budgets) => {
        if (err) reject(err)
        else {
          const projectIds = [...new Set(budgets.map(b=> b.project))]
          ProjectAPI.loadProjects({_id: {$in: projectIds}} )
            .then( (projects) => {
              fulfill({budgets, projects})
            })
            .catch( (err) => reject(err))
        }
      })
    })
  }
}
