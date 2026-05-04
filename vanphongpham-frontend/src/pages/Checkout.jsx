import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import orderApi from '../api/orderApi'
import { formatVND } from '../utils/format'
import { toast } from 'react-toastify'

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    note: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <p className="text-gray-500 mb-4">Vui lòng đăng nhập để đặt hàng.</p>
        <Link to="/login" className="text-primary-600 hover:underline">← Đăng nhập</Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <p className="text-gray-500 mb-4">Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.</p>
        <Link to="/products" className="text-primary-600 hover:underline">← Quay lại mua sắm</Link>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address) {
      toast.error('Vui lòng nhập đầy đủ Họ tên, SĐT và Địa chỉ')
      return
    }

    setSubmitting(true)
    try {
      // Backend CreateOrderDto chỉ nhận items + shippingAddress
      // userId lấy từ JWT claim, totalAmount tính phía server
      const payload = {
        items: items.map((it) => ({
          productId: it.id,
          quantity: it.quantity,
        })),
        shippingAddress: `${form.address} | ${form.name} | ${form.phone}`,
      }

      const res = await orderApi.create(payload)
      const order = res?.order || res
      toast.success('Đặt hàng thành công! Mã đơn: #' + (order?.id || ''))
      clearCart()
      navigate('/orders/success', { state: { order } })
    } catch (err) {
      console.error(err)
      toast.error('Đặt hàng thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Thông tin đặt hàng</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Thông tin giao hàng */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6">
          <h3 className="font-bold mb-4 text-gray-800">Thông tin giao hàng</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Họ và tên *" name="name" value={form.name} onChange={handleChange} />
            <Field label="Số điện thoại *" name="phone" value={form.phone} onChange={handleChange} />
            <Field label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
          </div>
          <Field label="Địa chỉ giao hàng *" name="address" value={form.address} onChange={handleChange} />
          <div className="mt-3">
            <label className="block text-sm text-gray-600 mb-1">Ghi chú</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2 text-sm outline-none focus:border-primary-500"
              placeholder="Thông tin thêm cho người giao hàng..."
            />
          </div>

          <h3 className="font-bold mt-6 mb-3 text-gray-800">Phương thức thanh toán</h3>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 border rounded p-3 cursor-pointer hover:border-primary-500">
              <input type="radio" name="payment" defaultChecked />
              <span>💵 Thanh toán khi nhận hàng (COD)</span>
            </label>
            <label className="flex items-center gap-2 border rounded p-3 cursor-pointer hover:border-primary-500">
              <input type="radio" name="payment" />
              <span>🏦 Chuyển khoản ngân hàng</span>
            </label>
          </div>
        </div>

        {/* Tóm tắt */}
        <aside className="bg-white rounded-lg p-5 h-fit">
          <h3 className="font-bold mb-3 text-gray-800">Đơn hàng của bạn</h3>
          <div className="space-y-2 text-sm border-b pb-3 mb-3 max-h-72 overflow-y-auto">
            {items.map((it) => (
              <div key={it.id} className="flex justify-between gap-2">
                <span className="line-clamp-2 text-gray-700">
                  {it.name} <span className="text-gray-400">× {it.quantity}</span>
                </span>
                <span className="shrink-0">{formatVND(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Tổng cộng</span>
            <span className="text-primary-700">{formatVND(totalAmount)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-400 text-white py-3 rounded font-medium"
          >
            {submitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </button>
        </aside>
      </form>
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text' }) {
  return (
    <div className="mt-3">
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 text-sm outline-none focus:border-primary-500"
      />
    </div>
  )
}
