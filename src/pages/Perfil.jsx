import { Link } from 'react-router-dom'
import { Badge } from 'react-bootstrap'
import { FaUserCircle, FaUserShield } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext.jsx'
import Seo from '../components/Seo.jsx'

function Perfil() {
  const { user, isAdmin } = useAuth()

  return (
    <section className="container">
      <Seo title="Mi perfil" description="Datos de tu cuenta en TecnoVirtual." />
      <h1 className="page-title">Mi perfil</h1>

      <div className="profile-panel">
        <FaUserCircle className="profile-panel-icon" aria-hidden="true" />
        <div>
          <p className="profile-panel-name">{user?.displayName || 'Usuario'}</p>
          <p className="profile-panel-email">{user?.email}</p>
          <Badge bg={isAdmin ? 'primary' : 'secondary'}>
            {isAdmin ? 'Administrador' : 'Usuario'}
          </Badge>
        </div>
      </div>

      {isAdmin && (
        <Link to="/admin" className="btn btn-primary">
          <FaUserShield aria-hidden="true" /> Ir al panel de administración
        </Link>
      )}
    </section>
  )
}

export default Perfil
