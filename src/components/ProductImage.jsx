import { useState } from 'react'
import ProductIcon from './ProductIcon.jsx'

function ProductImage({ producto, className = '' }) {
  const [falló, setFalló] = useState(false)

  if (falló || !producto.imagen) {
    return (
      <span className={`${className} product-fallback`}>
        <ProductIcon tipo={producto.icono} />
      </span>
    )
  }

  return (
    <img
      src={producto.imagen}
      alt={producto.nombre}
      className={className}
      loading="lazy"
      onError={() => setFalló(true)}
    />
  )
}

export default ProductImage
