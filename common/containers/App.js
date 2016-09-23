import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import update from 'react-addons-update'

import Header from '../components/Header'
import Footer from '../components/Footer'

import { RefData } from '../utils'

function mapStateToProps(state) {
  return {
    activeItem: state.menu.activeItem,
    staticRefData: state.staticRefData,
    sessionInfo: state.sessionInfo
  }
}

function mapDispatchToProps() {
  return {}
}

class App extends Component {

  constructor(props) {
    super(props)
    this.listenerId = 0
    this.listeners = []
  }

  componentWillReceiveProps(nextProps) {
    this.listeners.filter(s => s !== null).forEach(s =>
      s.listener(nextProps.sessionInfo))
  }

  getChildContext() {
    return {
      staticRefData: this.props.staticRefData,
      RefData: RefData(this.props.staticRefData),
      // addSessionInfoListener: listener => this.addSessionInfoListener(listener),
      getSessionInfo: (listener) => {
        return (listener) ?
          [this.props.sessionInfo, this.addSessionInfoListener(listener)] :
          this.props.sessionInfo
      },
    }
  }

  addSessionInfoListener(listener) {
    const id = this.listenerId++
    this.listeners.push({id, listener})
    // listener(this.props.sessionInfo)
    return this.unsubscribeFunc(id)
  }

  unsubscribeFunc(id) {
    return () => {
      const idx = this.listeners.findIndex(l => l.id === id)
      this.listeners.splice(idx, 1)
    }
  }

  render() {
    const { children } = this.props

    return (
      <div>
        <Header />
          {children}
        <Footer />
      </div>
    )
  }
}


App.childContextTypes = {
  staticRefData: PropTypes.object,
  getSessionInfo: PropTypes.func,
  RefData: PropTypes.object,
  addSessionInfoListener: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
