import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="container notfound">
      <h1 className="page-title">404</h1>
      <p className="status-msg">La página que buscás no existe.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </section>
  )
}

export default NotFound
