import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { FaSignInAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext.jsx'
import Seo from '../components/Seo.jsx'

function Login() {
  const { login, traducirError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(destino, { replace: true })
    } catch (err) {
      setError(traducirError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container auth-page">
      <Seo
        title="Iniciar sesión"
        description="Ingresá a tu cuenta de TecnoVirtual para acceder al panel de administración."
      />
      <div className="auth-card">
        <h1 className="page-title auth-title">Iniciar sesión</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="loginEmail">
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

          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100 auth-submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" size="sm" animation="border" /> Ingresando…
              </>
            ) : (
              <>
                <FaSignInAlt aria-hidden="true" /> Ingresar
              </>
            )}
          </Button>
        </Form>

        <p className="auth-switch">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
