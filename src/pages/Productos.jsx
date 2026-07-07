import ItemListContainer from '../components/ItemListContainer.jsx'
import Seo from '../components/Seo.jsx'

function Productos() {
  return (
    <>
      <Seo
        title="Productos"
        description="Explorá el catálogo completo de TecnoVirtual: computación, audio, telefonía y accesorios."
      />
      <ItemListContainer saludo="Nuestros productos" />
    </>
  )
}

export default Productos
