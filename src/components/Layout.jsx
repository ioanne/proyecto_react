import { Outlet } from 'react-router-dom'
import { ToastContainer, Toast } from 'react-bootstrap'
import { FaCheckCircle } from 'react-icons/fa'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { useCart } from '../context/CartContext.jsx'

function Layout() {
  const { toast, hideToast } = useCart()

  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />

      <ToastContainer position="bottom-end" className="p-3 cart-toast-container">
        <Toast
          show={toast.show}
          onClose={hideToast}
          delay={2500}
          autohide
          bg="dark"
        >
          <Toast.Body className="cart-toast-body">
            <FaCheckCircle aria-hidden="true" className="cart-toast-icon" />
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  )
}

export default Layout
