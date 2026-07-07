import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react'

const CartContext = createContext()

const STORAGE_KEY = 'tecnovirtual.cart'

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un <CartProvider>')
  }
  return context
}

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
  const [cart, setCart] = useState(leerCarritoGuardado)
  const [toast, setToast] = useState({ show: false, message: '' })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // localStorage puede fallar (modo privado, cuota); seguimos en memoria.
    }
  }, [cart])

  const hideToast = useCallback(
    () => setToast((prev) => ({ ...prev, show: false })),
    [],
  )

  const addToCart = useCallback((producto, cantidad = 1) => {
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
    setToast({ show: true, message: `${producto.nombre} agregado al carrito` })
  }, [])

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const increaseQuantity = useCallback((id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item,
      ),
    )
  }, [])

  const decreaseQuantity = useCallback((id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.max(1, item.cantidad - 1) }
          : item,
      ),
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const isInCart = useCallback(
    (id) => cart.some((item) => item.id === id),
    [cart],
  )

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
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isInCart,
    totalQuantity,
    totalPrice,
    toast,
    hideToast,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartContext
