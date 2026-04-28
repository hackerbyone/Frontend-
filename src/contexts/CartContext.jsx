import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const CartContext = createContext(null)
const STORAGE_KEY = 'vpp_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  // Tải giỏ hàng từ localStorage khi mở app
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try { setItems(JSON.parse(stored)) } catch {}
    }
  }, [])

  // Lưu giỏ hàng mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id)
      if (existing) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, quantity: it.quantity + quantity } : it
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
        },
      ]
    })
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`)
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeItem(id)
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity } : it)))
  }

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  const clearCart = () => setItems([])

  const totalQuantity = items.reduce((sum, it) => sum + it.quantity, 0)
  const totalAmount = items.reduce((sum, it) => sum + it.price * it.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalQuantity, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
