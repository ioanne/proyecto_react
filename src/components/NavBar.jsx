import { NavLink } from 'react-router-dom'
import CartWidget from './CartWidget.jsx'

function NavBar() {
  const linkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link'

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
      </ul>
      <CartWidget />
    </nav>
  )
}

export default NavBar
