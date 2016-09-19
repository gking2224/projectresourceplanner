import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { ProjectList } from '../../common/components/project/ProjectList'
import { Permissions } from '../../common/constants/permissions'

const setup = ({visible = true, projectList = [], permissions=[], user = null}) => {
  const actions = {
    dispatch: sinon.spy(),
    deleteProject: sinon.spy()
  }

  const eventArgs = {
    // preventDefault: expect.createSpy()
  }

  const projects = {
    visible: visible,
    projectList: projectList
  }

  const sessionInfo = {
    loggedOnUser: user,
    permissions: permissions
  }

  const component = shallow(
    <ProjectList {...actions} sessionInfo={sessionInfo} projects={projects}/>
  )

  return {
    component: component,
    newButton: component.findWhere(n=>n.type() === 'button' && n.contains("New")),
    noProjectsMessage: component.findWhere(n=>n.type() === 'span' && n.contains("No projects")),
    projectListItems: component.find('Project'),
    containerDiv: component.find('#projectList'),
    renderRoleActions
  }
}

describe('ProjectList component', () => {


  it('should not display if visible=false', () => {
    const { component, containerDiv } = setup({visible:false})
    expect(containerDiv).to.have.length(0)
  })

  it('should display if visible=true', () => {
    const { component, containerDiv } = setup({visible:true})
    expect(containerDiv).to.have.length(1)
  })

  it('should have <span /> no <ul> when projects undefined', () => {
    const { component, noProjectsMessage } = setup({projectList:null})
    expect(component.find('ul')).to.have.length(0);
    expect(noProjectsMessage).to.have.length(1);
  })

  it('should have <Project> for each project', () => {
    const { component, projectListItems, noProjectsMessage } = setup({projectList:['A', 'B']})
    expect(projectListItems).to.have.length(2);
    expect(noProjectsMessage).to.have.length(0);
  })

  it('should have new button if permissioned', () => {
    const { newButton } = setup({permissions:[Permissions.Project.ADD]})
    expect(newButton).to.have.length(1);
  })

  it('should not have new button if not permissioned', () => {
    const { newButton } = setup({permissions:[]})

    expect(newButton).to.have.length(0);
  })

})
