import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Header from '../components/Header'
import Footer from '../components/Footer'

function mapStateToProps(state) {
  return {
    activeItem: state.menu.activeItem
  }
}

function mapDispatchToProps() {
  //return bindActionCreators(ProjectActions, dispatch)
  return {}
}

class App extends Component {

  render() {
    const { children } = this.props

    return (<div>
      <Header />
        {children}
      <Footer />
    </div>)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
