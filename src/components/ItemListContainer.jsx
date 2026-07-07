import { useEffect, useMemo, useState } from 'react'
import { Spinner, Alert } from 'react-bootstrap'
import Item from './Item.jsx'
import SearchBar from './SearchBar.jsx'
import Pagination from './Pagination.jsx'
import { getProductos } from '../services/productsService.js'

const PRODUCTOS_POR_PAGINA = 8

function ItemListContainer({ saludo = 'Catálogo de productos' }) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    let activo = true
    setLoading(true)
    setError(null)
    getProductos()
      .then((data) => {
        if (activo) setProductos(data)
      })
      .catch((err) => {
        console.error(err)
        if (activo) setError('No se pudieron cargar los productos.')
      })
      .finally(() => {
        if (activo) setLoading(false)
      })
    return () => {
      activo = false
    }
  }, [])

  const filtrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase()
    if (!term) return productos
    return productos.filter((p) =>
      [p.nombre, p.categoria, p.descripcion].some((campo) =>
        campo?.toLowerCase().includes(term),
      ),
    )
  }, [productos, busqueda])

  const totalPaginas = Math.ceil(filtrados.length / PRODUCTOS_POR_PAGINA)

  const visibles = useMemo(() => {
    const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA
    return filtrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA)
  }, [filtrados, pagina])

  const handleBuscar = (valor) => {
    setBusqueda(valor)
    setPagina(1)
  }

  return (
    <section className="container">
      <h1 className="page-title">{saludo}</h1>

      <SearchBar value={busqueda} onChange={handleBuscar} />

      {loading && (
        <div className="page-loader" role="status">
          <Spinner animation="border" />
          <span>Cargando productos…</span>
        </div>
      )}

      {!loading && error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && filtrados.length === 0 && (
        <Alert variant="secondary" className="empty-state">
          {busqueda
            ? `No encontramos productos para “${busqueda}”.`
            : 'Todavía no hay productos cargados.'}
        </Alert>
      )}

      {!loading && !error && filtrados.length > 0 && (
        <>
          <div className="item-grid">
            {visibles.map((producto) => (
              <Item key={producto.id} producto={producto} />
            ))}
          </div>
          <Pagination
            currentPage={pagina}
            totalPages={totalPaginas}
            onPageChange={setPagina}
          />
        </>
      )}
    </section>
  )
}

export default ItemListContainer
