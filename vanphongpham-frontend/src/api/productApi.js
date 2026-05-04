import axiosClient from './axiosClient'

const productApi = {
  getList(params = {}) {
    return axiosClient.get('/Products', { params })
  },

  // ✅ Tìm kiếm theo nhiều tiêu chí
  // Ví dụ gọi: productApi.search({ keyword: 'bút', minPrice: 10000, maxPrice: 50000, brand: 'Thiên Long' })
  search({ keyword = '', minPrice, maxPrice, brand, categoryId, discountOnly, page = 1, pageSize = 20 } = {}) {
    return axiosClient.get('/Products', {
      params: {
        keyword,
        minPrice,
        maxPrice,
        brand,
        categoryId,
        discountOnly: discountOnly || undefined,
        page,
        pageSize,
      },
    })
  },

  getById(id) {
    return axiosClient.get(`/Products/${id}`)
  },
  getFeatured() {
    return axiosClient.get('/Products', { params: { pageSize: 8 } })
  },
  create(payload) {
    return axiosClient.post('/Products', payload)
  },
  update(id, payload) {
    return axiosClient.put(`/Products/${id}`, payload)
  },
  delete(id) {
    return axiosClient.delete(`/Products/${id}`)
  },
  uploadImage(id, file) {
    const form = new FormData()
    form.append('image', file)
    return axiosClient.post(`/Products/${id}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  updateDiscount(id, discountPercent) {
    return axiosClient.put(`/Products/${id}/discount`, { discountPercent })
  },
}

export default productApi