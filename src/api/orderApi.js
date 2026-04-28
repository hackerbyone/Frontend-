import axiosClient from './axiosClient'

const orderApi = {
  create(payload) {
    return axiosClient.post('/orders', payload)
  },
  getMyOrders() {
    return axiosClient.get('/orders')
  },
  getById(id) {
    return axiosClient.get(`/orders/${id}`)
  },
  // Admin
  getAllOrders(params = {}) {
    return axiosClient.get('/orders/all', { params })
  },
  updateStatus(id, status) {
    return axiosClient.put(`/orders/${id}/status`, { status })
  },
  cancelOrder(id) {
    return axiosClient.put(`/orders/${id}/cancel`)
  },
  // Admin: duyệt đơn hàng (trừ kho)
  approveOrder(id) {
    return axiosClient.put(`/orders/${id}/approve`)
  },
  // Admin: từ chối đơn hàng
  rejectOrder(id) {
    return axiosClient.put(`/orders/${id}/reject`, {})
  },
  // Admin: thống kê tổng quan
  getStats() {
    return axiosClient.get('/orders/stats')
  },
}

export default orderApi
