import { expect } from 'chai'
import React from 'react'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { Menu } from '../../common/components/Menu'

function setup({permissions = [], user = null}) {//id, counter, childIds, parentId) {
  const actions = {
    // increment: expect.createSpy(),
    menuItemClicked: sinon.spy(),
    signIn: sinon.spy(),
    signOut: sinon.spy()
  }

  const eventArgs = {
    // preventDefault: expect.createSpy()
  }

  const menu = {
    activeItem: 'Projects',
    items: ["Projects", "Resources"]
  }

  const sessionInfo = {
    loggedOnUser: user,
    permissions: permissions
  }

  const component = shallow(
    <Menu {...actions} menu={menu} sessionInfo={sessionInfo} />
  )

  return {
    component: component,
    projectsMenuItem: component.findWhere(n => n.type() === 'li' && n.contains('Projects')),
    activeMenuItem: component.findWhere(n => n.type() === 'li' && n.hasClass('active')),
    signInLink: component.findWhere(n => n.type() === 'a' && n.contains('Sign in')),
    signOutLink: component.findWhere(n => n.type() === 'a' && n.contains('Sign out')),
    userNameDisplay: component.findWhere(n => n.type() === 'span' && n.childAt(0).text() === 'Logged in as '),
    actions
    // eventArgs: eventArgs
  }
}

describe('Menu component', () => {

  it('should display 2 menu items', () => {
    const { component } = setup({})
    expect(component.find("li")).to.have.length(2)
  })

  it('should have one <li> per menu item', () => {
    const { projectsMenuItem } = setup({})
    expect(projectsMenuItem).to.have.length(1)
  })

  it('should view projects on user click', () => {
    const { projectsMenuItem, actions } = setup({})
    projectsMenuItem.simulate('click')
    sinon.assert.calledOnce(actions.menuItemClicked)
  })

  it('should identify active item', () => {
    const { activeMenuItem } = setup({})
    expect(activeMenuItem).to.have.length(1)
  })

  it('should have sign in control when not logged in', () => {
    const { userNameDisplay, signInLink, signOutLink } = setup({user: null})
    expect(signInLink).to.have.length(1)
    expect(signOutLink).to.have.length(0)
    expect(userNameDisplay).to.have.length(0)
  })

  it('should have sign out control when logged in', () => {
    const { signInLink, signOutLink } = setup({user: {}})
    expect(signInLink).to.have.length(0)
    expect(signOutLink).to.have.length(1)
  })

  it('should display logged in user name when logged in', () => {
    const { userNameDisplay } = setup({user: {firstName: 'Joe', surname: 'Bloggs'}})
    expect(userNameDisplay).to.have.length(1)
  })

  it('should invoke signIn when signIn clicked', () => {
    const { actions, signInLink } = setup({})
    expect(signInLink).to.have.length(1)
    signInLink.simulate('click')
    sinon.assert.calledOnce(actions.signIn)
  })
})
