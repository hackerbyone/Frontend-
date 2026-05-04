import { useEffect, useState, useRef } from 'react'
import productApi from '../api/productApi'
import manufacturerApi from '../api/manufacturerApi'
import { resolveImageUrl, formatVND } from '../utils/format'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export default function AdminProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [manufacturers, setManufacturers] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(null)
  const [editingDiscount, setEditingDiscount] = useState(null) // { id, value }
  const [savingDiscount, setSavingDiscount] = useState(null)
  const [editingMfr, setEditingMfr] = useState(null) // { id, value }
  const [savingMfr, setSavingMfr] = useState(null)
  const fileInputRef = useRef({})

  useEffect(() => {
    Promise.all([
      productApi.getList({ pageSize: 100 }),
      manufacturerApi.getList(),
    ])
      .then(([prodRes, mfrRes]) => {
        setProducts(prodRes?.items || [])
        setManufacturers(Array.isArray(mfrRes) ? mfrRes : [])
      })
      .catch(() => toast.error('Không tải được dữ liệu'))
      .finally(() => setLoading(false))
  }, [])

  const handleFileChange = async (productId, file) => {
    if (!file) return
    setUploading(productId)
    try {
      const res = await productApi.uploadImage(productId, file)
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, imageUrl: res.imageUrl } : p))
      )
      toast.success('Upload ảnh thành công!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload ảnh thất bại')
    } finally {
      setUploading(null)
    }
  }

  const handleDiscountEdit = (product) => {
    setEditingDiscount({ id: product.id, value: product.discountPercent ?? 0 })
  }

  const handleMfrEdit = (product) => {
    setEditingMfr({ id: product.id, value: product.manufacturerId ?? 0 })
  }

  const handleMfrSave = async (productId) => {
    setSavingMfr(productId)
    try {
      await productApi.update(productId, { manufacturerId: editingMfr.value || 0 })
      const mfrName = manufacturers.find((m) => m.id === editingMfr.value)?.name || null
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, manufacturerId: editingMfr.value || null, manufacturer: mfrName ? { id: editingMfr.value, name: mfrName } : null }
            : p
        )
      )
      toast.success('Đã cập nhật nhà sản xuất')
      setEditingMfr(null)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setSavingMfr(null)
    }
  }

  const handleDiscountSave = async (productId) => {
    const val = parseFloat(editingDiscount.value)
    if (isNaN(val) || val < 0 || val > 99) {
      toast.error('Giảm giá phải từ 0 đến 99%')
      return
    }
    setSavingDiscount(productId)
    try {
      await productApi.updateDiscount(productId, val)
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, discountPercent: val } : p))
      )
      toast.success(`Đã cập nhật giảm giá ${val}%`)
      setEditingDiscount(null)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cập nhật giảm giá thất bại')
    } finally {
      setSavingDiscount(null)
    }
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center text-gray-500">
        Bạn cần <Link to="/login" className="text-primary-600 hover:underline">đăng nhập</Link> để truy cập trang này.
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
        <div className="flex gap-3">
          <Link to="/admin" className="text-sm text-primary-600 hover:underline">← Dashboard</Link>
          <span className="text-gray-300">|</span>
          <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline">Quản lý đơn hàng</Link>
          <span className="text-gray-300">|</span>
          <Link to="/products" className="text-sm text-primary-600 hover:underline">Về cửa hàng</Link>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
        <b>Hướng dẫn:</b> Nhấn <b>Chọn ảnh</b> để upload ảnh. Nhấn <b>Sửa</b> ở cột giảm giá hoặc nhà sản xuất để cập nhật thông tin.
        <Link to="/admin/manufacturers" className="ml-2 text-primary-600 hover:underline">Quản lý nhà sản xuất →</Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Đang tải...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Không có sản phẩm nào.</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 w-14">ID</th>
                <th className="px-4 py-3 text-left text-gray-600 w-16">Ảnh</th>
                <th className="px-4 py-3 text-left text-gray-600">Tên sản phẩm</th>
                <th className="px-4 py-3 text-left text-gray-600 w-32">Giá gốc</th>
                <th className="px-4 py-3 text-left text-gray-600 w-40">Giảm giá / Giá sau</th>
                <th className="px-4 py-3 text-left text-gray-600 w-44">Nhà sản xuất</th>
                <th className="px-4 py-3 text-left text-gray-600 w-36">Upload ảnh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                const disc = p.discountPercent ?? 0
                const discountedPrice = disc > 0 ? p.price * (1 - disc / 100) : null
                const isEditing = editingDiscount?.id === p.id
                const isEditingMfr = editingMfr?.id === p.id

                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">#{p.id}</td>
                    <td className="px-4 py-3">
                      <img
                        src={resolveImageUrl(p.imageUrl)}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded border border-gray-200"
                        onError={(e) => { e.currentTarget.src = '/placeholder.svg' }}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-gray-700">{formatVND(p.price)}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            max={99}
                            step={1}
                            value={editingDiscount.value}
                            onChange={(e) => setEditingDiscount(prev => ({ ...prev, value: e.target.value }))}
                            className="w-16 border rounded px-2 py-1 text-xs outline-none focus:border-primary-500"
                          />
                          <span className="text-xs text-gray-500">%</span>
                          <button
                            onClick={() => handleDiscountSave(p.id)}
                            disabled={savingDiscount === p.id}
                            className="text-xs bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white px-2 py-1 rounded"
                          >
                            {savingDiscount === p.id ? '...' : 'Lưu'}
                          </button>
                          <button
                            onClick={() => setEditingDiscount(null)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {disc > 0 ? (
                            <div>
                              <div className="text-red-500 font-bold text-xs">-{disc}%</div>
                              <div className="text-primary-600 font-semibold text-xs">{formatVND(discountedPrice)}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">Không giảm</span>
                          )}
                          <button
                            onClick={() => handleDiscountEdit(p)}
                            className="text-xs text-blue-500 hover:underline ml-1"
                          >
                            Sửa
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditingMfr ? (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={editingMfr.value}
                            onChange={(e) => setEditingMfr((prev) => ({ ...prev, value: Number(e.target.value) }))}
                            className="border rounded px-2 py-1 text-xs outline-none focus:border-primary-500"
                          >
                            <option value={0}>— Chưa xác định</option>
                            {manufacturers.map((m) => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleMfrSave(p.id)}
                            disabled={savingMfr === p.id}
                            className="text-xs bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white px-2 py-1 rounded"
                          >
                            {savingMfr === p.id ? '...' : 'Lưu'}
                          </button>
                          <button
                            onClick={() => setEditingMfr(null)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-700 truncate max-w-[100px]">
                            {p.manufacturer?.name || <span className="text-gray-400">Chưa xác định</span>}
                          </span>
                          <button
                            onClick={() => handleMfrEdit(p)}
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Sửa
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif,.webp"
                        className="hidden"
                        ref={(el) => { fileInputRef.current[p.id] = el }}
                        onChange={(e) => handleFileChange(p.id, e.target.files[0])}
                      />
                      <button
                        onClick={() => fileInputRef.current[p.id]?.click()}
                        disabled={uploading === p.id}
                        className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white text-xs px-3 py-1.5 rounded font-medium"
                      >
                        {uploading === p.id ? 'Đang upload...' : '📷 Chọn ảnh'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
