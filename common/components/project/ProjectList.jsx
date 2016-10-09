import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { ProjectActions } from '../../actions'
import { Permissions } from '../../constants'
import ProjectListItem from './ProjectListItem'
import AddProject from './AddProject'
import { Utils } from '../../utils'

const ProjectList = React.createClass({

  contextTypes: {
    getSessionInfo: PropTypes.func,
  },

  getInitialState() {
    const sessionInfoAndUnsubscribe = this.context.getSessionInfo(this.sessionInfoUpdated)
    return {
      addingNew: false,
      sessionInfo: sessionInfoAndUnsubscribe[0],
      unsubscribe: sessionInfoAndUnsubscribe[1],
    }
  },

  componentDidMount() {
    const { loadProjects } = this.props
    loadProjects()
  },

  componentWillReceiveProps(nextProps, nextContext) {
  },

  componentWillUnmount() {
    this.state.unsubscribe()
  },

  sessionInfoUpdated(sessionInfo) {

    this.setState({sessionInfo})
  },

  render() {
    const { sessionInfo } = this.state

    return (
      <div id="projectList">
        <h2>Projects</h2>
        {this.renderProjectList()}
        {!this.state.addingNew && Utils.hasPermission(sessionInfo, Permissions.Project.ADD) && this.newProjectButton()}
        {this.state.addingNew && Utils.hasPermission(sessionInfo, Permissions.Project.ADD) && this.newProjectForm()}
      </div>
    )
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

  // project list or placeholder
  renderProjectList() {
    const { projects } = this.props
    console.log("render project list")
    console.log(projects)
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

  deleteProject(project) {
    return () => this.props.deleteProject(project)
  },

  saveProject(name) {

    this.props.saveProject(name)
    this.hideNewProjectForm()
  },
})

export {ProjectList} // exported for unit testing
export default connect(
  state => ({
    projects: state.model.projects,
  }),
  dispatch => ({
    loadProjects: () => dispatch(ProjectActions.loadProjects()),
    saveProject: name => dispatch(ProjectActions.saveNewProject(name)),
    deleteProject: project => dispatch(ProjectActions.deleteProject(project)),
  })
)(ProjectList)
