import axiosClient from './axiosClient'

/**
 * categoryApi: gọi API danh mục.
 *   GET /api/Category       -> danh sách
 *   GET /api/Category/{id}  -> chi tiết
 */
const categoryApi = {
  getList() {
    return axiosClient.get('/categories')
  },
  getById(id) {
    return axiosClient.get(`/categories/${id}`)
  },
}

export default categoryApi
