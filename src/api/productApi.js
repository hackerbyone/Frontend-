import axiosClient from './axiosClient'

const productApi = {
  getList(params = {}) {
    return axiosClient.get('/products', { params })
  },
  getById(id) {
    return axiosClient.get(`/products/${id}`)
  },
  getFeatured() {
    return axiosClient.get('/products', { params: { pageSize: 8 } })
  },
  create(payload) {
    return axiosClient.post('/products', payload)
  },
  update(id, payload) {
    return axiosClient.put(`/products/${id}`, payload)
  },
  delete(id) {
    return axiosClient.delete(`/products/${id}`)
  },
  uploadImage(id, file) {
    const form = new FormData()
    form.append('image', file)
    return axiosClient.post(`/products/${id}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  updateDiscount(id, discountPercent) {
    return axiosClient.put(`/products/${id}/discount`, { discountPercent })
  },
}

export default productApi
