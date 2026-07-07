import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Productos from './pages/Productos.jsx'
import ProductoDetalle from './pages/ProductoDetalle.jsx'
import Carrito from './pages/Carrito.jsx'
import Contacto from './pages/Contacto.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Perfil from './pages/Perfil.jsx'
import AdminProducts from './pages/AdminProducts.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="producto/:id" element={<ProductoDetalle />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Rutas privadas: requieren usuario autenticado */}
        <Route
          path="perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
