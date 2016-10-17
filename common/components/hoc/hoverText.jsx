import React from 'react'

const hoverText = (Component) => {

  const HoverText = React.createClass({

    contextTypes: {
    },

    getInitialState() {
    },

    componentWillUnmount() {
      this.state.unsubscribe()
    },

    render() {
      return <Component {...this.props} {...this.state} />
    }

  })
  return HoverText

}

export default hoverText
