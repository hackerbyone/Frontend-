/** Định dạng tiền VND: 30000000 -> "30.000.000 ₫" */
export const formatVND = (value) => {
  if (value == null) return ''
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Định dạng ngày: ISO -> "26/04/2026" */
export const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN')
}

/** Resolve URL ảnh: nếu backend trả về tên file (img1.jpg) thì ghép base */
export const resolveImageUrl = (url) => {
  if (!url) return '/placeholder.svg'
  if (url.startsWith('http')) return url
  if (url.startsWith('/')) return url
  return `/uploads/${url}`
}
