import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())

import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { ProjectList } from '../../../../common/components/project/ProjectList'
import ProjectListItem from '../../../../common/components/project/ProjectListItem'
import AddProject from '../../../../common/components/project/AddProject'

import { Permissions } from '../../../../common/constants/permissions'
import { dummyContext } from '../../../utils'


const setup = ({projects = [], permissions = [], loggedOnUser = null} = {}) => {
  const actions = {
    dispatch: sinon.spy(),
    deleteProject: sinon.spy(),
    loadProjects: sinon.spy(),
    saveProject: sinon.spy(),
  }

  const eventArgs = {
    // preventDefault: expect.createSpy()
  }

  const component = shallow(
    <ProjectList {...actions} projects={projects} />,
    {context: dummyContext({loggedOnUser, permissions})}
  )

  return {
    component,
    newButton: component.find('button').filterWhere(n => n.contains('New')),
    newForm: component.find(AddProject),
    noProjectsMessage: component.find('span').filterWhere(n => n.contains('No projects')),
    projectListItems: component.find(ProjectListItem),
  }
}

describe('ProjectList component', () => {

  it('should display message when no projects undefined', () => {
    const { noProjectsMessage } = setup()
    expect(noProjectsMessage).to.have.length(1)
  })

  it('should have <ProjectListItem> for each project', () => {
    const { component, noProjectsMessage } = setup({projects: [{_id: 'A'}, {_id: 'B'}]})
    expect(component).to.have.exactly(2).descendants(ProjectListItem)
    expect(noProjectsMessage).to.have.length(0)
  })

  it('should have new button if permissioned', () => {
    const { newButton } = setup({permissions: [Permissions.Project.ADD]})
    expect(newButton).to.have.length(1)
  })

  it('should not have new button if not permissioned', () => {
    const { newButton } = setup({permissions: []})

    expect(newButton).to.have.length(0)
  })

})
