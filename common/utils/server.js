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

const getXhrRequest = (service, xhr) => {
  if (xhr) return xhr
  else return envConfig().services[service].xhr
}

const callService = ({service, sessionInfo, resource, xhr, method = 'GET', body = false, params = {}}) => {
  return new Promise((fulfill, reject) => {
    const url = constructUrl(service, resource, params)
    const xhrRequest = getXhrRequest(service, xhr)
    console.log(`${method}: ${url}`)
    xhrRequest.open(method, url, true)
    xhrRequest.setRequestHeader('Accept', 'application/json')
    xhrRequest.setRequestHeader('Content-Type', 'application/json')
    // xhrRequest.setRequestHeader('X-CSRF-TOKEN', 'application/json')
    xhrRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    if (sessionInfo && sessionInfo.securityToken) {
      xhrRequest.setRequestHeader('Authentication', sessionInfo.securityToken)
    }
    xhrRequest.onreadystatechange = () => {
      if (xhrRequest.readyState === xhrRequest.DONE) {
        const status = xhrRequest.status
        const responseText = xhrRequest.responseText
        const response = responseText ? JSON.parse(responseText) : null
        if (status >= 200 && status < 300) {
          setTimeout(() => fulfill({status, response}), 300)
        }
        else {
          setTimeout(() => reject(response), 300)
        }
      }
    }
    xhrRequest.send(body && JSON.stringify(body))
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
