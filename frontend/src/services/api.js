import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

export const lessonPlanApi = {
  list: (params) => http.get('/planos', { params }).then((r) => r.data),
  get: (id) => http.get(`/planos/${id}`).then((r) => r.data),
  create: (data) => http.post('/planos', data).then((r) => r.data),
  update: (id, data) => http.put(`/planos/${id}`, data).then((r) => r.data),
  remove: (id) => http.delete(`/planos/${id}`),
  smartAssist: (data) => http.post('/smart-assist', data).then((r) => r.data),
}
