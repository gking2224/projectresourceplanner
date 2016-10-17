
import { Server } from '../utils'

const SERVICE = 'security'

const SecurityApi = {

  authenticate: (username, password, xhr) =>
    Server.doPost({service: SERVICE, resource: '/authenticate', body: {username, password}, xhr}),

  validate: (token, xhr) =>
    Server.doGet({service: SERVICE, resource: `/validate/${token}`, xhr}),

  signOut: (token, xhr) =>
    Server.doPut({service: SERVICE, resource: `/invalidate/${token}`, xhr})
}

export default SecurityApi
