import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'


export const DeleteControl = ({onDelete, text = 'x'}) => {

  return (<button onClick={onDelete}>{text}</button>)
}
