import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

export default function Login() {
  const [form, setForm] = useState({ userName: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.userName || !form.password) {
      toast.error('Vui lòng nhập tên đăng nhập và mật khẩu')
      return
    }
    setSubmitting(true)
    try {
      await login(form.userName, form.password)
      toast.success('Đăng nhập thành công!')
      navigate('/')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 fade-in">
        <h1 className="text-2xl font-bold text-center text-primary-700 mb-1">Đăng nhập</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Chào mừng quay trở lại!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tên đăng nhập</label>
            <input
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
              className="w-full border rounded px-3 py-2.5 text-sm outline-none focus:border-primary-500"
              placeholder="user1"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border rounded px-3 py-2.5 text-sm outline-none focus:border-primary-500"
              placeholder="••••••"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white py-2.5 rounded font-medium"
          >
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary-600 hover:underline font-medium">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  )
}
