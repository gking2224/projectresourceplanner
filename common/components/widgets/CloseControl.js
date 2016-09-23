import React, { PropTypes } from 'react'

const CloseControl = ({ hide, onClose }) => (

  <span className={'close-control'}>
    {(!hide) ? <a href={'#'} onClick={onClose}>x</a> : <span>&nbsp;</span>}
  </span>
)
CloseControl.propTypes = {
  hide: PropTypes.boolean,
  onClose: PropTypes.func,
}
export default CloseControl
