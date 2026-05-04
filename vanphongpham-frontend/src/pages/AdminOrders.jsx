import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import orderApi from '../api/orderApi'
import { formatVND, formatDate } from '../utils/format'
import { toast } from 'react-toastify'

const STATUS_OPTIONS = ['Pending', 'Processing', 'Completed', 'Rejected', 'Cancelled']

const STATUS_LABEL = {
  Pending: 'Chờ duyệt',
  Processing: 'Đã duyệt - Đang xử lý',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã hủy',
  Rejected: 'Không duyệt',
}

const STATUS_COLOR = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-600',
  Rejected: 'bg-red-100 text-red-800',
}

export default function AdminOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const pageSize = 15

  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, pageSize }
      if (filterStatus) params.status = filterStatus
      const res = await orderApi.getAllOrders(params)
      setOrders(res?.items || [])
      setTotalPages(res?.totalPages || 1)
      setTotalCount(res?.totalCount || 0)
    } catch {
      toast.error('Không tải được danh sách đơn hàng')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, filterStatus])

  useEffect(() => { loadOrders() }, [loadOrders])

  const handleFilterChange = (status) => {
    setFilterStatus(status)
    setPage(1)
  }

  const handleViewDetail = async (order) => {
    setSelectedOrder(order)
    setOrderDetails(null)
    setDetailLoading(true)
    try {
      const res = await orderApi.getById(order.id)
      setOrderDetails(res?.details || [])
    } catch {
      toast.error('Không tải được chi tiết đơn hàng')
    } finally {
      setDetailLoading(false)
    }
  }

  // Duyệt đơn: trừ kho, chuyển Pending → Processing
  const handleApprove = async (orderId) => {
    if (!window.confirm(`Xác nhận DUYỆT đơn hàng #${orderId}?\nKho sẽ bị trừ sau khi duyệt.`)) return
    setUpdatingId(orderId)
    try {
      await orderApi.approveOrder(orderId)
      toast.success(`✓ Đã duyệt đơn hàng #${orderId}, kho đã được trừ`)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Processing' } : o))
      if (selectedOrder?.id === orderId)
        setSelectedOrder(prev => ({ ...prev, status: 'Processing' }))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Duyệt đơn hàng thất bại')
    } finally {
      setUpdatingId(null)
    }
  }

  // Từ chối đơn: không trừ kho, chuyển Pending → Rejected
  const handleReject = async (orderId) => {
    if (!window.confirm(`Xác nhận TỪ CHỐI đơn hàng #${orderId}?`)) return
    setUpdatingId(orderId)
    try {
      await orderApi.rejectOrder(orderId)
      toast.success(`Đã từ chối đơn hàng #${orderId}`)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Rejected' } : o))
      if (selectedOrder?.id === orderId)
        setSelectedOrder(prev => ({ ...prev, status: 'Rejected' }))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Từ chối đơn hàng thất bại')
    } finally {
      setUpdatingId(null)
    }
  }

  // Hoàn thành đơn: Processing → Completed
  const handleComplete = async (orderId) => {
    setUpdatingId(orderId)
    try {
      await orderApi.updateStatus(orderId, 'Completed')
      toast.success(`Đơn hàng #${orderId} đã hoàn thành`)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Completed' } : o))
      if (selectedOrder?.id === orderId)
        setSelectedOrder(prev => ({ ...prev, status: 'Completed' }))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCancel = async (orderId) => {
    if (!window.confirm('Xác nhận hủy đơn hàng #' + orderId + '?')) return
    setUpdatingId(orderId)
    try {
      await orderApi.cancelOrder(orderId)
      toast.success('Đã hủy đơn hàng #' + orderId)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o))
      if (selectedOrder?.id === orderId)
        setSelectedOrder(prev => ({ ...prev, status: 'Cancelled' }))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Hủy đơn hàng thất bại')
    } finally {
      setUpdatingId(null)
    }
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center text-gray-500">
        Bạn cần <Link to="/login" className="text-primary-600 hover:underline">đăng nhập</Link> với quyền Admin.
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng: {totalCount} đơn hàng</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin" className="text-sm text-primary-600 hover:underline">← Dashboard</Link>
          <span className="text-gray-300">|</span>
          <Link to="/admin/products" className="text-sm text-primary-600 hover:underline">Quản lý sản phẩm</Link>
          <span className="text-gray-300">|</span>
          <Link to="/products" className="text-sm text-primary-600 hover:underline">Về cửa hàng</Link>
        </div>
      </div>

      {/* Hướng dẫn luồng duyệt đơn */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
        <strong>Luồng duyệt đơn:</strong> Chờ duyệt → <span className="text-green-700 font-medium">Duyệt</span> (trừ kho) hoặc <span className="text-red-700 font-medium">Từ chối</span> → Đã duyệt → Hoàn thành
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => handleFilterChange('')}
          className={`px-4 py-2 rounded-full text-sm font-medium border ${filterStatus === '' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}
        >
          Tất cả
        </button>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => handleFilterChange(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${filterStatus === s ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Đang tải...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-lg border border-gray-200">
          Không có đơn hàng nào.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 w-16">Mã ĐH</th>
                <th className="px-4 py-3 text-left text-gray-600">Địa chỉ giao hàng</th>
                <th className="px-4 py-3 text-left text-gray-600 w-36">Ngày đặt</th>
                <th className="px-4 py-3 text-left text-gray-600 w-32">Tổng tiền</th>
                <th className="px-4 py-3 text-left text-gray-600 w-32">Trạng thái</th>
                <th className="px-4 py-3 text-left text-gray-600 w-56">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-500">#{order.id}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{order.shippingAddress || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(order.orderDate)}</td>
                  <td className="px-4 py-3 font-semibold text-primary-700">{formatVND(order.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      <button
                        onClick={() => handleViewDetail(order)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Chi tiết
                      </button>

                      {/* Đơn chờ duyệt: hiển thị nút Duyệt + Từ chối */}
                      {order.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(order.id)}
                            disabled={updatingId === order.id}
                            className="text-xs bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-2 py-0.5 rounded"
                          >
                            {updatingId === order.id ? '...' : 'Duyệt'}
                          </button>
                          <button
                            onClick={() => handleReject(order.id)}
                            disabled={updatingId === order.id}
                            className="text-xs bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-2 py-0.5 rounded"
                          >
                            {updatingId === order.id ? '...' : 'Từ chối'}
                          </button>
                        </>
                      )}

                      {/* Đơn đã duyệt: hiển thị nút Hoàn thành */}
                      {order.status === 'Processing' && (
                        <>
                          <button
                            onClick={() => handleComplete(order.id)}
                            disabled={updatingId === order.id}
                            className="text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-2 py-0.5 rounded"
                          >
                            {updatingId === order.id ? '...' : '✓ Hoàn thành'}
                          </button>
                          <button
                            onClick={() => handleCancel(order.id)}
                            disabled={updatingId === order.id}
                            className="text-xs text-red-500 hover:underline disabled:opacity-50"
                          >
                            Hủy
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            ← Trước
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">Trang {page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100"
          >
            Sau →
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          details={orderDetails}
          loading={detailLoading}
          updating={updatingId === selectedOrder.id}
          onClose={() => { setSelectedOrder(null); setOrderDetails(null) }}
          onApprove={handleApprove}
          onReject={handleReject}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

function OrderDetailModal({ order, details, loading, updating, onClose, onApprove, onReject, onComplete, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="font-bold text-lg text-gray-800">Đơn hàng #{order.id}</h2>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>
              {STATUS_LABEL[order.status] || order.status}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="text-sm text-gray-600 space-y-1">
            <div><span className="font-medium">Ngày đặt:</span> {formatDate(order.orderDate)}</div>
            <div><span className="font-medium">Địa chỉ:</span> {order.shippingAddress || '—'}</div>
            <div><span className="font-medium">Tổng tiền:</span> <span className="text-primary-700 font-bold">{formatVND(order.totalAmount)}</span></div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-sm">Danh sách sản phẩm</h3>
            {loading ? (
              <div className="text-center py-4 text-gray-400 text-sm">Đang tải...</div>
            ) : details?.length > 0 ? (
              <div className="space-y-2">
                {details.map((d, i) => (
                  <div key={i} className="flex justify-between text-sm border rounded p-2.5 bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-800">{d.productName}</div>
                      <div className="text-gray-500 text-xs">× {d.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary-600 font-semibold">{formatVND(d.unitPrice * d.quantity)}</div>
                      <div className="text-gray-400 text-xs">{formatVND(d.unitPrice)} / cái</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">Không có sản phẩm.</div>
            )}
          </div>
        </div>

        <div className="p-4 border-t flex gap-2 flex-wrap">
          {/* Đơn chờ duyệt */}
          {order.status === 'Pending' && (
            <>
              <button
                onClick={() => onApprove(order.id)}
                disabled={updating}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 rounded text-sm font-medium"
              >
                {updating ? 'Đang xử lý...' : 'Duyệt đơn hàng (trừ kho)'}
              </button>
              <button
                onClick={() => onReject(order.id)}
                disabled={updating}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-2 rounded text-sm font-medium"
              >
                {updating ? 'Đang xử lý...' : 'Từ chối đơn hàng'}
              </button>
            </>
          )}

          {/* Đơn đã duyệt */}
          {order.status === 'Processing' && (
            <>
              <button
                onClick={() => onComplete(order.id)}
                disabled={updating}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 rounded text-sm font-medium"
              >
                {updating ? 'Đang xử lý...' : '✓ Đánh dấu Hoàn thành'}
              </button>
              <button
                onClick={() => onCancel(order.id)}
                disabled={updating}
                className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-2 rounded text-sm font-medium"
              >
                Hủy & Hoàn kho
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
