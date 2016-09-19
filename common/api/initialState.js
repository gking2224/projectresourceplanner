
import { ServerAPI, ProjectAPI, BudgetAPI } from '.'

const initialState = () => ({
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
    locationRates: {
      'London': {
        'M': 600,
        'P': 350,
        'C': 500
      },
      'UK': {
        'M': 500,
        'P': 300,
        'C': 400
      },
      'IN': {
        'M': 300,
        'P': 150,
        'C': 300
      },
      defaults: {
        'M': 500,
        'P': 300,
        'C': 400
      }
    }
  },
  menu: {
    activeItem: null,
    items: ["Projects"]
  }
})


export function getInitialState() {

  return new Promise((fulfill, reject) => {

    ServerAPI.getResources().then(r =>
      ServerAPI.getLocations().then(l => {
        const is = initialState()
        const state = Object.assign(is, {
          model: Object.assign(is.model, {
          }),
          staticRefData: Object.assign(is.staticRefData, {
            locations: {locationList: l},
            resources: {resourceList: r}
          })
        })
        fulfill(state)
      })
    )
  })
}

