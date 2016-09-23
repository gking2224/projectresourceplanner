import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { ProjectActions, BudgetActions, GlobalActions } from '../../actions'
import { CollapseableSection, ToggleTypes } from '../widgets'
import { ProjectBudgetList } from './ProjectBudgetList'

const Project = React.createClass({

  getInitialState: function() {
    return {
      reloadBudgets: true
    }
  },

  contextTypes: {
    router: PropTypes.object,
    sessionInfo: PropTypes.object
  },

  componentDidMount: function() {
    const { params, loadProject } = this.props
    loadProject(params.projectId)
    this.setState({reloadBudgets: true})
  },

  render: function() {
    const { project } = this.props

    return (
      <div id="project-detail-ctr">
        {(project) && this.renderProject()}
      </div>
    )
  },

  renderProject: function() {
    const { project, budgets } = this.props
    const { sessionInfo } = this.context
    return (
      <div id="project-detail">
        <h2>{project.name}</h2>

        <CollapseableSection toggleType={ToggleTypes.PLUS_MINUS} onOpen={this.lazyLoadBudgets} label={'View Budgets'}>
          <ProjectBudgetList sessionInfo={sessionInfo} budgets={budgets} addNewBudget={this.addNewBudget} toggleDefault={this.toggleDefaultBudget}/>
        </CollapseableSection>
      </div>
    )
  },

  lazyLoadBudgets: function() {
    const { project } = this.props

    if (!this.props.budgets || this.state.reloadBudgets) this.props.loadBudgets(project._id)
    this.setState({reloadBudgets: false})
  },

  addNewBudget: function(year) {
    return () => {
      const {project} = this.props
      const {router} = this.context

      router.push("/budgets/new/" + project._id + "/" + year)
    }
  },

  toggleDefaultBudget: function(year, yearBudgets) {
    return (b) => {
      return () => {
        const { userWarning, saveBudget } = this.props
        if (b.isDefault) {
          // try to unset
          userWarning("There must be one default budget per year")
          return
        }
        else {
          // unset current default
          const currentDefault = yearBudgets.find(bb => bb.isDefault)
          if (currentDefault) {
            currentDefault.isDefault = false
            saveBudget(currentDefault)
          }
        }

        b.isDefault = !b.isDefault
        saveBudget(b)
      }
    }
  }
})

export {Project} // for unit testing

export default connect(
  state => ({
    project: (state.model.projects.activeProjectId) ?
      state.model.projects.projectList.find(p => p._id === state.model.projects.activeProjectId) :
      null,
    budgets: state.model.budgets.budgetList
  }),
  dispatch => ({
    saveBudget: (budget) => dispatch(BudgetActions.saveBudget(budget)),
    loadProject: projectId => dispatch(ProjectActions.loadProject(projectId)),
    loadBudgets: (projectId) => dispatch(BudgetActions.loadProjectBudgets(projectId)),
    // setDefault: (budget, isDefault) => dispatch(BudgetActions.setDefault({budgetId, isDefault})),
    userWarning: (message) => dispatch(GlobalActions.userWarning(message))
  })
)(Project)
