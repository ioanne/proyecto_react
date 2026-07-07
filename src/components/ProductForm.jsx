import { useState } from 'react'
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap'

// Deben coincidir con los definidos en ProductIcon.jsx.
const ICONOS = [
  'notebook',
  'smartphone',
  'tablet',
  'auriculares',
  'parlante',
  'teclado',
  'mouse',
  'monitor',
  'default',
]

const VALORES_VACIOS = {
  nombre: '',
  categoria: '',
  precio: '',
  stock: '',
  descripcion: '',
  imagen: '',
  icono: 'default',
}

function validar(data) {
  const errores = {}

  if (!String(data.nombre).trim()) {
    errores.nombre = 'El nombre es obligatorio.'
  }
  if (!String(data.categoria).trim()) {
    errores.categoria = 'La categoría es obligatoria.'
  }
  if (
    data.precio === '' ||
    Number.isNaN(Number(data.precio)) ||
    Number(data.precio) <= 0
  ) {
    errores.precio = 'El precio debe ser un número mayor a 0.'
  }
  if (
    data.stock === '' ||
    Number.isNaN(Number(data.stock)) ||
    Number(data.stock) < 0
  ) {
    errores.stock = 'El stock debe ser un número igual o mayor a 0.'
  }
  const imagen = String(data.imagen).trim()
  if (!imagen) {
    errores.imagen = 'La imagen es obligatoria (URL o ruta).'
  } else if (!/^(https?:\/\/|\/)/.test(imagen)) {
    errores.imagen = 'Debe ser una URL válida o una ruta que empiece con /.'
  }

  return errores
}

function ProductForm({ initialData, onSubmit, onCancel, saving = false }) {
  const [data, setData] = useState(() => ({
    ...VALORES_VACIOS,
    ...(initialData || {}),
  }))
  const [errores, setErrores] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validar(data)
    setErrores(errs)
    if (Object.keys(errs).length > 0) return
    onSubmit(data)
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Form.Group className="mb-3" controlId="formNombre">
        <Form.Label>Nombre *</Form.Label>
        <Form.Control
          name="nombre"
          value={data.nombre}
          onChange={handleChange}
          isInvalid={!!errores.nombre}
          placeholder="Ej: Notebook Pro 14”"
        />
        <Form.Control.Feedback type="invalid">
          {errores.nombre}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formCategoria">
        <Form.Label>Categoría *</Form.Label>
        <Form.Control
          name="categoria"
          value={data.categoria}
          onChange={handleChange}
          isInvalid={!!errores.categoria}
          placeholder="Ej: Computación"
        />
        <Form.Control.Feedback type="invalid">
          {errores.categoria}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col xs={6}>
          <Form.Group className="mb-3" controlId="formPrecio">
            <Form.Label>Precio *</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              min="0"
              step="0.01"
              value={data.precio}
              onChange={handleChange}
              isInvalid={!!errores.precio}
              placeholder="0"
            />
            <Form.Control.Feedback type="invalid">
              {errores.precio}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group className="mb-3" controlId="formStock">
            <Form.Label>Stock *</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              min="0"
              step="1"
              value={data.stock}
              onChange={handleChange}
              isInvalid={!!errores.stock}
              placeholder="0"
            />
            <Form.Control.Feedback type="invalid">
              {errores.stock}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="formImagen">
        <Form.Label>Imagen (URL o ruta) *</Form.Label>
        <Form.Control
          name="imagen"
          value={data.imagen}
          onChange={handleChange}
          isInvalid={!!errores.imagen}
          placeholder="https://… o /img/producto.jpg"
        />
        <Form.Control.Feedback type="invalid">
          {errores.imagen}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formIcono">
        <Form.Label>Icono (fallback si la imagen no carga)</Form.Label>
        <Form.Select name="icono" value={data.icono} onChange={handleChange}>
          {ICONOS.map((icono) => (
            <option key={icono} value={icono}>
              {icono}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDescripcion">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="descripcion"
          value={data.descripcion}
          onChange={handleChange}
          placeholder="Descripción del producto…"
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Spinner as="span" size="sm" animation="border" /> Guardando…
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </div>
    </Form>
  )
}

export default ProductForm
