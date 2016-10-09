import {combineReducers} from "redux";
import projectWip from './projectWip'
import budgetWip from './budgetWip'

const wip = combineReducers({
  project: projectWip, budget: budgetWip
})

export default wip
