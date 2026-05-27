import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function CartWidget() {
  const { totalQuantity } = useCart()

  return (
    <NavLink
      to="/carrito"
      className={({ isActive }) =>
        isActive ? 'cart-widget active' : 'cart-widget'
      }
      aria-label="Ir al carrito"
    >
      <svg
        className="cart-icon"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {totalQuantity > 0 && <span className="cart-badge">{totalQuantity}</span>}
    </NavLink>
  )
}

export default CartWidget
