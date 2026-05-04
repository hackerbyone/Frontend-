import axiosClient from './axiosClient'

const manufacturerApi = {
  getList() {
    return axiosClient.get('/manufacturers')
  },
  getById(id) {
    return axiosClient.get(`/manufacturers/${id}`)
  },
  create(payload) {
    return axiosClient.post('/manufacturers', payload)
  },
  update(id, payload) {
    return axiosClient.put(`/manufacturers/${id}`, payload)
  },
  delete(id) {
    return axiosClient.delete(`/manufacturers/${id}`)
  },
}

export default manufacturerApi
