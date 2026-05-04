import axios from 'axios'

/**
 * axiosClient - HTTP client dùng chung cho toàn bộ ứng dụng.
 *
 * baseURL = '/api' để Vite proxy sang backend ASP.NET Core ApiGateway/APIService.
 * Khi build production, đổi VITE_API_URL trong .env hoặc sửa baseURL trực tiếp.
 *
 * Vì frontend gọi trực tiếp REST API mỗi lần render, nên admin thay đổi
 * dữ liệu trong database -> người dùng cuối F5 (hoặc đổi trang) là thấy ngay.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Interceptor: tự động đính kèm JWT token nếu user đã đăng nhập
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: xử lý lỗi tập trung
axiosClient.interceptors.response.use(
  (response) => response.data, // unwrap data
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn -> xoá và đẩy về trang login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // window.location.href = '/login' // bật khi cần ép logout
    }
    return Promise.reject(error)
  }
)

export default axiosClient
