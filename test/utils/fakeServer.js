import sinonAsPromised from 'sinon-as-promised'

export const fakeServer = ({response, error, impl}) => {
  return () => {
    return new Promise((fulfill, reject) => {
      if (impl && typeof impl === 'function') impl()
      if (!error) fulfill(response)
      else reject(error)
    })
  }
}

