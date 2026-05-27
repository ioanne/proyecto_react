import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrecio } from './Item.jsx'
import ProductImage from './ProductImage.jsx'

function ItemDetailContainer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isInCart } = useCart()

  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    setLoading(true)
    fetch('/productos.json')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar los productos')
        return res.json()
      })
      .then((data) => {
        const encontrado = data.find((p) => p.id === Number(id))
        if (!encontrado) throw new Error('Producto no encontrado')
        setProducto(encontrado)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="status-msg">Cargando producto…</p>
  if (error) {
    return (
      <div className="container status-msg status-error">
        <p>{error}</p>
        <Link to="/productos" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(producto, cantidad)
  }

  return (
    <section className="container detail">
      <button onClick={() => navigate(-1)} className="btn btn-ghost">
        Volver
      </button>

      <div className="detail-grid">
        <ProductImage producto={producto} className="detail-image" />

        <div className="detail-info">
          <span className="item-category">{producto.categoria}</span>
          <h1 className="detail-name">{producto.nombre}</h1>
          <p className="detail-price">{formatPrecio(producto.precio)}</p>
          <p className="detail-stock">Stock disponible: {producto.stock}</p>
          <p className="detail-description">{producto.descripcion}</p>

          <div className="detail-actions">
            <label className="qty-control">
              Cantidad:
              <input
                type="number"
                min="1"
                max={producto.stock}
                value={cantidad}
                onChange={(e) =>
                  setCantidad(Math.max(1, Number(e.target.value) || 1))
                }
              />
            </label>

            <button className="btn btn-primary" onClick={handleAddToCart}>
              Agregar al carrito
            </button>

            {isInCart(producto.id) && (
              <Link to="/carrito" className="btn btn-ghost">
                Ver carrito
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ItemDetailContainer
