import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import orderApi from '../api/orderApi'
import { formatVND, formatDate } from '../utils/format'
import { toast } from 'react-toastify'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [pendingOrders, setPendingOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      orderApi.getStats(),
      orderApi.getAllOrders({ status: 'Pending', page: 1, pageSize: 5 })
    ])
      .then(([statsRes, ordersRes]) => {
        setStats(statsRes)
        setPendingOrders(ordersRes?.items || [])
      })
      .catch(() => toast.error('Không tải được dữ liệu dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center text-gray-500">
        Bạn cần <Link to="/login" className="text-primary-600 hover:underline">đăng nhập</Link> với quyền Admin.
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Xin chào, <b>{user.name || user.username}</b></p>
        </div>
        <Link to="/products" className="text-sm text-primary-600 hover:underline">← Về cửa hàng</Link>
      </div>

      {/* Quick navigation */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          to="/admin/orders"
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          📋 Quản lý đơn hàng
          {stats?.pendingOrders > 0 && (
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">
              {stats.pendingOrders}
            </span>
          )}
        </Link>
        <Link
          to="/admin/products"
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium"
        >
          📦 Quản lý sản phẩm
        </Link>
        <Link
          to="/admin/manufacturers"
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium"
        >
          🏭 Nhà sản xuất
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Stats chính */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatCard
              label="Tổng đơn hàng"
              value={stats?.totalOrders ?? 0}
              icon="📦"
              color="bg-blue-50 border-blue-200"
              textColor="text-blue-700"
            />
            <StatCard
              label="Chờ duyệt"
              value={stats?.pendingOrders ?? 0}
              icon="⏳"
              color="bg-yellow-50 border-yellow-200"
              textColor="text-yellow-700"
              highlight={(stats?.pendingOrders ?? 0) > 0}
            />
            <StatCard
              label="Hoàn thành"
              value={stats?.completedOrders ?? 0}
              icon="✅"
              color="bg-green-50 border-green-200"
              textColor="text-green-700"
            />
            <StatCard
              label="Doanh thu (đã hoàn thành)"
              value={formatVND(stats?.totalRevenue ?? 0)}
              icon="💰"
              color="bg-orange-50 border-orange-200"
              textColor="text-orange-700"
              isText
            />
          </div>

          {/* Stats phụ */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <StatCard
              label="Đang xử lý"
              value={stats?.processingOrders ?? 0}
              icon="🔄"
              color="bg-indigo-50 border-indigo-200"
              textColor="text-indigo-700"
            />
            <StatCard
              label="Từ chối"
              value={stats?.rejectedOrders ?? 0}
              icon="❌"
              color="bg-red-50 border-red-200"
              textColor="text-red-700"
            />
            <StatCard
              label="Đã hủy"
              value={stats?.cancelledOrders ?? 0}
              icon="🚫"
              color="bg-gray-50 border-gray-200"
              textColor="text-gray-600"
            />
            <StatCard
              label="Tổng sản phẩm"
              value={stats?.totalProducts ?? 0}
              icon="🏷️"
              color="bg-purple-50 border-purple-200"
              textColor="text-purple-700"
            />
            <StatCard
              label="Nhà sản xuất"
              value={stats?.totalManufacturers ?? 0}
              icon="🏭"
              color="bg-teal-50 border-teal-200"
              textColor="text-teal-700"
            />
          </div>

          {/* Đơn chờ duyệt */}
          {pendingOrders.length > 0 ? (
            <div className="bg-white rounded-lg border border-yellow-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-yellow-50 border-b border-yellow-200">
                <h2 className="font-semibold text-yellow-800">
                  ⏳ Đơn hàng chờ duyệt ({stats?.pendingOrders})
                </h2>
                <Link to="/admin/orders" className="text-sm text-yellow-700 hover:underline font-medium">
                  Xem tất cả →
                </Link>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium w-16">Mã ĐH</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium">Địa chỉ giao hàng</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium w-28">Ngày đặt</th>
                    <th className="px-4 py-2 text-left text-gray-500 font-medium w-28">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-yellow-50">
                      <td className="px-4 py-2.5 font-mono text-gray-500 text-xs">#{order.id}</td>
                      <td className="px-4 py-2.5 text-gray-700 truncate max-w-xs">{order.shippingAddress || '—'}</td>
                      <td className="px-4 py-2.5 text-gray-500">{formatDate(order.orderDate)}</td>
                      <td className="px-4 py-2.5 font-semibold text-primary-700">{formatVND(order.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-center">
                <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline font-medium">
                  Đến trang quản lý đơn hàng để duyệt →
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-700 font-semibold text-lg">✅ Không có đơn hàng nào đang chờ duyệt</p>
              <p className="text-green-600 text-sm mt-1">Tất cả đơn hàng đã được xử lý</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, color, textColor, highlight, isText }) {
  return (
    <div className={`border rounded-lg p-4 ${color} ${highlight ? 'ring-2 ring-yellow-400 shadow-md' : ''}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`font-bold ${textColor} ${isText ? 'text-base' : 'text-2xl tabular-nums'}`}>
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}
