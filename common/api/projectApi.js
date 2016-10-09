
import Datastore from 'nedb'

import { upsertOptions, errHandler } from '.'
import { Server } from '../utils'

const datastore = new Datastore('data/projects2.db')

datastore.loadDatabase(errHandler)

const SERVICE = 'projects'

const ProjectApi = {

  loadProjects: xhr => Server.doGet({service: SERVICE, resource: '/projects', xhr}),

  loadProject: (projectId, xhr) => Server.doGet({service: SERVICE, resource: `/projects/${projectId}`, xhr}),

  saveProject: (project, xhr) => {
    let resource = '/projects'
    if (project._id) {
      resource = `${resource}/${project._id}`
      return Server.doPut({SERVICE, resource, body: project, xhr})
    }
    else {
      return Server.doPost({SERVICE, resource, body: project, xhr})
    }
  },
  deleteProject: (project, xhr) => Server.doDelete(
    {service: 'projects', resource: `/projects/${project._id}`, xhr}),


  //   return new Promise((fulfill, reject) => {
  //     datastore.find(crit, (err, docs) => {
  //       if (err) reject(err)
  //       else {
  //         fulfill(docs)
  //       }
  //     })
  //   })
  // },
  // saveProject: (project) => {
  //   return new Promise((fulfill, reject)=> {
  //     datastore.insert(project, (err, doc) => {
  //       if (err) reject(err)
  //       else fulfill(doc)
  //     })
  //   })
  // },
  // deleteProject: (projectId) => {
  //   return new Promise((fulfill, reject)=> {
  //     datastore.remove({_id: projectId}, {}, (err, n) => {
  //       if (err) reject(err)
  //       else if (n !== 1) reject("num deleted != 1")
  //       else fulfill()
  //     })
  //   })
  // },

  // getProjects: () => {
  //   return new Promise((fulfill, reject) => {
  //     db.projects.find({}, (err, docs) => {
  //       if (err) reject(err)
  //       else fulfill(docs)
  //     })
  //   })
  // },

  // deleteAll: () => {
  //   datastore.remove({})
  // }
}

export default ProjectApi
