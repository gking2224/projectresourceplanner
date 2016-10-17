import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

const serverActivity = (image, text = 'Loading...') => {
  return (image) ?
    <img src="/assets/images/spinner.gif" alt={text} /> :
    <span>{text}</span>
}

const Loading = ({remoteActions, inline = true, image, text}) => {

  if (typeof image === 'undefined') image = (typeof text === 'undefined')

  if (inline) {
    return (
      <div className="loading">
        {(remoteActions.length) > 0 && serverActivity(image, text)}
      </div>
    )
  }
  else {
    return (

      <div className="loading" style={{float: 'right'}}>
        {(remoteActions.length) > 0 && serverActivity(image, text)}
      </div>
    )
  }
}

Loading.propTypes = {
  remoteActions: PropTypes.arrayOf(PropTypes.string),
  inline: PropTypes.bool,
  image: PropTypes.bool,
  text: PropTypes.string
}

const stateToProps = state => ({
  remoteActions: state.global.remoteActions
})
export { Loading } // for unit testing

export default connect(stateToProps)(Loading)
