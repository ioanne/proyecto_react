import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config.js'

const COLECCION = 'usuarios'

// El rol de admin vive en el campo isStaff. El front nunca lo pone en true:
// eso solo se hace desde la consola de Firebase, y las reglas lo garantizan.
export const ensureUserDoc = async (user) => {
  const ref = doc(db, COLECCION, user.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) return snap.data()

  const perfil = {
    email: user.email,
    nombre: user.displayName || '',
    isStaff: false,
    createdAt: serverTimestamp(),
  }
  await setDoc(ref, perfil)
  return perfil
}

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, COLECCION, uid))
  return snap.exists() ? snap.data() : null
}
