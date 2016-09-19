import { combineReducers } from 'redux'
import locations from './locations'
import resources from './resources'

const staticReducer = combineReducers({
  locations, resources, locationRates: (s={}) => s
})

export default staticReducer
