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

const callService = ({service, sessionInfo, resource, xhr = new XMLHttpRequest.XMLHttpRequest(), method = 'GET', body = false, params = {}}) => {
  return new Promise((fulfill, reject) => {
    const url = constructUrl(service, resource, params)
    console.log(`${method}: ${url}`)
    body && console.log(body)
    xhr.open(method, url, true)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    if (sessionInfo && sessionInfo.securityToken) {
      xhr.setRequestHeader('Authentication', sessionInfo.securityToken)
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.DONE) {
        const status = xhr.status
        const responseText = xhr.responseText
        const response = responseText ? JSON.parse(responseText) : null
        if (status >= 200 && status < 300) {
          setTimeout(() => fulfill({status, response}), 300)
        }
        else {
          setTimeout(() => reject(response), 300)
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
