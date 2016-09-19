import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import update from 'react-addons-update'

import { Utils } from '../../utils'

export const PermissionedLink = (props) => {

  const { permission, sessionInfo, children } = props
  const linkProps = Object.assign({}, props)
  delete linkProps.sessionInfo
  delete linkProps.permission
  return Utils.ifPermissioned(
    sessionInfo,
    permission,
    <Link {...linkProps} />,
    <span className="projectName">{children}</span>
  )

}
