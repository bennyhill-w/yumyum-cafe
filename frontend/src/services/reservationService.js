import api from './api'

export const createReservation = (data) => api.post('/reservations', data)
