import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { Permissions } from '../../constants/permissions'
import { Utils } from '../../utils'
import { DeleteControl, PermissionedLink } from '../widgets'

import { ProjectActions } from '../../actions'

const ProjectListItem = ({project, deleteProject, sessionInfo}) => {
  const {name, _id} = project
  const id = _id
  return (
    <li>
      <PermissionedLink to={'/projects/'+id} permission={Permissions.Project.VIEW_DETAIL} sessionInfo={sessionInfo}>
        {name}
      </PermissionedLink>
      {projectDeleteControl(id, sessionInfo, deleteProject)}
    </li>
  )
}

const projectDeleteControl = (id, sessionInfo, deleteProject) => {

  return Utils.ifPermissioned(
    sessionInfo,
    Permissions.Project.DELETE,
    <DeleteControl onDelete={deleteProject.bind(this, id)} />
  )

}

export default connect(
  state => ({
    sessionInfo: state.sessionInfo
  }),
  dispatch => ({
    deleteProject: projectId => dispatch(ProjectActions.deleteProject(projectId)),
  })
)(ProjectListItem)
