import React, { Component, PropTypes } from 'react'

import { Permissions } from '../../constants/permissions'
import { Utils } from '../../utils'
import { DeleteControl, PermissionedLink } from '../widgets'

const ProjectListItem = ({project, onDelete}, {getSessionInfo}) => {
  console.log(project)
  const {name, _id} = project
  const sessionInfo = getSessionInfo()
  return (
    <li key={_id}>
      <PermissionedLink to={`/projects/${_id}`} permission={Permissions.Project.VIEW_DETAIL} sessionInfo={sessionInfo}>
        {name}
      </PermissionedLink>
      {Utils.hasPermission(sessionInfo, Permissions.Project.DELETE) && projectDeleteControl(onDelete)}
    </li>
  )
}

ProjectListItem.contextTypes = {
  getSessionInfo: PropTypes.func,
}

const projectDeleteControl = (onDelete) => {

  return (
    <DeleteControl onDelete={onDelete} />
  )

}
export default ProjectListItem
