import { Navigate, useLocation, Link } from 'react-router-dom'
import { Spinner, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="page-loader" role="status">
        <Spinner animation="border" />
        <span>Verificando sesión…</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <section className="container detail-error">
        <Alert variant="warning">
          No tenés permisos para acceder a esta sección. Solo el personal
          autorizado puede administrar los productos.
        </Alert>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </section>
    )
  }

  return children
}

export default ProtectedRoute
