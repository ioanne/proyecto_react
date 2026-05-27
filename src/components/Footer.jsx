const equipo = [
  {
    nombre: 'Juan Ignacio Bonini',
    rol: 'Developer',
    avatar: 'https://github.com/ioanne.png',
  },
  {
    nombre: 'Pedro Picapiedra',
    rol: 'Project Manager',
    avatar: 'https://i.pravatar.cc/120?img=15',
  },
  {
    nombre: 'Pablo Mármol',
    rol: 'Diseñador UI',
    avatar: 'https://i.pravatar.cc/120?img=33',
  },
]

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-company">
          <h3 className="brand-name">TecnoVirtual</h3>
          <p>Tu tienda de tecnología de confianza desde 2026.</p>
          <ul className="footer-info">
            <li>Av. Siempre Viva 742, Buenos Aires</li>
            <li>+54 11 5555-1234</li>
            <li>
              <a
                href="https://github.com/ioanne"
                target="_blank"
                rel="noreferrer"
              >
                github.com/ioanne
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-team">
          <h4>Nuestro equipo</h4>
          <div className="team-cards">
            {equipo.map((persona) => (
              <article key={persona.nombre} className="team-card">
                <img
                  src={persona.avatar}
                  alt={persona.nombre}
                  className="team-avatar"
                  loading="lazy"
                />
                <div>
                  <p className="team-name">{persona.nombre}</p>
                  <p className="team-role">{persona.rol}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 TecnoVirtual</span>
        <a href="https://github.com/ioanne" target="_blank" rel="noreferrer">
          github.com/ioanne
        </a>
      </div>
    </footer>
  )
}

export default Footer
