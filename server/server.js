/* eslint-disable no-console, no-use-before-define */

//import path from 'path'
import Express from 'express'
import { Router, Route, hashHistory } from 'react-router'
//import qs from 'qs'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import configureStore from '../common/store/configureStore'
import App from '../common/containers/App'
import { getInitialState } from '../common/api/initialState'

import Projects from '../common/containers/Projects'
import Budgets from '../common/containers/Budgets'
const app = new Express()
const port = 3000

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, { noInfo: false, publicPath: webpackConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// This is fired every time the server side receives a request
app.use(handleRender)

function handleRender(req, res) {
  // Query our mock API asynchronously
  // getInitialState(initialState => {

    // Create a new Redux store instance
    const store = configureStore({})//initialState)

    // Render the component to a string
    const html = renderToString(
      <Provider store={store}>
        <Router>
          <Route path="/" component={App}>
            <Route path="/projects" component={Projects} />
            <Route path="/budgets" component={Budgets} />
          </Route>
        </Router>
      </Provider>,
    )

    // Grab the initial state from our Redux store
    const finalState = store.getState()

    // Send the rendered page back to the client
    res.send(renderFullPage(html, finalState))
  // })
}

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <link rel="stylesheet" href="style.css">
        <title>Project Resource Planner</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}
//<script>
//  window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
// </script>

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})
