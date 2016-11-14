
import XMLHttpRequest from 'xmlhttprequest'

const allConfig = {
  dev: {
    services: {
      projects: {
        protocol: 'http',
        host: 'localhost',
        port: 8000,
        contextRoot: 'project',
        xhr: new XMLHttpRequest.XMLHttpRequest()
      },
      budgets: {
        protocol: 'http',
        host: 'localhost',
        port: 7000,
        contextRoot: 'budget',
        xhr: new XMLHttpRequest.XMLHttpRequest()
      },
      refdata: {
        protocol: 'http',
        host: 'localhost',
        port: 9000,
        contextRoot: 'refdata',
        xhr: new XMLHttpRequest.XMLHttpRequest()
      },
      security: {
        protocol: 'http',
        host: 'localhost',
        port: 11000,
        contextRoot: 'security',
        xhr: new XMLHttpRequest.XMLHttpRequest()
      },
    },
  },
  test: {
    services: {
      projects: {
        protocol: 'http',
        host: 'http://projectms-dev-next.gking2224.me',
        port: 80,
        contextRoot: 'project',
        xhr: new XMLHttpRequest.XMLHttpRequest()
      },
      budgets: {
        protocol: 'http',
        host: 'http://budgetms-dev-next.gking2224.me',
        port: 80,
        contextRoot: 'budget',
        xhr: new XMLHttpRequest.XMLHttpRequest()
      },
      refdata: {
        protocol: 'http',
        host: 'http://refdatams-dev-next.gking2224.me',
        port: 80,
        contextRoot: 'refdata',
        xhr: new XMLHttpRequest.XMLHttpRequest()
      },
      security: {
        protocol: 'http',
        host: 'https://securityms-dev-next.gking2224.me',
        port: 80,
        contextRoot: 'security',
        xhr: new XMLHttpRequest.XMLHttpRequest()
      },
    },
  },
}
const env = process.env.NODE_ENV
console.log(`env=${env}`)
const envConfig = () => allConfig[env]
console.log('Using envConfig:')
console.log(allConfig[env])

export { envConfig }

