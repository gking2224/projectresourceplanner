
import { Server } from '../utils'

const StaticData = {
  getLocations: (sessionInfo, xhr) => Server.doGet({service: 'refdata', resource: '/locations', sessionInfo, xhr}),
  getResources: (sessionInfo, xhr) => Server.doGet({service: 'refdata', resource: '/resources', sessionInfo, xhr}),
  getAllRefData: (sessionInfo, xhr) => Server.doGet({service: 'refdata', resource: '/all', sessionInfo, xhr}),
}
export default StaticData
