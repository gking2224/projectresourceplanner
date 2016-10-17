import {combineReducers} from "redux";
import projectScreen from './projectScreen'
import budgetScreen from './budgetScreen'
import signInScreen from './signInScreen'

const screens = combineReducers({
  project:projectScreen, budget:budgetScreen, signIn:signInScreen
})

export default screens
