import { Link } from 'react-router-dom'
import { formatVND, resolveImageUrl } from '../utils/format'
import { useCart } from '../contexts/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  const disc = product.discountPercent ?? 0
  const effectivePrice = disc > 0 ? product.price * (1 - disc / 100) : product.price

  const handleAddCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ ...product, price: effectivePrice }, 1)
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={resolveImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image' }}
        />
        {disc > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{disc}%
          </span>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 min-h-[2.5rem]">
          {product.name}
        </h3>
        {product.manufacturer?.name && (
          <p className="text-xs text-gray-400 mb-1 truncate">{product.manufacturer.name}</p>
        )}
        <div className="mt-auto">
          {disc > 0 ? (
            <div className="mb-2">
              <div className="text-red-600 font-bold text-base leading-tight">{formatVND(effectivePrice)}</div>
              <div className="text-gray-400 line-through text-xs">{formatVND(product.price)}</div>
            </div>
          ) : (
            <div className="text-primary-600 font-bold text-base mb-2">{formatVND(product.price)}</div>
          )}
          <button
            onClick={handleAddCart}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white text-xs py-2 rounded font-medium"
          >
            + Thêm vào giỏ
          </button>
        </div>
      </div>
    </Link>
  )
}
