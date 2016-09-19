import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ContextMenuWrapper, EditableInput } from '../widgets'
import classNames from 'classnames'

export const FteCell = ({
    fte, rate, edit, editNext, editPrevious, editDown, editUp, className,
    isEditing, cancelEdit, onChange, fillRight, fillLeft, viewFteValue, split
}) => {
  const value = (viewFteValue) ? (fte * (rate || 0)) : fte
  return (
    <td className={classNames('fte', className)}>
      <ContextMenuWrapper items={[
        ['Fill right', fillRight],
        ['Fill left', fillLeft],
        (split)?(['Split', split]):null
      ]}>
        <EditableInput
          initialContent={value}
          initialReadonly={!isEditing()}
          allowInlineEdit={!viewFteValue}
          onComplete={onChange}
          requestEdit={edit}
          cancelEdit={cancelEdit}
          onUp={editUp}
          onDown={editDown}
          onAltRight={fillRight}
          onLeft={editPrevious}
          onTab={editNext}
          onShiftTab={editPrevious}
          onRight={editNext}
          onAltLeft={fillLeft}/>
      </ContextMenuWrapper>
    </td>
  )
}
