import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase/config.js'
import { ensureUserDoc } from '../services/usersService.js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>')
  }
  return context
}

const mensajesError = {
  'auth/invalid-email': 'El email no es válido.',
  'auth/user-disabled': 'Esta cuenta fue deshabilitada.',
  'auth/user-not-found': 'No existe una cuenta con ese email.',
  'auth/wrong-password': 'La contraseña es incorrecta.',
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/too-many-requests':
    'Demasiados intentos fallidos. Probá de nuevo en unos minutos.',
  'auth/network-request-failed': 'Error de red. Revisá tu conexión a internet.',
}

const traducirError = (code) =>
  mensajesError[code] || 'Ocurrió un error inesperado. Intentá nuevamente.'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      setUser(usuario)
      if (usuario) {
        try {
          const perfil = await ensureUserDoc(usuario)
          setIsAdmin(perfil?.isStaff === true)
        } catch (err) {
          console.error('No se pudo cargar el perfil del usuario', err)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const register = async (email, password, nombre) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (nombre) {
      await updateProfile(cred.user, { displayName: nombre })
    }
    return cred.user
  }

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  const value = {
    user,
    isAdmin,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    traducirError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
