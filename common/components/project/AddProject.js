import React, { Component, PropTypes } from 'react'

const AddProject = ({onSave, onCancel}) => {

  let input
  return (
    <div id="add-project-ctr">
      <div className='form-ctr'>
        <input type="text" ref={n => {
          input = n
        }}/>
      </div>
      <div className='button-ctr'>
        <button onClick={() => onSave(input.value)}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

export default AddProject
