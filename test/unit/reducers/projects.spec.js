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
    expect(stateAfter.projectList).to.exist
  })

  it(`should handle ${ActionTypes.PROJECT_SAVED} action`, () => {
    const stateBefore = {
      projectList: [],
    }
    const newProjectName = 'New Projddddect'
    const project = { _id: '123', name: newProjectName }
    const action = ProjectActions.projectSaved({ project })
    const expectedAfter = {
      projectList: [project],
    }

    deepFreeze(stateBefore)
    deepFreeze(action)

    const stateAfter = projects(stateBefore, action)
    expect(stateAfter).to.eql(expectedAfter)
  })

  it(`should handle ${ActionTypes.PROJECT_DELETED} action`, () => {
    const projectName = 'a'
    const stateBefore = {
      addingNewProject: null,
      projectList: [projectName],
    }
    const action = ProjectActions.projectDeleted(projectName)
    const expectedAfter = {
      addingNewProject: null,
      projectList: [],
    }

    deepFreeze(stateBefore)
    deepFreeze(action)
    const stateAfter = projects(stateBefore, action)
    expect(stateAfter).to.eql(expectedAfter)
  })
})
