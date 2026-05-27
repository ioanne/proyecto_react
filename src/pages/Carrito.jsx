import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrecio } from '../components/Item.jsx'
import ProductImage from '../components/ProductImage.jsx'

function Carrito() {
  const { cart, removeFromCart, clearCart, totalPrice, totalQuantity } =
    useCart()

  if (cart.length === 0) {
    return (
      <section className="container cart-empty">
        <h1 className="page-title">Tu carrito</h1>
        <p className="status-msg">Todavía no agregaste productos.</p>
        <Link to="/productos" className="btn btn-primary">
          Ir al catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className="container cart">
      <h1 className="page-title">Tu carrito ({totalQuantity})</h1>

      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item.id} className="cart-item">
            <ProductImage producto={item} className="cart-thumb" />
            <div className="cart-item-info">
              <Link to={`/producto/${item.id}`} className="cart-item-name">
                {item.nombre}
              </Link>
              <span className="cart-item-cat">{item.categoria}</span>
            </div>
            <span className="cart-item-qty">x{item.cantidad}</span>
            <span className="cart-item-subtotal">
              {formatPrecio(item.precio * item.cantidad)}
            </span>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeFromCart(item.id)}
              aria-label={`Quitar ${item.nombre}`}
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        <button className="btn btn-ghost" onClick={clearCart}>
          Vaciar carrito
        </button>
        <div className="cart-total">
          <span>Total:</span>
          <strong>{formatPrecio(totalPrice)}</strong>
        </div>
      </div>
    </section>
  )
}

export default Carrito
