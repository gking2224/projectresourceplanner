
import { ServerAPI, ProjectAPI, BudgetAPI, StaticData } from '.'

const localInitialState = ({
  global: {
    remoteActions: [],
    dialog: {}//{
    //   timeout: 0,
    //   modal: false,
    //   title: '',
    //   message: '',
    //   type: 'confirm', // 'ack
    //   severity: 'normal', // 'warn', error'
    // }
  },
  sessionInfo: {
    loggedOnUser: null,
    permissions: [
      // 'project.view.summary.all', 'project.view.detail.all', 'project.add', 'project.delete.all'
    ]
  },
  model: {},
  staticRefData: {
    contractTypes: [
      {code: 'M', description: 'Managed Services'},
      {code: 'P', description: 'Permanent'},
      {code: 'C', description: 'Contractor'}
    ]
  },
  menu: {
    activeItem: null,
    items: ["Projects"]
  }
})

// const keyById = (c) => {
//   const rv = {}
//   c.forEach(e => rv[e._id] = e)
//   return rv
// }
//
//
// const getInitialState = () => {
//
//   return new Promise((fulfill, reject) => {
//     StaticData.getAll().then( ({response: rd}) => {
//       const state = Object.assign(is, {
//         model: Object.assign(is.model, {}),
//         staticRefData: {
//           locations: keyById(rd.locations),
//           resources: keyById(rd.resources),
//         },
//       })
//       fulfill(state)
//     })
//   })
// }

export { localInitialState }
