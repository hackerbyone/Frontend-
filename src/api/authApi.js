import axiosClient from './axiosClient'

/**
 * authApi: gọi BaseCore.AuthService.
 *
 * POST /api/Auth/login    -> { token, user }
 * POST /api/Auth/register -> { user }
 *
 * Lưu ý: AuthService trả về JWT token, lưu vào localStorage để
 * axiosClient tự đính kèm vào các request sau.
 */
const authApi = {
  login(payload) {
    return axiosClient.post('/auth/login', payload)
  },
  register(payload) {
    return axiosClient.post('/auth/register', payload)
  },
  getProfile() {
    return axiosClient.get('/auth/me')
  },
}

export default authApi
