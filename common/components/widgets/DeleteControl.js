import React, { Component, PropTypes } from 'react'


const DeleteControl = ({onDelete, text = 'x'}) => {

  return (<button onClick={onDelete}>{text}</button>)
}

export default DeleteControl
