

const config = {
  dev: {
    services: {
      projects: {
        protocol: 'http',
        host: 'localhost',
        port: 8000,
        contextRoot: 'project',
      },
      budgets: {
        protocol: 'http',
        host: 'localhost',
        port: 7000,
        contextRoot: 'budget',
      },
      refdata: {
        protocol: 'http',
        host: 'localhost',
        port: 9000,
        contextRoot: 'refdata',
      },
      security: {
        protocol: 'http',
        host: 'localhost',
        port: 11000,
        contextRoot: 'security',
      },
    },
  },
}

const envConfig = () => config[process.env.NODE_ENV]

export { envConfig }

