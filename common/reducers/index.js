import { combineReducers } from 'redux'
import sessionInfo from './sessionInfo'
import model from './model'
import staticRefData from './staticRefData'
import global from './global'
import menu from './menu'

const rootReducer = combineReducers({
  global, sessionInfo, model, staticRefData, menu
})

const wrappedReducer = (reducer) => {
  return (state, action) => {
    // console.log("current state")
    // console.log(state)
    // console.log("action")
    // console.log(action)
    return reducer(state, action)
  }
}

export default wrappedReducer(rootReducer)
