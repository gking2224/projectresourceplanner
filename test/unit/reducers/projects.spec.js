import { expect } from 'chai'
import deepFreeze from 'deep-freeze'

import projects from '../../../common/reducers/projects'
import { ActionTypes } from '../../../common/constants'
import { ProjectActions } from '../../../common/actions'

describe('projects reducer', () => {

  const NULL_ACTION = {}

  it('should provide the initial state', () => {
    const stateBefore = undefined
    const stateAfter = projects(stateBefore, NULL_ACTION)

    expect(stateAfter).to.exist
  })

  it(`should handle ${ActionTypes.PROJECT_SAVED} action`, () => {
    const stateBefore = {
    }
    const newProjectName = 'New Projddddect'
    const project = { _id: '123', name: newProjectName }
    const action = ProjectActions.projectSaved({ project })
    const expectedAfter = {
      123: {_id: '123', name: newProjectName}
    }

    deepFreeze(stateBefore)
    deepFreeze(action)

    const stateAfter = projects(stateBefore, action)
    expect(stateAfter).to.eql(expectedAfter)
  })

  it(`should handle ${ActionTypes.PROJECT_DELETED} action`, () => {
    const projectName = 'a'
    const stateBefore = {
      123: projectName
    }
    const action = ProjectActions.projectDeleted({projectId: 123})
    const expectedAfter = {
      123: undefined
    }

    deepFreeze(stateBefore)
    deepFreeze(action)
    const stateAfter = projects(stateBefore, action)
    expect(stateAfter).to.eql(expectedAfter)
  })
})
