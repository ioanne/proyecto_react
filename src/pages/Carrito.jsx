import { Link } from 'react-router-dom'
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa'
import { useCart } from '../context/CartContext.jsx'
import { formatPrecio } from '../components/Item.jsx'
import ProductImage from '../components/ProductImage.jsx'
import Seo from '../components/Seo.jsx'

function Carrito() {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
    totalQuantity,
  } = useCart()

  if (cart.length === 0) {
    return (
      <section className="container cart-empty">
        <Seo title="Carrito" description="Revisá los productos de tu carrito." />
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
      <Seo
        title="Carrito"
        description="Revisá los productos de tu carrito antes de finalizar la compra."
      />
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
              <span className="cart-item-unit">
                {formatPrecio(item.precio)} c/u
              </span>
            </div>

            <div
              className="cart-qty-control"
              role="group"
              aria-label={`Cantidad de ${item.nombre}`}
            >
              <button
                type="button"
                className="qty-btn"
                onClick={() => decreaseQuantity(item.id)}
                disabled={item.cantidad <= 1}
                aria-label={`Disminuir cantidad de ${item.nombre}`}
              >
                <FaMinus aria-hidden="true" />
              </button>
              <span className="qty-value">{item.cantidad}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => increaseQuantity(item.id)}
                aria-label={`Aumentar cantidad de ${item.nombre}`}
              >
                <FaPlus aria-hidden="true" />
              </button>
            </div>

            <span className="cart-item-subtotal">
              {formatPrecio(item.precio * item.cantidad)}
            </span>

            <button
              type="button"
              className="btn btn-danger btn-sm cart-remove"
              onClick={() => removeFromCart(item.id)}
              aria-label={`Quitar ${item.nombre} del carrito`}
            >
              <FaTrash aria-hidden="true" /> <span>Quitar</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        <button type="button" className="btn btn-ghost" onClick={clearCart}>
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
