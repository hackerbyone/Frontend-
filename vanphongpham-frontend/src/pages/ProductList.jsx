import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import productApi from '../api/productApi'
import categoryApi from '../api/categoryApi'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'

export default function ProductList() {
  const { id: categoryId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const keyword = searchParams.get('q') || ''
  const discountOnly = searchParams.get('discount') === '1'

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 16

  // Input states — chỉ thay đổi UI, chưa gửi API
  const [inputKeyword, setInputKeyword] = useState(keyword)
  const [inputMinPrice, setInputMinPrice] = useState('')
  const [inputMaxPrice, setInputMaxPrice] = useState('')
  const [inputBrand, setInputBrand] = useState('')

  // Applied filter states — trigger API call khi thay đổi
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [brand, setBrand] = useState('')

  // Đồng bộ input keyword khi URL param thay đổi
  useEffect(() => {
    setInputKeyword(keyword)
  }, [keyword])

  // Load danh mục
  useEffect(() => {
    categoryApi.getList()
      .then((res) => setCategories(Array.isArray(res) ? res : []))
      .catch(() => {})
  }, [])

  // Load tên danh mục hiện tại
  useEffect(() => {
    if (categoryId) {
      categoryApi.getById(categoryId)
        .then((res) => setCurrentCategory(res))
        .catch(() => setCurrentCategory(null))
    } else {
      setCurrentCategory(null)
    }
  }, [categoryId])

  // Reset page về 1 khi chuyển danh mục hoặc đổi keyword URL
  useEffect(() => {
    setPage(1)
  }, [categoryId, keyword, discountOnly])

  // Gọi API tìm kiếm theo 3 tiêu chí + phân trang
  useEffect(() => {
    setLoading(true)
    productApi.search({
      keyword,
      categoryId,
      minPrice: minPrice !== '' ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== '' ? Number(maxPrice) : undefined,
      brand: brand !== '' ? brand : undefined,
      discountOnly,
      page,
      pageSize,
    })
      .then((res) => {
        setProducts(res?.items || [])
        setTotalPages(res?.totalPages || 1)
        setTotalCount(res?.totalCount || 0)
      })
      .catch((err) => {
        console.error(err)
        setProducts([])
        setTotalPages(1)
        setTotalCount(0)
      })
      .finally(() => setLoading(false))
  }, [page, categoryId, keyword, minPrice, maxPrice, brand, discountOnly])

  // Áp dụng bộ lọc giá & thương hiệu (click button → gửi API 1 lần)
  const handleApplyFilter = () => {
    setPage(1)
    setMinPrice(inputMinPrice)
    setMaxPrice(inputMaxPrice)
    setBrand(inputBrand)
  }

  // Tìm kiếm theo keyword từ sidebar
  const handleKeywordSearch = (e) => {
    e.preventDefault()
    const q = inputKeyword.trim()
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`)
    } else {
      navigate('/products')
    }
  }

  // Xoá toàn bộ bộ lọc
  const handleClearFilter = () => {
    setInputMinPrice('')
    setInputMaxPrice('')
    setInputBrand('')
    setPage(1)
    setMinPrice('')
    setMaxPrice('')
    setBrand('')
  }

  const hasActiveFilter = minPrice || maxPrice || brand

  const title = keyword
    ? `Kết quả tìm: "${keyword}"`
    : discountOnly
    ? 'Sản phẩm khuyến mãi 🔥'
    : currentCategory?.name || 'Tất cả sản phẩm'

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 fade-in">
      <div className="flex flex-col md:flex-row gap-6">

        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0 space-y-4">

          {/* Danh mục */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <h3 className="bg-primary-700 text-white px-4 py-2.5 font-medium text-sm">
              Danh mục
            </h3>
            <ul>
              <li>
                <Link
                  to="/products"
                  className={`block px-4 py-2 text-sm hover:bg-primary-50 border-b border-gray-100 ${
                    !categoryId && !discountOnly ? 'text-primary-700 font-medium bg-primary-50' : 'text-gray-700'
                  }`}
                >
                  Tất cả sản phẩm
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/category/${c.id}`}
                    className={`block px-4 py-2 text-sm hover:bg-primary-50 border-b border-gray-100 ${
                      Number(categoryId) === c.id ? 'text-primary-700 font-medium bg-primary-50' : 'text-gray-700'
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bộ lọc 3 tiêu chí */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <h3 className="bg-primary-700 text-white px-4 py-2.5 font-medium text-sm">
              Bộ lọc tìm kiếm
            </h3>
            <div className="p-4 space-y-4">

              {/* Tiêu chí 1: Từ khóa */}
              <form onSubmit={handleKeywordSearch}>
                <p className="text-xs font-medium text-gray-600 mb-1.5">1. Từ khóa</p>
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="Tên sản phẩm..."
                    value={inputKeyword}
                    onChange={(e) => setInputKeyword(e.target.value)}
                    className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary-500"
                  />
                  <button
                    type="submit"
                    title="Tìm kiếm"
                    className="shrink-0 bg-primary-500 hover:bg-primary-600 text-white px-2.5 py-1.5 rounded text-xs"
                  >
                    🔍
                  </button>
                </div>
              </form>

              {/* Tiêu chí 2: Khoảng giá */}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1.5">2. Khoảng giá (₫)</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={inputMinPrice}
                    onChange={(e) => setInputMinPrice(e.target.value)}
                    min={0}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={inputMaxPrice}
                    onChange={(e) => setInputMaxPrice(e.target.value)}
                    min={0}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Tiêu chí 3: Thương hiệu */}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1.5">3. Thương hiệu</p>
                <input
                  type="text"
                  placeholder="VD: Thiên Long"
                  value={inputBrand}
                  onChange={(e) => setInputBrand(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary-500"
                />
              </div>

              {/* Nút áp dụng */}
              <button
                onClick={handleApplyFilter}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white text-sm py-2 rounded font-medium transition-colors"
              >
                Áp dụng bộ lọc
              </button>

              {/* Nút xoá + trạng thái filter đang dùng */}
              {hasActiveFilter && (
                <>
                  <button
                    onClick={handleClearFilter}
                    className="w-full text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Xoá bộ lọc
                  </button>
                  <div className="text-xs text-gray-500 border-t pt-3 space-y-1">
                    <p className="font-medium text-gray-600 mb-1">Đang lọc:</p>
                    {minPrice && (
                      <p>• Giá từ: {Number(minPrice).toLocaleString('vi-VN')}₫</p>
                    )}
                    {maxPrice && (
                      <p>• Giá đến: {Number(maxPrice).toLocaleString('vi-VN')}₫</p>
                    )}
                    {brand && <p>• Thương hiệu: {brand}</p>}
                  </div>
                </>
              )}

            </div>
          </div>

        </aside>

        {/* Main content */}
        <main className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{title}</h1>
          <p className="text-sm text-gray-500 mb-4">{totalCount} sản phẩm</p>

          {loading ? (
            <Loading />
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg p-10 text-center text-gray-500">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded border text-sm disabled:opacity-40 hover:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    ← Trước
                  </button>
                  <span className="px-3 py-1.5 text-sm text-gray-600">
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded border text-sm disabled:opacity-40 hover:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Sau →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
