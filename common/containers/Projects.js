import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ProjectList from '../components/project/ProjectList'
import Project from '../components/project/Project'

function mapStateToProps(state) {
  return {
    projects: state.model.projects
  }
}

function mapDispatchToProps() {
  return {}
}

const Projects = ({projects, children}) => {

  return (
    <div id="projects-ctr">
    {children}
    </div>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(Projects)
