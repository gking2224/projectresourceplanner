
import Datastore from 'nedb'

export const upsertOptions = {upsert: true, returnUpdatedDocs: true, multi: false}

export const errHandler = (err) => {
  if (err) console.log(err)
}

const db = {
  users: new Datastore('data2/users2.db'),
  locations: new Datastore('data2/locations2.db'),
  resources: new Datastore('data2/resources2.db')
}
db.users.loadDatabase(errHandler)
db.locations.loadDatabase(errHandler)
db.resources.loadDatabase(errHandler)

export const ServerAPI = {

  getResources: () => {
    return new Promise((fulfill, reject) => {
      db.resources.find({}).sort({surname: 1, firstName: 1}).exec((err, docs) => {
        if (err) reject(err)
        else fulfill(docs)
      })
    })
  },

  getLocations: () => {
    return new Promise((fulfill, reject) => {
      db.locations.find({}, (err, docs) => {
        if (err) reject(err)
        else fulfill(docs)
      })
    })
  },

  insertUsers: (users) => {
    db.users.insert(users)
  },

  insertLocations: (locations) => {
    return new Promise((fulfill, reject) => {
      db.locations.insert(locations, (err, docs) => {
        if (err) reject(err)
        else fulfill(docs)
      })
    })
  },

  insertResources: (resources) => {
    return new Promise((fulfill, reject) => {
      db.resources.insert(resources, (err, docs) => {
        if (err) reject(err)
        else fulfill(docs)
      })
    })
  },

  deleteAllLocations: () => {
    return new Promise((fulfill, reject) => {
      db.locations.remove({}, {multi:true}, (err, docs) => {
        if (err) reject(err)
        else fulfill(docs)
      })
    })
  },

  deleteAllResources: () => {
    return new Promise((fulfill, reject) => {
      db.resources.remove({}, {multi:true}, (err, docs) => {
        if (err) reject(err)
        else fulfill(docs)
      })
    })
  }
}
