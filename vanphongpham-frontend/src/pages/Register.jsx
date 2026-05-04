import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

export default function Register() {
  const [form, setForm] = useState({
    name: '', userName: '', password: '', confirmPassword: '',
    email: '', phone: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }
    setSubmitting(true)
    try {
      await register({
        name: form.name,
        userName: form.userName,
        password: form.password,
        email: form.email,
        phone: form.phone,
        userType: 0, // 0 = end-user (theo data.sql)
      })
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      navigate('/login')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Đăng ký thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 fade-in">
        <h1 className="text-2xl font-bold text-center text-primary-700 mb-1">Đăng ký tài khoản</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Tham gia ngay để mua sắm dễ dàng hơn</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input label="Họ tên" name="name" value={form.name} onChange={handleChange} />
          <Input label="Tên đăng nhập" name="userName" value={form.userName} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input label="Số điện thoại" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} />
          <Input label="Xác nhận mật khẩu" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white py-2.5 rounded font-medium mt-2"
          >
            {submitting ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary-600 hover:underline font-medium">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}

function Input({ label, name, type = 'text', value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 text-sm outline-none focus:border-primary-500"
      />
    </div>
  )
}
