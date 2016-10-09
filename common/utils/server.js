import React from 'react'
import XMLHttpRequest from 'xmlhttprequest'

import { envConfig } from '../utils/envConfig'



const constructUrl = (service, resource, params) => {

  const config = envConfig().services[service]
  let url = `${config.protocol}://${config.host}:${config.port}/${config.contextRoot}${resource}`
  if (params && params.length > 0) {
    url = `${url}?`
    Object.keys(params).forEach(k => url = `${url}${k}=${params[k]}&`)
    url = url.substr(0, url.length - 1)
  }
  return url
}



const callService = ({service, resource, xhr = new XMLHttpRequest.XMLHttpRequest(), method = 'GET', body, params = {}}) => {
  return new Promise((fulfill, reject) => {
    const url = constructUrl(service, resource, params)
    console.log(`${method}: ${url}`)
    xhr.open(method, url, true)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          fulfill(JSON.parse(xhr.responseText))
        }
        else {
          reject({status: xhr.status, err: xhr.responseText})
        }
      }
    }
    xhr.send(body && JSON.stringify(body))
  })
}
export const Server = {

  doGet: (args) => {
    return callService(Object.assign(args, {method: 'GET'}))
  },

  doPost: (args) => {
    return callService(Object.assign(args, {method: 'POST'}))
  },

  doPut: (args) => {
    return callService(Object.assign(args, {method: 'PUT'}))
  },

  doDelete: (args) => {
    return callService(Object.assign(args, {method: 'DELETE'}))
  },
}
