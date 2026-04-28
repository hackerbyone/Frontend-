import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { formatVND, resolveImageUrl } from '../utils/format'

export default function Cart() {
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-6">Hãy thêm sản phẩm yêu thích vào giỏ hàng.</p>
        <Link
          to="/products"
          className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded font-medium"
        >
          ← Tiếp tục mua sắm
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Giỏ hàng của bạn</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Sản phẩm</th>
                <th className="p-3 w-32">Số lượng</th>
                <th className="p-3 w-32">Thành tiền</th>
                <th className="p-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-gray-100">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveImageUrl(it.imageUrl)}
                        alt={it.name}
                        className="w-16 h-16 object-cover rounded border"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100' }}
                      />
                      <div>
                        <div className="font-medium text-gray-800">{it.name}</div>
                        <div className="text-primary-600 text-sm">{formatVND(it.price)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="inline-flex border rounded">
                      <button
                        className="px-2 hover:bg-gray-100"
                        onClick={() => updateQuantity(it.id, it.quantity - 1)}
                      >−</button>
                      <input
                        type="number"
                        value={it.quantity}
                        onChange={(e) => updateQuantity(it.id, Math.max(1, +e.target.value || 1))}
                        className="w-12 text-center outline-none"
                      />
                      <button
                        className="px-2 hover:bg-gray-100"
                        onClick={() => updateQuantity(it.id, it.quantity + 1)}
                      >+</button>
                    </div>
                  </td>
                  <td className="p-3 text-center font-semibold text-primary-700">
                    {formatVND(it.price * it.quantity)}
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => removeItem(it.id)} className="text-red-500 hover:text-red-700">
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 border-t flex justify-between text-sm">
            <Link to="/products" className="text-primary-600 hover:underline">← Tiếp tục mua sắm</Link>
            <button onClick={clearCart} className="text-red-500 hover:underline">Xoá giỏ hàng</button>
          </div>
        </div>

        {/* Tổng kết */}
        <aside className="bg-white rounded-lg p-5 h-fit sticky top-32">
          <h3 className="font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>
          <div className="space-y-2 text-sm border-b pb-3 mb-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Tạm tính</span>
              <span>{formatVND(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phí vận chuyển</span>
              <span>Tính ở bước sau</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Tổng cộng</span>
            <span className="text-primary-700">{formatVND(totalAmount)}</span>
          </div>
          <Link
            to="/checkout"
            className="block bg-accent-500 hover:bg-accent-600 text-white text-center py-3 rounded font-medium"
          >
            Tiến hành đặt hàng →
          </Link>
        </aside>
      </div>
    </div>
  )
}
