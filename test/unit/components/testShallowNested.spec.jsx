import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

describe("Nested components", () => {

  it("should not be rendered", () => {


    const Child = () => (<div className={'childDiv'}></div>)
    const Parent = () => (<div className={'parentDiv'}><Child /></div>)

    const p = shallow(<Parent />)

    expect(p.find(Child).children().find('.childDiv')).to.have.length(0)

  })

})
