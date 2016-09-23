/* eslint import/prefer-default-export: "off" */

export const dummyContext = ({loggedOnUser, permissions = []}) => {

  const sessionInfo = {
    loggedOnUser,
    permissions,
  }

  const context = {
    getSessionInfo: (l) => {
      return (l) ? [sessionInfo, () => null] : sessionInfo
    },
    RefData: {},
    staticRefData: {},
  }

  return context
}

// export const chaiEnzymeLogger = (wrapper) => {
//
// }
