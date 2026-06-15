import api from './api'

export const getMenuByBranch = (branchId) =>
  api.get(`/menu/branch/${branchId}`)

export const getAllMenu = () => api.get('/menu')
