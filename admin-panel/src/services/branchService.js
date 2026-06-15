import api from './api'

export const getBranches = () => api.get('/branches')
export const updateBranch = (id, data) => api.patch(`/branches/${id}`, data)