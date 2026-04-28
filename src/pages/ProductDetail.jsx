import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import productApi from '../api/productApi'
import { formatVND, resolveImageUrl } from '../utils/format'
import { useCart } from '../contexts/CartContext'
import Loading from '../components/Loading'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setQuantity(1)
    productApi.getById(id)
      .then((res) => {
        const p = res
        setProduct(p)
        if (p?.categoryId) {
          productApi.getList({ categoryId: p.categoryId, pageSize: 6 })
            .then((r) => {
              const list = r?.items || []
              setRelated(list.filter((x) => x.id !== p.id).slice(0, 5))
            })
            .catch(() => {})
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-10 text-center text-gray-500">
        Không tìm thấy sản phẩm.{' '}
        <Link to="/products" className="text-primary-600 hover:underline">Quay lại</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 fade-in">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-primary-600">Sản phẩm</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      {/* Chi tiết */}
      <div className="bg-white rounded-lg p-6 grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={resolveImageUrl(product.imageUrl)}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600?text=No+Image' }}
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h1>
          <div className="text-3xl font-bold text-primary-600 mb-4">{formatVND(product.price)}</div>

          <div className="border-t border-b py-4 mb-4 space-y-2 text-sm">
            <div><span className="text-gray-500">Mã sản phẩm:</span> <b>#{product.id}</b></div>
            {product.manufacturer && (
              <div>
                <span className="text-gray-500">Nhà sản xuất:</span>{' '}
                <b className="text-gray-800">{product.manufacturer.name}</b>
              </div>
            )}
            <div>
              <span className="text-gray-500">Tình trạng:</span>{' '}
              <b className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
              </b>
            </div>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

          {/* Số lượng + Mua */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600">Số lượng:</span>
            <div className="flex items-center border rounded">
              <button
                className="px-3 py-1 hover:bg-gray-100"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >−</button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, +e.target.value || 1))}
                className="w-14 text-center outline-none py-1"
              />
              <button
                className="px-3 py-1 hover:bg-gray-100"
                onClick={() => setQuantity((q) => q + 1)}
              >+</button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => addItem(product, quantity)}
              disabled={product.stock <= 0}
              className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white px-6 py-3 rounded font-medium"
            >
              🛒 Thêm vào giỏ
            </button>
            <Link
              to="/cart"
              onClick={() => addItem(product, quantity)}
              className="flex-1 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded font-medium text-center"
            >
              Mua ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
