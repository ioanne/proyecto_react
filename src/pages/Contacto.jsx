function Contacto() {
  return (
    <section className="container contacto">
      <h1 className="page-title">Contacto</h1>
      <p className="contacto-intro">
        ¿Tenés una consulta sobre un producto o querés trabajar con nosotros?
        Escribinos por cualquiera de estos medios.
      </p>

      <div className="contacto-grid">
        <article className="profile-card">
          <img
            src="https://github.com/ioanne.png"
            alt="Juan Ignacio Bonini"
            className="profile-avatar"
          />
          <h2 className="profile-name">Juan Ignacio Bonini</h2>
          <p className="profile-role">Developer</p>
          <a
            className="btn btn-primary"
            href="https://github.com/ioanne"
            target="_blank"
            rel="noreferrer"
          >
            Ver GitHub
          </a>
        </article>

        <ul className="contacto-list">
          <li>
            <span className="contacto-label">GitHub</span>
            <a href="https://github.com/ioanne" target="_blank" rel="noreferrer">
              github.com/ioanne
            </a>
          </li>
          <li>
            <span className="contacto-label">Email</span>
            <a href="mailto:juanigbonini@gmail.com">juanigbonini@gmail.com</a>
          </li>
          <li>
            <span className="contacto-label">Ubicación</span>
            <span>Buenos Aires, Argentina</span>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default Contacto
