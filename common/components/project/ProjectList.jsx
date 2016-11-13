import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { ProjectActions } from '../../actions'
import { Permissions } from '../../constants'
import ProjectListItem from './ProjectListItem'
import AddProject from './AddProject'
import { sessionSubscriber } from '../hoc'

const ProjectList = React.createClass({

  getInitialState() {
    return {
      addingNew: false
    }
  },

  componentDidMount() {
    this.loadProjects()
  },

  componentWillReceiveProps(nextProps, nextContext) {
  },

  userSignedIn() {
    this.loadProjects()
  },

  loadProjects() {
    const { loadProjects, withSession } = this.props
    withSession(s => loadProjects(s))
  },

  newProjectButton() {
    return (
      <div className={'button-ctr'}><button onClick={this.displayNewProjectForm}>New</button></div>
    )
  },

  displayNewProjectForm() {
    this.setState({addingNew: true})
  },

  hideNewProjectForm() {
    this.setState({addingNew: false})
  },

  newProjectForm() {
    return (<AddProject onSave={this.saveProject} onCancel={this.hideNewProjectForm} />)
  },

  deleteProject(project) {
    const { deleteProject, withSession } = this.props
    return () => withSession(s => deleteProject(project, 2))
  },

  saveProject(name) {
    const { saveProject, withSession } = this.props
    withSession(s => saveProject(name, 2))
    this.hideNewProjectForm()
  },

  render() {
    const { isPermissioned } = this.props
    return (
      <div id='projectList'>
        <h2>Projects</h2>
        {this.renderProjectList()}
        {!this.state.addingNew && isPermissioned(Permissions.Project.ADD) && this.newProjectButton()}
        {this.state.addingNew && isPermissioned(Permissions.Project.ADD) && this.newProjectForm()}
      </div>
    )
  },

  // project list or placeholder
  renderProjectList() {
    const { projects } = this.props
    if (!projects || projects.length === 0) {
      return <span>No projects</span>
    }
    else {
      return (
        <ul>{Object.keys(projects).map(p =>
          <ProjectListItem key={p} project={projects[p]} onDelete={this.deleteProject(projects[p])} />)}
        </ul>
      )
    }
  },
})

export {ProjectList} // exported for unit testing
export default connect(
  state => ({
    projects: state.model.projects,
  }),
  dispatch => ({
    loadProjects: s => dispatch(ProjectActions.loadProjects(s)),
    saveProject: (name, s) => dispatch(ProjectActions.saveNewProject(name)),
    deleteProject: (project, s) => dispatch(ProjectActions.deleteProject(project, s)),
  })
)(sessionSubscriber(ProjectList))
