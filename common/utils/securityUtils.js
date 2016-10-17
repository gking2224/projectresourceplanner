import { Constants } from '../constants'

const SecurityUtils = {

  isSignedIn: (sessionInfo) => (sessionInfo && sessionInfo.securityToken)

}

export default SecurityUtils
