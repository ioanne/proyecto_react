import { Helmet } from 'react-helmet-async'

const SITIO = 'TecnoVirtual'

function Seo({ title, description }) {
  const fullTitle = title ? `${title} | ${SITIO}` : `${SITIO} | Tu tienda de tecnología`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  )
}

export default Seo
