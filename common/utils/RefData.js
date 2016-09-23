

const resourceDisplayName = (resource) => {
  return (resource) ? resource.firstName + ' ' + resource.surname : null
}

const Location = {

  byId: (staticRefData, id) => {
    return staticRefData.locations.find(l => l._id === id)
  },
  rateById: (staticRefData, id, contractType = 'P') => {
    const loc = Location.byId(staticRefData, id)
    return Location.rateByCity(staticRefData, loc.city, contractType) ||
      Location.rateByCountry(staticRefData, loc.country, contractType) ||
      Location.defaultRate(staticRefData, contractType)
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

const RefData = (staticRefData) => {
  return {

    Locations: {
      listAll: () => staticRefData.locations,
      names: () => staticRefData.locations.map(l => l.name),
      ids: () => staticRefData.locations.map(l => l._id),
      byId: Location.byId.bind(null, staticRefData),
      rateById: Location.rateById.bind(null, staticRefData),
      rateByCity: Location.rateByCity.bind(null, staticRefData),
      rateByCountry: Location.rateByCountry.bind(null, staticRefData),
      defaultRate: Location.defaultRate.bind(null, staticRefData)
    },

    Resources: {
      displayName: (resource) => resourceDisplayName(resource),
      listAll: () => staticRefData.resources.map(r => Object.assign({}, r, {displayName: resourceDisplayName(r)})),
      byId: (id) => staticRefData.resources.find( (r) => r._id === id)
    },

    ContractTypes: {
      listAll: () => staticRefData.contractTypes,
      descriptions: () => staticRefData.contractTypes.map(c => c.description),
      codes: () => staticRefData.contractTypes.map(c => c.code),
      descriptionByCode: (code) => staticRefData.contractTypes.find( c => c.code === code).description
    }
  }
}

export { RefData }
