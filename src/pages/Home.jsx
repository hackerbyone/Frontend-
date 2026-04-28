import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import productApi from '../api/productApi'
import categoryApi from '../api/categoryApi'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Gọi song song 2 API: products + categories
    // Mỗi lần user load trang chủ, frontend gọi REST -> luôn lấy data mới nhất
    Promise.all([productApi.getList({ pageSize: 12 }), categoryApi.getList()])
      .then(([prodRes, catRes]) => {
        // Backend trả { items: [...], totalCount, ... } cho products; array cho categories
        setProducts(prodRes?.items || [])
        setCategories(Array.isArray(catRes) ? catRes : [])
      })
      .catch((err) => console.error('Load home failed:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="fade-in">
      {/* Hero banner */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-accent-500 font-medium mb-2">🎉 Khuyến mãi tháng này</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Văn phòng phẩm <br />
              <span className="text-accent-500">chính hãng - giá tốt</span>
            </h1>
            <p className="text-gray-200 mb-6">
              Hơn 1.000+ sản phẩm dụng cụ học tập, văn phòng. Giao hàng toàn quốc trong 24h.
            </p>
            <Link
              to="/products"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-full font-medium"
            >
              Mua sắm ngay →
            </Link>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="w-72 h-72 bg-white/10 rounded-full flex items-center justify-center text-9xl backdrop-blur">
              ✏️
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* Danh mục nổi bật */}
        <section className="my-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Danh mục nổi bật</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {categories.slice(0, 16).map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.id}`}
                className="bg-white border border-gray-200 hover:border-primary-500 rounded-lg p-3 text-center hover:shadow transition"
              >
                <div className="w-12 h-12 mx-auto bg-primary-50 rounded-full flex items-center justify-center text-2xl mb-1">
                  📦
                </div>
                <div className="text-xs font-medium text-gray-700 line-clamp-2">{c.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Sản phẩm mới */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Sản phẩm nổi bật</h2>
            <Link to="/products" className="text-sm text-primary-600 hover:underline">
              Xem tất cả →
            </Link>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {products.slice(0, 10).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Banner ưu đãi */}
        <section className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '🚚', title: 'Giao hàng miễn phí', desc: 'Cho đơn từ 300.000đ' },
            { icon: '🛡️', title: 'Bảo hành chính hãng', desc: 'Đổi trả trong 7 ngày' },
            { icon: '💳', title: 'Thanh toán linh hoạt', desc: 'COD, chuyển khoản, thẻ' },
          ].map((b, i) => (
            <div key={i} className="bg-white rounded-lg p-5 flex items-center gap-4 border border-gray-200">
              <div className="text-3xl">{b.icon}</div>
              <div>
                <div className="font-semibold text-gray-800">{b.title}</div>
                <div className="text-sm text-gray-500">{b.desc}</div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
