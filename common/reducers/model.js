import { combineReducers } from 'redux'
import projects from './projects'
import budgets from './budgets'
import wip from './wip'

const modelReducer = combineReducers({
  wip, projects, budgets
})

export default modelReducer
