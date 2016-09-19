
export const Paths = {

  Budget: {
    index: () => "/budgets",
    view: (id) => `/budgets/${id}`,
    viewWithResource: (id, resourceId) => `/budgets/${id}/resource/${resourceId}`,
    new: (projectId, year) => `/budgets/new/${projectId}/${year}`
  },

  Project: {
    view: (id) => "/project/",
  }
}
