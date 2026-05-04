import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import orderApi from '../api/orderApi'
import { formatVND, formatDate } from '../utils/format'
import { toast } from 'react-toastify'

const STATUS_LABEL = {
  Pending: 'Chờ duyệt',
  Processing: 'Đã duyệt - Đang xử lý',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã hủy',
  Rejected: 'Không được duyệt',
}

const STATUS_COLOR = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-600',
  Rejected: 'bg-red-100 text-red-800',
}

export default function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [detailCache, setDetailCache] = useState({})
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    if (!user) return
    orderApi.getMyOrders()
      .then(res => setOrders(Array.isArray(res) ? res : []))
      .catch(() => toast.error('Không tải được đơn hàng'))
      .finally(() => setLoading(false))
  }, [user])

  const toggleDetail = async (orderId) => {
    if (expandedId === orderId) {
      setExpandedId(null)
      return
    }
    setExpandedId(orderId)
    if (detailCache[orderId]) return
    try {
      const res = await orderApi.getById(orderId)
      setDetailCache(prev => ({ ...prev, [orderId]: res?.details || [] }))
    } catch {
      toast.error('Không tải được chi tiết')
    }
  }

  const handleCancel = async (orderId) => {
    if (!window.confirm('Xác nhận hủy đơn hàng #' + orderId + '?')) return
    setCancellingId(orderId)
    try {
      await orderApi.cancelOrder(orderId)
      toast.success('Đã hủy đơn hàng thành công')
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Hủy đơn hàng thất bại')
    } finally {
      setCancellingId(null)
    }
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <p className="text-gray-500 mb-4">Vui lòng đăng nhập để xem đơn hàng.</p>
        <Link to="/login" className="text-primary-600 hover:underline">← Đăng nhập</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Đơn hàng của tôi</h1>
        <Link to="/products" className="text-sm text-primary-600 hover:underline">← Tiếp tục mua sắm</Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Đang tải...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào.</p>
          <Link to="/products" className="text-primary-600 hover:underline text-sm">Mua sắm ngay →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleDetail(order.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-semibold text-gray-800">Đơn hàng #{order.id}</div>
                    <div className="text-xs text-gray-500">{formatDate(order.orderDate)}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary-700">{formatVND(order.totalAmount)}</span>
                  <span className="text-gray-400 text-sm">{expandedId === order.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expandedId === order.id && (
                <div className="border-t bg-gray-50 p-4">
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Địa chỉ giao hàng:</span> {order.shippingAddress || '—'}
                  </div>

                  {!detailCache[order.id] ? (
                    <div className="text-sm text-gray-400 py-2">Đang tải sản phẩm...</div>
                  ) : detailCache[order.id].length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {detailCache[order.id].map((d, i) => (
                        <div key={i} className="flex justify-between text-sm bg-white border rounded p-2.5">
                          <div>
                            <div className="font-medium text-gray-800">{d.productName}</div>
                            <div className="text-gray-500 text-xs">× {d.quantity} | {formatVND(d.unitPrice)} / cái</div>
                          </div>
                          <div className="font-semibold text-primary-600">{formatVND(d.unitPrice * d.quantity)}</div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {order.status === 'Pending' && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingId === order.id}
                      className="text-sm text-red-500 hover:text-red-700 border border-red-300 hover:border-red-500 px-3 py-1 rounded disabled:opacity-50"
                    >
                      {cancellingId === order.id ? 'Đang hủy...' : 'Hủy đơn hàng'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
