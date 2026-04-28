import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import productApi from '../api/productApi'
import categoryApi from '../api/categoryApi'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'

/**
 * Trang dùng cho 3 route:
 *  - /products            -> tất cả
 *  - /category/:id        -> theo danh mục
 *  - /search?q=keyword    -> kết quả tìm kiếm
 */
export default function ProductList() {
  const { id: categoryId } = useParams()
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [currentCategory, setCurrentCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 16

  useEffect(() => {
    categoryApi.getList()
      .then((res) => setCategories(Array.isArray(res) ? res : []))
      .catch(() => {})
  }, [])

  // Reset về trang 1 khi thay đổi bộ lọc
  useEffect(() => {
    setPage(1)
  }, [categoryId, keyword])

  // Fetch danh mục hiện tại để lấy tên
  useEffect(() => {
    if (categoryId) {
      categoryApi.getById(categoryId)
        .then((res) => setCurrentCategory(res))
        .catch(() => setCurrentCategory(null))
    } else {
      setCurrentCategory(null)
    }
  }, [categoryId])

  // Fetch sản phẩm từ backend với phân trang
  useEffect(() => {
    setLoading(true)
    const params = { page, pageSize }
    if (categoryId) params.categoryId = categoryId
    if (keyword) params.keyword = keyword

    productApi.getList(params)
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
  }, [page, categoryId, keyword])

  const title = keyword
    ? `Kết quả tìm: "${keyword}"`
    : currentCategory?.name || 'Tất cả sản phẩm'

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar danh mục */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <h3 className="bg-primary-700 text-white px-4 py-2.5 font-medium text-sm">
              Danh mục
            </h3>
            <ul>
              <li>
                <Link
                  to="/products"
                  className={`block px-4 py-2 text-sm hover:bg-primary-50 border-b border-gray-100 ${
                    !categoryId ? 'text-primary-700 font-medium bg-primary-50' : 'text-gray-700'
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
        </aside>

        {/* Main */}
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

              {/* Phân trang */}
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
