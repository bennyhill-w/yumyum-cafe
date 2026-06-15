import api from './api'

export const createOrder = (data) => api.post('/orders', data)
export const verifyPayment = (reference) =>
  api.get(`/orders/verify/${reference}`)
