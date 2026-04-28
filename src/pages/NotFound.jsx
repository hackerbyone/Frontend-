import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy trang</h1>
      <p className="text-gray-500 mb-6">Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <Link to="/" className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded">
        ← Về trang chủ
      </Link>
    </div>
  )
}
