import React, { Component, PropTypes } from 'react'
import { EditableInput } from '../widgets'

const AddProject = ({onSave, onCancel}) => {

  let input
  return (
    <div id="add-project-ctr">
      <div className='form-ctr'>
        <EditableInput ref={(n) => input = n} initialContent={'<Project Name>'} initialReadonly={false} allowInlineEdit={true} onComplete={onSave} onMount={(self) => {self.focus(); self.select(); } }/>
      </div>
      <div className='button-ctr'>
        <button onClick={() => onSave(input.getValue())}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

export default AddProject
