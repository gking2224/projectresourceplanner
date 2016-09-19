import * as ActionTypes from '../constants/actionTypes'
import {combineReducers} from 'redux'
import dialog from './dialog'
import remoteActions from './remoteActions'

const global = combineReducers({dialog, remoteActions})
export default global
