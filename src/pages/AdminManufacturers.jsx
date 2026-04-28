import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import manufacturerApi from '../api/manufacturerApi'
import { toast } from 'react-toastify'

const emptyForm = { name: '', description: '', website: '', phone: '' }

export default function AdminManufacturers() {
  const { user } = useAuth()
  const [manufacturers, setManufacturers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const load = () => {
    setLoading(true)
    manufacturerApi.getList()
      .then((res) => setManufacturers(Array.isArray(res) ? res : []))
      .catch(() => toast.error('Không tải được danh sách nhà sản xuất'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (m) => {
    setEditingId(m.id)
    setForm({ name: m.name, description: m.description || '', website: m.website || '', phone: m.phone || '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Tên nhà sản xuất không được để trống'); return }
    setSaving(true)
    try {
      if (editingId) {
        await manufacturerApi.update(editingId, form)
        toast.success('Cập nhật thành công')
      } else {
        await manufacturerApi.create(form)
        toast.success('Thêm nhà sản xuất thành công')
      }
      setShowModal(false)
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lưu thất bại')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa nhà sản xuất này?')) return
    setDeletingId(id)
    try {
      await manufacturerApi.delete(id)
      toast.success('Đã xóa nhà sản xuất')
      setManufacturers((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xóa thất bại')
    } finally {
      setDeletingId(null)
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
    <div className="max-w-5xl mx-auto px-4 py-6 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý nhà sản xuất</h1>
        <div className="flex gap-3">
          <Link to="/admin" className="text-sm text-primary-600 hover:underline">← Dashboard</Link>
          <span className="text-gray-300">|</span>
          <Link to="/admin/products" className="text-sm text-primary-600 hover:underline">Sản phẩm</Link>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={openAdd}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Thêm nhà sản xuất
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Đang tải...</div>
      ) : manufacturers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Chưa có nhà sản xuất nào.</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 w-12">ID</th>
                <th className="px-4 py-3 text-left text-gray-600">Tên nhà sản xuất</th>
                <th className="px-4 py-3 text-left text-gray-600 hidden md:table-cell">Mô tả</th>
                <th className="px-4 py-3 text-left text-gray-600 hidden md:table-cell w-40">Website</th>
                <th className="px-4 py-3 text-left text-gray-600 w-28">SĐT</th>
                <th className="px-4 py-3 text-left text-gray-600 w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {manufacturers.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400 text-xs">#{m.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{m.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell truncate max-w-xs">{m.description || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {m.website ? (
                      <span className="text-blue-500">{m.website}</span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{m.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(m)}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={deletingId === m.id}
                        className="text-xs text-red-500 hover:underline disabled:opacity-50"
                      >
                        {deletingId === m.id ? '...' : 'Xóa'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editingId ? 'Sửa nhà sản xuất' : 'Thêm nhà sản xuất mới'}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhà sản xuất <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
                  placeholder="Ví dụ: Thiên Long"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
                  placeholder="Mô tả ngắn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
                  placeholder="Ví dụ: thienlong.com.vn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
                  placeholder="Ví dụ: 028 3812 0512"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-lg font-medium"
              >
                {saving ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm mới')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
