import { combineReducers } from 'redux'
import projects from './projects'
import budgets from './budgets'

const modelReducer = combineReducers({
  projects, budgets
})

export default modelReducer
