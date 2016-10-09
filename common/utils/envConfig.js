

const config = {
  dev: {
    services: {
      projects: {
        protocol: 'http',
        host: 'localhost',
        port: 8000,
        contextRoot: 'projects-local',
      },
      budgets: {
        protocol: 'http',
        host: 'localhost',
        port: 7000,
        contextRoot: 'budgets-local',
      },
      refdata: {
        protocol: 'http',
        host: 'localhost',
        port: 9000,
        contextRoot: 'refdata-local',
      },
    },
  },
}

const envConfig = () => config[process.env.NODE_ENV]

export { envConfig }

