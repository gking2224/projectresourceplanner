
const resourceDisplayName = resource => (
  (resource) ? `${resource.firstName} ${resource.surname}` : null
)

const Location = {

  byId: (staticRefData, id) => staticRefData.locations[id],

  byName: (staticRefData, name) => staticRefData.locations[
      Object.keys(staticRefData.locations).find(l => staticRefData.locations[l].name === name)
  ],
  rateByName: (staticRefData, name, contractType = 'P') => {
    const loc = Location.byName(staticRefData, name)
    return (loc) ? loc.rates[contractType] : null
  },
  rateById: (staticRefData, id, contractType = 'P') => {
    const loc = Location.byId(staticRefData, id)
    return (loc) ?
      Location.rateByName(staticRefData, loc.building, contractType) ||
        Location.rateByName(staticRefData, loc.city, contractType) ||
        Location.rateByName(staticRefData, loc.country, contractType) ||
        null :
      null
  },
  rateByCity: (staticRefData, city, contractType = 'P') => {
    const data = staticRefData.locationRates[city]
    return (data) ? data[contractType] : null
  },
  rateByCountry: (staticRefData, country, contractType = 'P') => {
    const data = staticRefData.locationRates[country]
    return (data) ? data[contractType] : null
  },
  defaultRate: (staticRefData, contractType = 'P') => {
    const data = staticRefData.locationRates.defaults
    return (data) ? data[contractType] : null
  }
}

const RefData = staticRefData => ({
  Locations: {
    listAll: () => staticRefData.locations,
    names: () => Object.keys(staticRefData.locations).map(l => staticRefData.locations[l].name),
    ids: () => Object.keys(staticRefData.locations).map(l => Number(l)),
    byId: Location.byId.bind(null, staticRefData),
    rateById: Location.rateById.bind(null, staticRefData),
    rateByCity: Location.rateByCity.bind(null, staticRefData),
    rateByCountry: Location.rateByCountry.bind(null, staticRefData),
    defaultRate: Location.defaultRate.bind(null, staticRefData)
  },

  Resources: {
    displayName: resource => resourceDisplayName(resource),
    listAll: () => Object.keys(staticRefData.resources).map(r => Object.assign(
      {}, staticRefData.resources[r], {displayName: resourceDisplayName(staticRefData.resources[r])}
    )),
    byId: id => staticRefData.resources[id],
  },

  ContractTypes: {
    listAll: () => Object.keys(staticRefData.contractTypes).map(c => (
      {code: staticRefData.contractTypes[c].code, description: staticRefData.contractTypes[c].description}
    )),
    descriptions: () => Object.keys(staticRefData.contractTypes).map(c => staticRefData.contractTypes[c].description),
    codes: () => Object.keys(staticRefData.contractTypes).map(c => staticRefData.contractTypes[c].code),
    descriptionByCode: code => Object.keys(staticRefData.contractTypes)
      .find(c => staticRefData.contractTypes[c].code === code)
      .description
  }
})

export default RefData
