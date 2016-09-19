
import Datastore from 'nedb'

import { upsertOptions, errHandler } from '.'

const datastore = new Datastore('data/projects2.db')

datastore.loadDatabase(errHandler)

export const ProjectAPI = {

  loadProjects: (crit) => {
    return new Promise((fulfill, reject) => {
      datastore.find(crit, (err, docs) => {
        if (err) reject(err)
        else {
          fulfill(docs)
        }
      })
    })
  },
  saveProject: (project) => {
    return new Promise((fulfill, reject)=> {
      datastore.insert(project, (err, doc) => {
        if (err) reject(err)
        else fulfill(doc)
      })
    })
  },
  deleteProject: (projectId) => {
    return new Promise((fulfill, reject)=> {
      datastore.remove({_id: projectId}, {}, (err, n) => {
        if (err) reject(err)
        else if (n !== 1) reject("num deleted != 1")
        else fulfill()
      })
    })
  },

  getProjects: () => {
    return new Promise((fulfill, reject) => {
      db.projects.find({}, (err, docs) => {
        if (err) reject(err)
        else fulfill(docs)
      })
    })
  },

  deleteAll: () => {
    datastore.remove({})
  }
}
