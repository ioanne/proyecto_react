import { Link } from 'react-router-dom'
import ProductImage from './ProductImage.jsx'
import { useCart } from '../context/CartContext.jsx'

export const formatPrecio = (valor) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor)

function Item({ producto }) {
  const { id, nombre, categoria, precio } = producto
  const { addToCart } = useCart()

  return (
    <article className="item-card">
      <Link to={`/producto/${id}`} className="item-image-link">
        <ProductImage producto={producto} className="item-image" />
      </Link>
      <div className="item-body">
        <span className="item-category">{categoria}</span>
        <h3 className="item-name">{nombre}</h3>
        <p className="item-price">{formatPrecio(precio)}</p>
        <div className="item-actions">
          <Link to={`/producto/${id}`} className="btn btn-primary">
            Ver detalle
          </Link>
          <button
            type="button"
            className="btn btn-icon"
            onClick={() => addToCart(producto)}
            aria-label={`Agregar ${nombre} al carrito`}
            title="Agregar al carrito"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
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
          </button>
        </div>
      </div>
    </article>
  )
}

export default Item
