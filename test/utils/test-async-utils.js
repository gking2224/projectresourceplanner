import { expect } from 'chai'
import { ActionTypes } from '../../common/constants'

export const continueAfterConfirm = (dispatch, callIdx, func) => {
  expect(dispatch.callCount).to.equal(callIdx + 1) // callIdx + yes/no
  const action = dispatch.getCall(callIdx).args[0]
  setTimeout(() => {
    expect(action.type).to.equal(ActionTypes.DIALOG_YES_NO)
    action.payload.callback()
    func()
  }, 100)

}

export const expectActionWithServerCallNotification = (
    dispatch, callIdx, actionExpectation, notifyComplete = () => null
) => {
  setTimeout(() => {
    expect(dispatch.callCount).to.equal(callIdx + 3) // callIdx + calling server, server returned, project deleted
    expect(dispatch.getCall(callIdx++).args[0].type).to.equal(ActionTypes.CALLING_SERVER)
    expect(dispatch.getCall(callIdx++).args[0].type).to.equal(ActionTypes.SERVER_RETURNED)
    const action = dispatch.getCall(callIdx++).args[0]
    if (typeof actionExpectation === 'function') actionExpectation()
    else expect(action).to.deep.equal(actionExpectation)
    notifyComplete()

  }, 100)
}
