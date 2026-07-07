import { useEffect, useState, useCallback } from 'react'
import { Button, Table, Modal, Alert, Spinner } from 'react-bootstrap'
import { FaPlus, FaEdit, FaTrash, FaBoxOpen, FaDatabase } from 'react-icons/fa'
import ProductForm from '../components/ProductForm.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import Seo from '../components/Seo.jsx'
import { formatPrecio } from '../components/Item.jsx'
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  seedProductos,
} from '../services/productsService.js'

function AdminProducts() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const [aEliminar, setAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getProductos()
      setProductos(data)
    } catch (err) {
      console.error(err)
      setError(
        'No se pudieron cargar los productos. Revisá la configuración de Firebase.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const abrirCrear = () => {
    setEditando(null)
    setShowForm(true)
  }

  const abrirEditar = (producto) => {
    setEditando(producto)
    setShowForm(true)
  }

  const cerrarForm = () => {
    if (!guardando) setShowForm(false)
  }

  const handleSubmit = async (data) => {
    setGuardando(true)
    setError('')
    try {
      if (editando) {
        await updateProducto(editando.id, data)
        setFeedback('Producto actualizado correctamente.')
      } else {
        await createProducto(data)
        setFeedback('Producto creado correctamente.')
      }
      setShowForm(false)
      setEditando(null)
      await cargar()
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error al guardar el producto.')
    } finally {
      setGuardando(false)
    }
  }

  const handleDelete = async () => {
    if (!aEliminar) return
    setEliminando(true)
    setError('')
    try {
      await deleteProducto(aEliminar.id)
      setFeedback(`“${aEliminar.nombre}” fue eliminado.`)
      setAEliminar(null)
      await cargar()
    } catch (err) {
      console.error(err)
      setError('No se pudo eliminar el producto.')
    } finally {
      setEliminando(false)
    }
  }

  const handleSeed = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await seedProductos()
      setFeedback(res.message)
      await cargar()
    } catch (err) {
      console.error(err)
      setError('No se pudo cargar el catálogo inicial.')
      setLoading(false)
    }
  }

  return (
    <section className="container admin">
      <Seo
        title="Panel de administración"
        description="Gestión de productos de TecnoVirtual: crear, editar y eliminar."
      />

      <div className="admin-header">
        <h1 className="page-title">Panel de administración</h1>
        <Button onClick={abrirCrear}>
          <FaPlus aria-hidden="true" /> Nuevo producto
        </Button>
      </div>

      {feedback && (
        <Alert variant="success" dismissible onClose={() => setFeedback('')}>
          {feedback}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="page-loader" role="status">
          <Spinner animation="border" />
          <span>Cargando productos…</span>
        </div>
      ) : productos.length === 0 ? (
        <div className="empty-state admin-empty">
          <FaBoxOpen className="empty-icon" aria-hidden="true" />
          <p>No hay productos cargados todavía.</p>
          <Button variant="outline-light" onClick={handleSeed}>
            <FaDatabase aria-hidden="true" /> Cargar catálogo inicial
          </Button>
        </div>
      ) : (
        <div className="table-wrap">
          <Table hover responsive className="admin-table align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>{formatPrecio(p.precio)}</td>
                  <td>{p.stock}</td>
                  <td className="text-end admin-actions">
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={() => abrirEditar(p)}
                      aria-label={`Editar ${p.nombre}`}
                      title="Editar"
                    >
                      <FaEdit aria-hidden="true" />
                    </Button>{' '}
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => setAEliminar(p)}
                      aria-label={`Eliminar ${p.nombre}`}
                      title="Eliminar"
                    >
                      <FaTrash aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showForm} onHide={cerrarForm} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            {editando ? 'Editar producto' : 'Nuevo producto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm
            initialData={editando}
            onSubmit={handleSubmit}
            onCancel={cerrarForm}
            saving={guardando}
          />
        </Modal.Body>
      </Modal>

      <ConfirmModal
        show={Boolean(aEliminar)}
        title="Eliminar producto"
        message={
          aEliminar
            ? `¿Seguro que querés eliminar “${aEliminar.nombre}”? Esta acción no se puede deshacer.`
            : ''
        }
        confirmText="Eliminar"
        loading={eliminando}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!eliminando) setAEliminar(null)
        }}
      />
    </section>
  )
}

export default AdminProducts
