import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import React from 'react'
import { Link } from 'react-router'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import { Menu } from '../../../common/components/Menu'

chai.use(chaiEnzyme())


function setup({
  permissions = [],
  user = null,
  activeItem = 'Projects',
  menuItems = ['Projects', 'Resources'],
}) { // id, counter, childIds, parentId) {
  const actions = {
    // increment: expect.createSpy(),
    signIn: sinon.spy(),
    signOut: sinon.spy(),
  }

  const eventArgs = {
    // preventDefault: expect.createSpy()
  }

  const menu = {
    activeItem,
    items: menuItems,
  }

  const sessionInfo = {
    permissions,
    loggedOnUser: user,
  }

  const context = {
    getSessionInfo: l => [sessionInfo, () => null],
  }

  const component = shallow(<Menu {...actions} menu={menu} />, { context })

  return {
    component,
    menuLinks: component.find(Link),
    projectsMenuItem: component.find(Link).filterWhere(sw => sw.childAt(0).text() === 'Projects'),
    signInLink: component.find('#session-controls').children().find('#sign-in'),
    signOutLink: component.find('#session-controls').children().find('#sign-out'),
    userNameDisplay: component.find('span').filterWhere(n => n.childAt(0).text() === 'Logged in as '),
    actions,
    // eventArgs: eventArgs
  }
}

describe('Menu component', () => {

  it('should display 2 menu items', () => {
    const { menuLinks } = setup({})
    expect(menuLinks).to.have.length(2)
  })

  it('should have one <Link> per menu item', () => {
    const { menuLinks } = setup({menuItems: ['a', 'b', 'c']})
    expect(menuLinks).to.have.length(3)
  })

  it('should have <Link> with Projects', () => {
    const { projectsMenuItem } = setup({menuItems: ['Projects', 'b', 'c']})
    expect(projectsMenuItem).to.have.length(1)
  })

  it('should have sign in control when not logged in', () => {
    const { userNameDisplay, signInLink, signOutLink } = setup({user: null})
    expect(signInLink).to.have.length(1)
    expect(signOutLink).to.have.length(0)
    expect(userNameDisplay).to.have.length(0)
    expect(signInLink).to.contain('Sign in')
  })

  it('should have sign out control when logged in', () => {
    const { signInLink, signOutLink } = setup({user: {firstName: 'Joe', surname: 'Bloggs'}})
    expect(signInLink).to.have.length(0)
    expect(signOutLink).to.have.length(1)
    expect(signOutLink).to.contain('Sign out')
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
