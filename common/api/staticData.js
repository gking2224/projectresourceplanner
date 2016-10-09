
import { Server } from '../utils'

const StaticData = {
  getLocations: xhr => Server.doGet({service: 'refdata', resource: '/locations', xhr}),
  getResources: xhr => Server.doGet({service: 'refdata', resource: '/resources', xhr}),
}
export default StaticData
