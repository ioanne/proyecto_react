import { createContext, useContext, useState, useMemo, useEffect } from 'react'

const CartContext = createContext()

const STORAGE_KEY = 'tecnovirtual.cart'

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un <CartProvider>')
  }
  return context
}

// Lee el carrito guardado en localStorage (si existe y es válido).
const leerCarritoGuardado = () => {
  if (typeof window === 'undefined') return []
  try {
    const guardado = window.localStorage.getItem(STORAGE_KEY)
    const parseado = guardado ? JSON.parse(guardado) : []
    return Array.isArray(parseado) ? parseado : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  // Inicialización perezosa: el carrito arranca con lo que haya en localStorage.
  const [cart, setCart] = useState(leerCarritoGuardado)

  // Cada vez que cambia el carrito, lo persistimos en localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Si localStorage no está disponible (modo privado, cuota llena, etc.)
      // la app sigue funcionando solo en memoria.
    }
  }, [cart])

  const addToCart = (producto, cantidad = 1) => {
    setCart((prev) => {
      const existente = prev.find((item) => item.id === producto.id)
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item,
        )
      }
      return [...prev, { ...producto, cantidad }]
    })
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => setCart([])

  const isInCart = (id) => cart.some((item) => item.id === id)

  const totalQuantity = useMemo(
    () => cart.reduce((acc, item) => acc + item.cantidad, 0),
    [cart],
  )

  const totalPrice = useMemo(
    () => cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [cart],
  )

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    totalQuantity,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartContext
