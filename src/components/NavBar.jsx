import { NavLink, useNavigate } from 'react-router-dom'
import {
  FaUserShield,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle,
} from 'react-icons/fa'
import CartWidget from './CartWidget.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function NavBar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link'

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={linkClass} end>
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink to="/productos" className={linkClass}>
            Productos
          </NavLink>
        </li>
        <li>
          <NavLink to="/contacto" className={linkClass}>
            Contacto
          </NavLink>
        </li>
        {isAdmin && (
          <li>
            <NavLink to="/admin" className={linkClass}>
              <FaUserShield aria-hidden="true" /> Admin
            </NavLink>
          </li>
        )}
      </ul>

      <div className="nav-actions">
        <CartWidget />

        {user ? (
          <div className="nav-user">
            <NavLink to="/perfil" className="nav-user-link" title="Mi perfil">
              <FaUserCircle aria-hidden="true" />
              <span className="nav-user-email">
                {user.displayName || user.email}
              </span>
            </NavLink>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleLogout}
            >
              <FaSignOutAlt aria-hidden="true" /> Salir
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-primary btn-sm nav-login">
            <FaSignInAlt aria-hidden="true" /> Ingresar
          </NavLink>
        )}
      </div>
    </nav>
  )
}

export default NavBar
