import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
// import { batchedSubscribe } from 'redux-batched-subscribe';

import rootReducer from '../reducers'

export default function configureStore(state) {

  const enhancer = compose(
    applyMiddleware(thunk, promise),
    (typeof window === 'object' && typeof window.devToolsExtension !== 'undefined') ?
      window.devToolsExtension() :
      (f) => f
  )
  const store = createStore(
    rootReducer,
    state,
    enhancer
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
