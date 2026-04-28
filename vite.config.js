import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy giúp tránh lỗi CORS khi gọi backend ASP.NET Core
    // Backend của bạn (ApiGateway / APIService) đổi cổng cho khớp
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // API Gateway (routes auth→5002, products/orders→5001)
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:5001', // Static files served directly from APIService
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
