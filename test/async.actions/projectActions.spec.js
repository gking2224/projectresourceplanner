import { expect } from 'chai'
import sinon from 'sinon'
import * as projectActions from '../../common/actions/projectActions'
import * as ServerAPI from '../../common/api/serverApi'
import * as GlobalActions from '../../common/actions/globalActions'
import * as ActionType from '../../common/constants/actionTypes'
import {fakeServer as fs} from '../utils/fakeServer'
// import sinonAsPromised from 'sinon-as-promised'


describe('projects reducer', () => {

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

  it(`should handle deleteProject action`, (done) => {
    const projectName = "deleted project";
    const dispatch = sinon.spy()

    const stub = sinon.stub(ServerAPI, "deleteProject")
    stub.resolves()
    projectActions.deleteProject(projectName)(dispatch)

    setTimeout(() => {
      expect(dispatch.callCount).to.equal(4)
      expect(dispatch.getCall(0).args[0].type).to.equal(ActionType.CALLING_SERVER)
      expect(dispatch.getCall(1).args[0].type).to.equal(ActionType.DELETING_PROJECT)
      expect(dispatch.getCall(2).args[0].type).to.equal(ActionType.SERVER_RETURNED)
      expect(dispatch.getCall(3).args[0].type).to.equal(ActionType.PROJECT_DELETED)
      expect(dispatch.getCall(3).args[0].project).to.equal(projectName)
      done()
    }, 5)

  })

  it(`should handle saveNewProject action`, (done) => {
    const projectName = "New Project";
    const dispatch = sinon.spy()
    const id = 999
    const stub = sinon.stub(ServerAPI, "saveProject")
    stub.resolves(id)
    projectActions.saveNewProject(projectName)(dispatch)

    setTimeout(() => {
      expect(dispatch.callCount).to.equal(4)
      expect(dispatch.getCall(0).args[0].type).to.equal(ActionType.CALLING_SERVER)
      expect(dispatch.getCall(1).args[0].type).to.equal(ActionType.SAVING_PROJECT)
      expect(dispatch.getCall(2).args[0].type).to.equal(ActionType.SERVER_RETURNED)
      expect(dispatch.getCall(3).args[0].type).to.equal(ActionType.PROJECT_SAVED)
      expect(dispatch.getCall(3).args[0].project.id).to.equal(id)
      expect(dispatch.getCall(3).args[0].project.name).to.equal(projectName)
      done()
    }, 5)

  })
})
