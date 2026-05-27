import { Link } from 'react-router-dom'

const beneficios = [
  {
    titulo: 'Envío a todo el país',
    texto: 'Recibí tu pedido en 24 a 72 hs hábiles con seguimiento online.',
  },
  {
    titulo: 'Garantía oficial',
    texto: 'Todos los productos cuentan con garantía y soporte del fabricante.',
  },
  {
    titulo: 'Pago seguro',
    texto: 'Comprá con tarjeta o transferencia de forma 100% segura.',
  },
]

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Bienvenido a TecnoVirtual</h1>
          <p className="hero-subtitle">
            La mejor tecnología al mejor precio. Notebooks, smartphones, audio y
            accesorios, con envío a todo el país.
          </p>
          <div className="hero-actions">
            <Link to="/productos" className="btn btn-primary btn-lg">
              Ver productos
            </Link>
            <Link to="/contacto" className="btn btn-ghost btn-lg">
              Contacto
            </Link>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="features">
          {beneficios.map((beneficio) => (
            <article key={beneficio.titulo} className="feature-card">
              <h3>{beneficio.titulo}</h3>
              <p>{beneficio.texto}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
