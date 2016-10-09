import { combineReducers } from 'redux'
import sessionInfo from './sessionInfo'
import model from './model'
import screens from './screens'
import staticRefData from './staticRefData'
import global from './global'
import menu from './menu'

const rootReducer = combineReducers({
  global, sessionInfo, model, staticRefData, screens, menu
})

const wrappedReducer = (reducer) => {
  return (state, action) => {
    return reducer(state, action)
  }
}

export default wrappedReducer(rootReducer)
