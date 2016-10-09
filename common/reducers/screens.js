import {combineReducers} from "redux";
import projectScreen from './projectScreen'
import budgetScreen from './budgetScreen'

const screens = combineReducers({
  project:projectScreen, budget:budgetScreen
})

export default screens
