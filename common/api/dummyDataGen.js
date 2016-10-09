
import { firstNames, surnames, locationRates, contractTypes } from './dummyData'
import { ServerAPI } from '.'

const seedDatabase = () => {
  seedLocations().then(() =>
    seedResources(60)
    .catch(err=>console.log(err))
  )
  .catch(err=>console.log(err))
}
const seedUsers = () => {
  const user = {
    firstName: 'Mikael',
    surname: 'Andersson',
    permissions: ['project.view.summary.all', 'project.view.detail.all', 'project.add', 'project.delete.all'],
    roles: ['user']
  }
  ServerAPI.insertUsers([user])
}

const seedLocations = () => {
  return ServerAPI.deleteAllLocations().then(() => {
    const locations = [{
      name: 'London', // to be building name?
      city: 'London',
      country: 'UK'
    }, {
      name: 'Edinburgh',
      city: 'Edinburgh',
      country: 'UK'
    }, {
      name: 'Delhi',
      city: 'Delhi',
      country: 'IN'
    }, {
      name: 'Chennai',
      city: 'Chennai',
      country: 'IN'
    }]

    return ServerAPI.insertLocations(locations)
  })
}

const seedResources = (n) => {

  return ServerAPI.deleteAllResources().then(() => {

    return ServerAPI.getLocations().then(locations => {
      const resources = []
      for (let i = 0; i < n; i++) {

        const surname = surnames[Math.floor(Math.random() * surnames.length)]
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const rateDelta = (Math.floor(Math.random() * 8) - 4) * 20
        const location = locations[Math.floor(Math.random() * locations.length)]
        const rate = locationRates[location.country] + rateDelta
        const contractType = contractTypes[Math.floor(Math.random() * contractTypes.length)]

        resources.push({
          location: location._id,
          billRate: rate,
          type: contractType,
          firstName, surname,
          status: 'Active'
        })
      }
      return ServerAPI.insertResources(resources)
    })
  })
}

//window.addEventListener('load', seedDatabase)

