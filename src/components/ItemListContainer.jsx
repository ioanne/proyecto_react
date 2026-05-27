import { useEffect, useState } from 'react'
import Item from './Item.jsx'

function ItemListContainer({ saludo = 'Catálogo de productos' }) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('/productos.json')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar los productos')
        return res.json()
      })
      .then((data) => setProductos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="status-msg">Cargando productos…</p>
  }

  if (error) {
    return <p className="status-msg status-error">{error}</p>
  }

  return (
    <section className="container">
      <h1 className="page-title">{saludo}</h1>
      <div className="item-grid">
        {productos.map((producto) => (
          <Item key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  )
}

export default ItemListContainer
