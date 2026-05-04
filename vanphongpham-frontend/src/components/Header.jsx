import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import categoryApi from '../api/categoryApi'

export default function Header() {
  const [keyword, setKeyword] = useState('')
  const [categories, setCategories] = useState([])
  const [showCatMenu, setShowCatMenu] = useState(false)
  const navigate = useNavigate()
  const { totalQuantity } = useCart()
  const { user, logout } = useAuth()

  useEffect(() => {
    categoryApi.getList()
      .then((res) => {
        setCategories(Array.isArray(res) ? res.slice(0, 12) : [])
      })
      .catch(() => setCategories([]))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!keyword.trim()) return
    navigate(`/search?q=${encodeURIComponent(keyword.trim())}`)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-primary-700 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between">
          <span>Hotline: 0827027392 - Mở cửa 8:00 - 22:00</span>
          <div className="space-x-4 hidden sm:flex">
            <Link to="/orders" className="hover:underline">Tra cứu đơn hàng</Link>
            <span>|</span>
            <Link to="/about" className="hover:underline">Về chúng tôi</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            V
          </div>
          <div className="leading-tight">
            <div className="font-bold text-primary-700 text-lg">Dụng cụ học tập</div>
            <div className="text-xs text-gray-500">Online Store</div>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="flex border-2 border-primary-500 rounded-full overflow-hidden">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Bạn cần tìm sản phẩm gì..."
              className="flex-1 px-4 py-2 outline-none text-sm"
            />
            <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white px-6 text-sm font-medium">
              🔍 Tìm kiếm
            </button>
          </div>
        </form>

        {/* User + Cart */}
        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden md:inline">Chào, <b>{user.name || user.username}</b></span>
              <Link to="/orders" className="text-primary-600 hover:underline hidden md:inline">Đơn hàng</Link>
              {(user.roles?.includes('Admin') || user.role === 'Admin') && (
                <Link to="/admin" className="text-orange-600 hover:underline hidden md:inline font-medium">Admin</Link>
              )}
              <button onClick={logout} className="text-primary-600 hover:underline">Đăng xuất</button>
            </div>
          ) : (
            <Link to="/login" className="text-sm text-primary-700 hover:underline">
              Đăng nhập
            </Link>
          )}

          <Link to="/cart" className="relative flex items-center gap-1 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            🛒 Giỏ hàng
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category nav */}
      <nav className="bg-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center text-sm">
          <div
            className="relative bg-primary-700 px-4 py-2.5 font-medium cursor-pointer flex items-center gap-2"
            onMouseEnter={() => setShowCatMenu(true)}
            onMouseLeave={() => setShowCatMenu(false)}
          >
            ☰ Danh mục sản phẩm
            {showCatMenu && categories.length > 0 && (
              <div className="absolute top-full left-0 w-72 bg-white text-gray-800 shadow-xl z-50 max-h-96 overflow-y-auto">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/category/${c.id}`}
                    className="block px-4 py-2.5 hover:bg-primary-50 hover:text-primary-700 border-b border-gray-100 text-sm"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/" className="px-4 py-2.5 hover:bg-primary-600">Trang chủ</Link>
          <Link to="/products" className="px-4 py-2.5 hover:bg-primary-600">Tất cả sản phẩm</Link>
          <Link to="/products?discount=1" className="px-4 py-2.5 hover:bg-primary-600">Khuyến mãi 🔥</Link>
          <Link to="/contact" className="px-4 py-2.5 hover:bg-primary-600">Liên hệ</Link>
        </div>
      </nav>
    </header>
  )
}
