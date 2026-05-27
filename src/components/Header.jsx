import { Link } from 'react-router-dom'
import NavBar from './NavBar.jsx'

function Header() {
  return (
    <header className="header">
      <Link to="/" className="brand">
        <span className="brand-name">TecnoVirtual</span>
      </Link>
      <NavBar />
    </header>
  )
}

export default Header
