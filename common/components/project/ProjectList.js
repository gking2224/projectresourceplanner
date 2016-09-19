import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { ProjectActions } from '../../actions'
import { Permissions } from '../../constants/permissions'
import ProjectListItem from './ProjectListItem'
import AddProject from './AddProject'
import { Utils } from '../../utils'

const ProjectList = React.createClass({

  getInitialState: function() {
    return { addingNew: false }
  },

  componentDidMount: function() {
    const { loadProjects } = this.props
    loadProjects()
  },
  render: function() {
    const { sessionInfo } = this.props

    return (
      <div id="projectList">
        <h2>Projects</h2>
        {this.renderProjectList()}
        {!this.state.addingNew && Utils.hasPermission(sessionInfo, Permissions.Project.ADD) && this.newProjectButton()}
        {this.state.addingNew && this.newProjectForm()}
      </div>
    )
  },

  newProjectButton: function() {
    return (
      <div className='button-ctr'><button onClick={()=>this.addingNew(true)}>New</button></div>
    )
  },

  addingNew: function(b) {
    this.setState({ addingNew: b })
  },

  newProjectForm: function() {
    return (
      <AddProject onSave={this.saveProject} onCancel={()=>this.addingNew(false)} />
    )
  },

  // project list or placeholder
  renderProjectList: function(){
    const {projects} = this.props
    if (!projects || projects.length === 0) {
      return <span>No projects</span>
    }
    else {
      return (
        <ul>
          {projects.map(p =>
            <ProjectListItem key={p._id} project={p}></ProjectListItem>
          )}
        </ul>
      )
    }
  },

  saveProject: function(name) {

    this.props.saveProject(name)
    this.addingNew(false)
  }
})

export {ProjectList}
export default connect(
  state => ({
    projects: state.model.projects.projectList,
    sessionInfo: state.sessionInfo
  }),
  dispatch => ({
    loadProjects: () => dispatch(ProjectActions.loadProjects()),
    saveProject: (name) => dispatch(ProjectActions.saveNewProject(name))
  })
)(ProjectList)
