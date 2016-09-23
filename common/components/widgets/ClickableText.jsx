import React, { PropTypes } from 'react'
import classNames from 'classnames'


const ClickableText = ({id, action, className, onClick, children}) => {

  return (
    <a id={id} href={`#${action}`} className={classNames('clickable', className)} onClick={onClick}>
      {children}
    </a>
  )
}

ClickableText.propTypes = {
  action: PropTypes.string.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
}
export default ClickableText
