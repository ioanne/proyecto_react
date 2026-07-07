import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Spinner, Alert } from 'react-bootstrap'
import { useCart } from '../context/CartContext.jsx'
import { formatPrecio } from './Item.jsx'
import ProductImage from './ProductImage.jsx'
import Seo from './Seo.jsx'
import { getProductoById } from '../services/productsService.js'

function ItemDetailContainer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isInCart } = useCart()

  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    let activo = true
    setLoading(true)
    setError(null)
    setCantidad(1)
    getProductoById(id)
      .then((encontrado) => {
        if (!activo) return
        if (!encontrado) setError('Producto no encontrado.')
        else setProducto(encontrado)
      })
      .catch((err) => {
        console.error(err)
        if (activo) setError('No se pudo cargar el producto.')
      })
      .finally(() => {
        if (activo) setLoading(false)
      })
    return () => {
      activo = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="container page-loader" role="status">
        <Spinner animation="border" />
        <span>Cargando producto…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container detail-error">
        <Alert variant="danger">{error}</Alert>
        <Link to="/productos" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const sinStock = Number(producto.stock) <= 0
  const handleAddToCart = () => addToCart(producto, cantidad)

  return (
    <section className="container detail">
      <Seo title={producto.nombre} description={producto.descripcion} />

      <button onClick={() => navigate(-1)} className="btn btn-ghost">
        ← Volver
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
                disabled={sinStock}
                onChange={(e) =>
                  setCantidad(
                    Math.max(
                      1,
                      Math.min(
                        Number(producto.stock) || 99,
                        Number(e.target.value) || 1,
                      ),
                    ),
                  )
                }
              />
            </label>

            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={sinStock}
            >
              {sinStock ? 'Sin stock' : 'Agregar al carrito'}
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
