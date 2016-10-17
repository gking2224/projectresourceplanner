import React from 'react'
import classNames from 'classnames'

import './ToggleControl.scss'

const ToggleControl = ({on, className, onClick, type=ToggleTypes.STAR, customCodes = []}) => {

  switch (type) {
  case ToggleTypes.STAR:
    return renderCodes(on, onClick, className, 'star', [9733, 9734])
  case ToggleTypes.CUSTOM:
    return renderCodes(on, onClick, className, 'custom', customCodes)
  case ToggleTypes.CHECK:
    return renderCheck(on, onClick, className)
  case ToggleTypes.PLUS_MINUS:
    return renderCodes(on, onClick, className, 'plus-minus', [10133, 10134])
  case ToggleTypes.TICK_CROSS:
    return renderCodes(on, onClick, className, 'tick-cross', [10003, 10007])
  }
}
export default ToggleControl

const renderCodes = (on, onClick, className, type, codes) => {
  return (
    <span onClick={onClick} className={classNames('toggle', type, {on: on, off: !on, clickable: onClick}, className)}>
      {String.fromCharCode((on) ? codes[0] : codes[1])}
    </span>
  )
}

const renderCheck = (on, onClick, className) => {
  return (
    <span
      onClick={onClick}
      className={classNames('toggle', 'check', {on: on, off: !on, clickable: onClick}, className)}
    >
      {String.fromCharCode((on) ? 9745 : 9746)}
    </span>
  )
}

export const ToggleTypes = {
  STAR: 'STAR',
  CHECK: 'CHECK',
  PLUS_MINUS: 'PLUS_MINUS',
  CUSTOM: 'CUSTOM',
  TICK_CROSS: 'TICK_CROSS'
}

