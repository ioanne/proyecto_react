import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { FaUserPlus } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext.jsx'
import Seo from '../components/Seo.jsx'

function Register() {
  const { register, traducirError } = useAuth()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!nombre.trim()) return setError('Ingresá tu nombre.')
    if (password.length < 6)
      return setError('La contraseña debe tener al menos 6 caracteres.')
    if (password !== confirm) return setError('Las contraseñas no coinciden.')

    setLoading(true)
    try {
      await register(email, password, nombre.trim())
      navigate('/', { replace: true })
    } catch (err) {
      setError(traducirError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container auth-page">
      <Seo
        title="Crear cuenta"
        description="Registrate en TecnoVirtual para gestionar tus compras y el catálogo."
      />
      <div className="auth-card">
        <h1 className="page-title auth-title">Crear cuenta</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="registerNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              autoComplete="name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerConfirm">
            <Form.Label>Repetir contraseña</Form.Label>
            <Form.Control
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repetí la contraseña"
              autoComplete="new-password"
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100 auth-submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" size="sm" animation="border" /> Creando cuenta…
              </>
            ) : (
              <>
                <FaUserPlus aria-hidden="true" /> Registrarme
              </>
            )}
          </Button>
        </Form>

        <p className="auth-switch">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </section>
  )
}

export default Register
