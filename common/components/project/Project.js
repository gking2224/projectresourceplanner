import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { ProjectActions, BudgetActions, GlobalActions } from '../../actions'
import { CollapseableSection, ToggleTypes } from '../widgets'
import { ProjectBudgetList } from '.'
import { Loading } from '../common'

import { sessionSubscriber } from '../hoc'

const Project = React.createClass({

  getInitialState: function() {
    return {
      reloadBudgets: true
    }
  },

  contextTypes: {
    router: PropTypes.object
  },

  componentWillMount: function() {
    const { budgets } = this.props
    this.filterBudgets(budgets)
  },

  userSignedIn() {
    this.loadProject()
  },

  shouldComponentUpdate() {
    return true
  },

  componentDidMount: function() {
    this.loadProject()
    this.setState({reloadBudgets: true})
  },

  componentWillReceiveProps: function(nextProps) {
    const { budgets } = nextProps
    this.filterBudgets(budgets)
  },

  filterBudgets(budgets) {
    const { project } = this.props
    let sBudgets = Object.assign({}, budgets)
    if (project)
      Object.keys(sBudgets)
        .filter(b => sBudgets[b].projectId !== project._id)
        .forEach(b => delete sBudgets[b])
    else
      sBudgets = {}
    this.setState({budgets: sBudgets})
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
    const { project } = this.props
    const { budgets } = this.state
    const { sessionInfo } = this.context
    return (
      <div id="project-detail">
        <h2>{project.name}</h2>

        <CollapseableSection toggleType={ToggleTypes.PLUS_MINUS} onOpen={this.lazyLoadBudgets} label={'View Budgets'}>
          {(budgets) ?
            <ProjectBudgetList
              sessionInfo={sessionInfo}
              budgets={budgets}
              addNewBudget={this.addNewBudgetFx}
              toggleDefault={this.toggleDefaultBudgetFx}
            /> :
            <Loading image={false} text={'Loading budgets...'} />
          }
        </CollapseableSection>
      </div>
    )
  },

  loadProject() {
    const { loadProject, withSession } = this.props
    withSession(s => loadProject(this.props.params.projectId, s))
  },

  lazyLoadBudgets: function() {
    const { project, withSession } = this.props

    if (!this.props.budgets || this.state.reloadBudgets) {
      this.setState({budgets: false}, () => {
        withSession(s => this.props.loadBudgets(project._id, s))
        this.setState({reloadBudgets: false})
      })
    }
  },

  addNewBudgetFx: function(year) {
    return () => {
      const {project} = this.props
      const {router} = this.context

      router.push("/budgets/new/" + project._id + "/" + year)
    }
  },

  toggleDefaultBudgetFx: function(year, yearBudgets) {
    const { withSession, userWarning, saveBudget } = this.props
    return (b) => {
      return () => {
        if (b.isDefault) {
          // try to unset
          userWarning('There must be one default budget per year')
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
        withSession(s => saveBudget(b, s))
      }
    }
  },
})

export { Project } // for unit testing

export default connect(
  state => ({
    project: state.model.projects[state.screens.project.activeProjectId],
    budgets: state.model.budgets,
  }),
  dispatch => ({
    saveBudget: (budget, s) => dispatch(BudgetActions.saveBudget(budget, s)),
    loadProject: (projectId, s) => dispatch(ProjectActions.loadProject(projectId, s)),
    loadBudgets: (projectId, s) => dispatch(BudgetActions.loadProjectBudgets(projectId, s)),
    // setDefault: (budget, isDefault) => dispatch(BudgetActions.setDefault({budgetId, isDefault})),
    userWarning: message => dispatch(GlobalActions.userWarning(message))
  })
)(sessionSubscriber(Project))
