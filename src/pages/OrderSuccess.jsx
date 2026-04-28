import { Link, useLocation } from 'react-router-dom'

export default function OrderSuccess() {
  const { state } = useLocation()
  const order = state?.order

  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center fade-in">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h1>
      <p className="text-gray-500 mb-2">
        Cảm ơn bạn đã mua sắm tại Văn Phòng Phẩm Online.
      </p>
      {order?.id && (
        <p className="text-gray-700 mb-6">
          Mã đơn hàng: <b className="text-primary-700">#{order.id}</b>
        </p>
      )}
      <p className="text-sm text-gray-500 mb-6">
        Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
      </p>
      <div className="space-x-3">
        <Link to="/" className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded font-medium">
          Về trang chủ
        </Link>
        <Link to="/products" className="border border-primary-500 text-primary-600 hover:bg-primary-50 px-5 py-2.5 rounded font-medium">
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  )
}
