The top level App component subscribes to sessionInfo state changes and provides sessionInfo in context.



To get sessionInfo:

```javascript

  // declare that this component receives sessionInfo from context
  contextTypes: {
    getSessionInfo: PropTypes.func
  },

  getInitialState () {

    // get sessionInfo
    return {
      sessionInfo: this.context.getSessionInfo()
    }
  }

```

To subscribe to updates, use this code:
```javascript

  // declare that this component receives sessionInfo from context
  contextTypes: {
    getSessionInfo: PropTypes.func
  },

  getInitialState () {

    // get sessionInfo, providing a listener function to get notified of updates
    const sessionInfoAndUnsubscribe = this.context.getSessionInfo(this.sessionInfoUpdated)
    // store the sessionInfo and unsubscribe function in state
    return {
      sessionInfo: sessionInfoAndUnsubscribe[0],
      unsubscribe: sessionInfoAndUnsubscribe[1]
    }
  },

  // respond to sessionInfo changes
  sessionInfoUpdated(sessionInfo) {
    this.setState({sessionInfo})
  },

  // unsubscribe when component unmounts 
  componentWillUnmount() {
    this.state.unsubscribe()
  }
```
