import { expect } from 'chai'
import deepFreeze from 'deep-freeze'
import sinon from 'sinon'
import reducer from '../../common/reducers/sessionInfo'
import * as ActionType from '../../common/constants/actionTypes'
import * as Actions from '../../common/actions/menuActions'

describe('sessionInfo reducer', () => {
  it('should provide the initial state', () => {
    const stateBefore = undefined;
    const stateAfter = reducer(stateBefore, {});
    expect(stateAfter).to.exist
    expect(stateAfter.permissions).to.exist
    expect(stateAfter.permissions).to.have.length(0)
    expect(stateAfter.loggedOnUser).to.be.null
  })

  it(`should clear credentials on ${ActionType.SIGN_OUT} action`, () => {
    const stateBefore = {
      loggedOnUser: {},
      permissions: ['x', 'y', 'z']
    }
    const action = Actions.signOut()
    const expectedAfter = {
      loggedOnUser: null,
      permissions: []
    }

    deepFreeze(stateBefore)
    deepFreeze(action)

    const actualAfter = reducer(stateBefore, action);

    expect(actualAfter).to.eql(expectedAfter)
  })

  it(`should set credentials on ${ActionType.SIGN_IN} action`, () => {
    const stateBefore = {
      loggedOnUser: null,
      permissions: []
    }
    const action = Actions.signIn()

    deepFreeze(stateBefore)
    deepFreeze(action)

    const actualAfter = reducer(stateBefore, action);

    expect(actualAfter.loggedOnUser).to.not.be.null
  })
})
