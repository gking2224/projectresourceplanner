import React from 'react'
import { shallow, mount } from 'enzyme'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'
import keycode from 'keycode'
import { EditableInput } from '../../../../common/components/widgets'

const SPAN = 'span.editableInput'
const INPUT = 'input.editableInput'

chai.use(chaiEnzyme())

describe('EditableInput', () => {

  it('should display its text in a <span> when readonly', () => {
    const value = 'abc';
    const component = shallow(<EditableInput initialReadonly initialContent={value} />)
    expect(component).to.have.exactly(1).descendants(SPAN)
    expect(component.find(SPAN)).to.contain(value)
    expect(component).to.not.have.descendants(INPUT)
  })

  it('should display its text in an <input> when not readonly', () => {
    const value = 'abc';
    const component = shallow(<EditableInput initialReadonly={false} initialContent={value} />)
    console.log(component.debug())
    expect(component).to.have.exactly(1).descendants(INPUT)
    expect(component.find(INPUT)).to.have.value(value)
    expect(component).to.not.have.descendants(SPAN)
  })

  it('should not respond to clicks if inline edit not allowed', () => {

    const value = 'abc';
    const component = mount(
      <EditableInput allowInlineEdit={false} initialReadonly initialContent={value} />)

    expect(component).to.have.exactly(1).descendants(SPAN)
    component.find(SPAN).simulate('mouseup')
    expect(component).to.have.exactly(1).descendants(SPAN)
    expect(component).to.not.have.descendants(INPUT)
  })

  it('should become editable on click if inline edit is allowed', () => {

    const value = 'abc';
    const component = mount(
      <EditableInput allowInlineEdit initialReadonly initialContent={value} />)

    expect(component).to.have.exactly(1).descendants(SPAN)
    component.find(SPAN).simulate('mouseup')
    expect(component).to.not.have.descendants(SPAN)
    expect(component).to.have.exactly(1).descendants(INPUT)
  })

  it('should not immediately become editable on click if request edit function provided', () => {

    const spy = sinon.spy()
    const value = 'abc';
    const component = shallow(
      <EditableInput allowInlineEdit initialContent={value} requestEdit={spy} />)

    expect(component).to.not.have.descendants(INPUT)
    expect(component).to.have.exactly(1).descendants(SPAN)
    component.find(SPAN).simulate('mouseup')
    expect(component).to.have.exactly(1).descendants(SPAN)
    expect(component).to.not.have.descendants(INPUT)
    expect(spy.called).to.be.true
  })

  const simulateKeyPress = (key, props, keyEvent = 'up', opts = {}) => {

    const value = 'abc'
    const preventDefault = sinon.spy();
    const pProps = props

    const eventCallback = sinon.spy()
    Object.keys(props).forEach((k) => {
      pProps[k] = eventCallback
    })

    const component = mount(
      <EditableInput
        allowInlineEdit
        initialReadonly={false}
        initialContent={value}
        {...pProps}
      />
    )
    // editable
    expect(component).to.have.exactly(1).descendants(INPUT)
    component.instance().edit() // grab focus and select

    component.find(INPUT).simulate(`key${keyEvent}`, Object.assign({keyCode: keycode(key), preventDefault}, opts))
    expect(eventCallback.called).to.be.true
    expect(preventDefault.called).to.be.true
  }

  it('should notify on left key', () => simulateKeyPress('left', {onLeft: null}, 'down'))

  it('should notify on right key', () => simulateKeyPress('right', {onRight: null}, 'down'))

  it('should notify on alt left', () => simulateKeyPress('left', {onAltLeft: null}, 'up', {altKey: true}))

  it('should notify on alt right', () => simulateKeyPress('right', {onAltRight: null}, 'up', {altKey: true}))

  it('should notify on tag', () => simulateKeyPress('tab', {onTab: null}, 'down'))

  it('should notify on shift tag', () => simulateKeyPress('tab', {onShiftTab: null}, 'down', {shiftKey: true}))

  it('should notify on up key', () => simulateKeyPress('up', {onUp: null}, 'up'))

  it('should notify on down key', () => simulateKeyPress('down', {onDown: null}, 'up'))

  it('should notify on shift up', () => simulateKeyPress('up', {onShiftUp: null}, 'up', {shiftKey: true}))

  it('should notify on shift down', () => simulateKeyPress('down', {onShiftDown: null}, 'up', {shiftKey: true}))

  it('should notify on alt up', () => simulateKeyPress('up', {onAltUp: null}, 'up', {altKey: true}))

  it('should notify on alt down', () => simulateKeyPress('down', {onAltDown: null}, 'up', {altKey: true}))

  it('should notify complete on enter if onComplete provided', () => {

    const preventDefault = sinon.spy();
    const onComplete = sinon.spy();
    const value = 'abc'
    const component = mount(
      <EditableInput
        onComplete={onComplete}
        allowInlineEdit
        initialContent={value}
      />
    )
    expect(component).to.not.have.descendants(INPUT)
    expect(component).to.have.exactly(1).descendants(SPAN)
    component.find(SPAN).simulate('mouseup')
    expect(component).to.not.have.descendants(SPAN)
    expect(component).to.have.exactly(1).descendants(INPUT)
    component.instance().edit()
    component.find(INPUT).simulate('change', {target: {value: 'cba'}})
    component.find(INPUT).simulate('keyup', {keyCode: keycode('enter'), preventDefault})
    expect(onComplete.called).to.be.true
    expect(component).to.not.have.descendants(INPUT) // (editing complete)
    expect(component).to.have.exactly(1).descendants(SPAN)
  })

  it('should notify changes as they occur if onChange provided', () => {

    const onChange = sinon.spy();
    const value = 'abc'
    const component = mount(
      <EditableInput
        onChange={onChange}
        allowInlineEdit
        initialContent={value}
      />
    )
    expect(component).to.not.have.descendants(INPUT)
    expect(component).to.have.exactly(1).descendants(SPAN)
    component.find(SPAN).simulate('mouseup')
    expect(component).to.not.have.descendants(SPAN)
    expect(component).to.have.exactly(1).descendants(INPUT)
    component.instance().edit()
    component.find(INPUT).simulate('change', {target: {value: 'cba'}})
    expect(onChange.called).to.be.true
    expect(component).to.not.have.descendants(SPAN) // (still editing)
    expect(component).to.have.exactly(1).descendants(INPUT)
  })

  it('should clear changes on escape', () => {

    const preventDefault = sinon.spy();
    const value = 'abc'
    const component = mount(
      <EditableInput
        allowInlineEdit
        initialContent={value}
      />
    )
    expect(component).to.not.have.descendants(INPUT)
    expect(component).to.have.exactly(1).descendants(SPAN)
    component.find(SPAN).simulate('mouseup')
    expect(component).to.not.have.descendants(SPAN)
    expect(component).to.have.exactly(1).descendants(INPUT)
    component.find(INPUT).simulate('keyup', {keyCode: keycode('esc'), preventDefault})
    expect(component).to.not.have.descendants(INPUT)
    expect(component).to.have.exactly(1).descendants(SPAN)
  })

})
