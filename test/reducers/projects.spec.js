import { expect } from 'chai'
import deepFreeze from 'deep-freeze'
import sinon from 'sinon'
import reducer from '../../common/reducers/projects'
import * as ActionType from '../../common/constants/actionTypes'
import * as projectActions from '../../common/actions/projectActions'

describe('projects reducer', () => {
  it('should provide the initial state', () => {
    const stateBefore = undefined;
    const stateAfter = reducer(stateBefore, {});
    expect(stateAfter).to.exist
    expect(stateAfter.projectList).to.exist
    expect(stateAfter.addingNewProject).to.not.exist
  })

  it(`should handle ${ActionType.VIEW_PROJECTS} action`, () => {
    const stateBefore = {
      visible: false,
      addingNewProject: undefined,
      projectList:["Risk Models", "Digital"]
    }
    const action = projectActions.viewProjects()
    const expectedAfter = {
      visible: true,
      addingNewProject: undefined,
      projectList:["Risk Models", "Digital"]
    }

    deepFreeze(stateBefore)
    deepFreeze(action)

    const actualAfter = reducer(stateBefore, action);

    expect(actualAfter).to.eql(expectedAfter)
  })

  it(`should handle ${ActionType.NEW_PROJECT} action`, () => {
    const stateBefore = {
      addingNewProject: undefined,
      projectList:["Risk Models", "Digital"]
    }
    const action = projectActions.newProject()
    const expectedAfter = {
      addingNewProject: {},
      projectList:["Risk Models", "Digital"]
    }

    deepFreeze(stateBefore)
    deepFreeze(action)

    const actualAfter = reducer(stateBefore, action);

    expect(actualAfter).to.eql(expectedAfter)
  })

  it(`should handle ${ActionType.PROJECT_SAVED} action`, () => {
    const stateBefore = {
      addingNewProject: undefined,
      projectList:[]
    }
    const newProjectName = "New Project";
    const action = projectActions.projectSaved({name:newProjectName})
    const expectedAfter = {
      addingNewProject: undefined,
      projectList:[newProjectName]
    }

    deepFreeze(stateBefore)
    deepFreeze(action)

    const stateAfter = reducer(stateBefore, action)
    expect(stateAfter).to.eql(expectedAfter)

  })

  it(`should handle ${ActionType.PROJECT_DELETED} action`, () => {
    const projectName = 'a'
    const stateBefore = {
      addingNewProject: null,
      projectList:[projectName]
    }
    const action = projectActions.projectDeleted(projectName)
    const expectedAfter = {
      addingNewProject: null,
      projectList:[]
    }

    deepFreeze(stateBefore)
    deepFreeze(action)
    const stateAfter = reducer(stateBefore, action)
    expect(stateAfter).to.eql(expectedAfter)
  })
})
