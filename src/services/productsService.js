import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase/config.js'

const COLECCION = 'productos'
const productosRef = collection(db, COLECCION)

const normalizar = (data) => ({
  nombre: (data.nombre ?? '').trim(),
  categoria: (data.categoria ?? '').trim(),
  descripcion: (data.descripcion ?? '').trim(),
  imagen: (data.imagen ?? '').trim(),
  icono: (data.icono ?? '').trim() || 'default',
  precio: Number(data.precio),
  stock: Number(data.stock),
})

export const getProductos = async () => {
  const q = query(productosRef, orderBy('nombre'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export const getProductoById = async (id) => {
  const snapshot = await getDoc(doc(db, COLECCION, id))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

export const createProducto = async (data) => {
  const limpio = normalizar(data)
  const ref = await addDoc(productosRef, limpio)
  return { id: ref.id, ...limpio }
}

export const updateProducto = async (id, data) => {
  const limpio = normalizar(data)
  await updateDoc(doc(db, COLECCION, id), limpio)
  return { id, ...limpio }
}

export const deleteProducto = (id) => deleteDoc(doc(db, COLECCION, id))

export const seedProductos = async () => {
  const snapshot = await getDocs(productosRef)
  if (!snapshot.empty) {
    return { seeded: 0, message: 'La colección ya tiene productos cargados.' }
  }
  const res = await fetch('/productos.json')
  if (!res.ok) throw new Error('No se pudo leer productos.json')
  const data = await res.json()
  // Firestore genera su propio id, así que descartamos el numérico del JSON.
  await Promise.all(data.map(({ id, ...producto }) => createProducto(producto)))
  return { seeded: data.length, message: `Se cargaron ${data.length} productos iniciales.` }
}
