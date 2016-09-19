import 'babel-polyfill'
import React from 'react'
import { Router, Route, browserHistory, hashHistory, IndexRoute } from 'react-router'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { Paths } from '../common/constants'
import configureStore from '../common/store/configureStore'
import { getInitialState } from '../common/api/initialState'
import App from '../common/containers/App'
import Projects from '../common/containers/Projects'
import Project from '../common/components/project/Project'
import ProjectList from '../common/components/project/ProjectList'
import Budget from '../common/components/budget/Budget'
import Budgets from '../common/containers/Budgets'
import ResourceProjectSummary from '../common/components/budget/ResourceProjectSummary'

getInitialState().then(state => {

  const store = configureStore(state)
  const rootElement = document.getElementById('app')
  render(
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <Route path="/projects" component={Projects}>
            <IndexRoute component={ProjectList} />
            <Route path="/projects/:projectId" component={Project} />
          </Route>
          <Route path={Paths.Budget.index()} component={Budgets}>
            <Route path={Paths.Budget.new(":projectId", ":year")} component={Budget} />
            <Route path={Paths.Budget.view(":budgetId")} component={Budget} />
            <Route path={Paths.Budget.viewWithResource(":budgetId", ":resourceId")} component={Budget} />
          </Route>
        </Route>
      </Router>
    </Provider>,
    rootElement
  )
})
