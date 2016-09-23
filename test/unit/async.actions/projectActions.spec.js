import { expect } from 'chai'
import sinon from 'sinon'
import { ProjectActions } from '../../../common/actions'
import { ProjectAPI } from '../../../common/api'
import { ActionTypes } from '../../../common/constants'
import { continueAfterConfirm, expectActionWithServerCallNotification } from '../../utils/test-async-utils'
import {fakeServer as fs} from '../../utils/fakeServer'
// import sinonAsPromised from 'sinon-as-promised'


describe('project async actions', () => {

  // it(`should handle saveNewProject action`, () => {
  //   const newProjectName = "New Project";
  //   const action = ProjectActions.saveNewProject(newProjectName)
  //   const dispatch = sinon.spy()
  //
  //   const savedAction = ProjectActions.projectSaved(newProjectName)
  //   action(dispatch)
  //
  //   sinon.assert.calledWith(dispatch, ...savedAction)
  //
  // })

  it('should handle deleteProject action', (done) => {
    const project = {_id: 123, name: 'deleted project'}
    const dispatch = sinon.spy()

    const stub = sinon.stub(ProjectAPI, 'deleteProject')
    stub.resolves()
    ProjectActions.deleteProject(project)(dispatch)
    const expectedAction = {
      type: ActionTypes.PROJECT_DELETED,
      payload: {projectId: project._id},
    }

    continueAfterConfirm(dispatch, 0, () => {
      expectActionWithServerCallNotification(dispatch, 1, expectedAction, done)
    })
  })

  it('should handle saveNewProject action', (done) => {
    const project = {_id: 123, name: 'New Project'}
    const dispatch = sinon.spy()
    const stub = sinon.stub(ProjectAPI, 'saveProject')
    stub.resolves(project)
    ProjectActions.saveNewProject(project.name)(dispatch)
    const expectedAction = {
      type: ActionTypes.PROJECT_SAVED,
      payload: {project},
    }
    expectActionWithServerCallNotification(dispatch, 0, expectedAction, done)

  })
})
