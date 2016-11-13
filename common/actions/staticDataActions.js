import { createAction } from 'redux-actions'

import { ActionTypes } from '../constants'
import { GlobalActions } from '.'
import { StaticData } from '../api'
import { Utils } from '../utils'

const StaticDataActions = {
  refDataLoaded: createAction(ActionTypes.REF_DATA_LOADED),

  seedRefData: (sessionInfo, xhr) => {
    const msg = 'seedRefData'
    return (dispatch) => {
      Utils.doRemoteAction(dispatch)({
        msg,
        remoteAction: () => StaticData.getAllRefData(sessionInfo, xhr),
        successAC: ({response}) => StaticDataActions.refDataLoaded(response),
        errorAC: GlobalActions.remoteError
      })
    }
  }
}
export default StaticDataActions
