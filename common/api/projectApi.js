
import Datastore from 'nedb'

import { upsertOptions, errHandler } from '.'
import { Server } from '../utils'

const datastore = new Datastore('data/projects2.db')

datastore.loadDatabase(errHandler)

const SERVICE = 'projects'

const ProjectApi = {

  loadProjects: (sessionInfo, xhr) => Server.doGet({service: SERVICE, resource: '/projects', xhr, sessionInfo}),

  loadProject: (projectId, sessionInfo, xhr) => Server.doGet(
    {service: SERVICE, resource: `/projects/${projectId}`, sessionInfo, xhr}),

  saveProject: (project, sessionInfo, xhr) => {
    let resource = '/projects'
    if (project._id) {
      resource = `${resource}/${project._id}`
      return Server.doPut({service: SERVICE, resource, body: project, sessionInfo, xhr})
    }
    else {
      return Server.doPost({service: SERVICE, resource, body: project, sessionInfo, xhr})
    }
  },
  deleteProject: (projectId, sessionInfo, xhr) =>
    Server.doDelete({service: SERVICE, resource: `/projects/${projectId}`, sessionInfo, xhr}),

}

export default ProjectApi
