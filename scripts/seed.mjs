// Carga los productos de public/productos.json en Firestore.
// Uso: SEED_EMAIL=... SEED_PASSWORD=... npm run seed
import { readFileSync } from 'node:fs'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const env = {}
for (const linea of readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const l = linea.trim()
  if (!l || l.startsWith('#')) continue
  const i = l.indexOf('=')
  if (i > 0) env[l.slice(0, i).trim()] = l.slice(i + 1).trim()
}

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
})
const db = getFirestore(app)

if (process.env.SEED_EMAIL && process.env.SEED_PASSWORD) {
  await signInWithEmailAndPassword(
    getAuth(app),
    process.env.SEED_EMAIL,
    process.env.SEED_PASSWORD,
  )
  console.log('Sesión iniciada como', process.env.SEED_EMAIL)
}

const productosRef = collection(db, 'productos')

const snap = await getDocs(productosRef)
if (!snap.empty) {
  console.log(`La colección ya tiene ${snap.size} productos. No se cargó nada.`)
  process.exit(0)
}

const productos = JSON.parse(readFileSync('public/productos.json', 'utf8'))

let n = 0
for (const { id, ...p } of productos) {
  const ref = await addDoc(productosRef, {
    nombre: String(p.nombre ?? '').trim(),
    categoria: String(p.categoria ?? '').trim(),
    descripcion: String(p.descripcion ?? '').trim(),
    imagen: String(p.imagen ?? '').trim(),
    icono: String(p.icono ?? '').trim() || 'default',
    precio: Number(p.precio),
    stock: Number(p.stock),
  })
  n++
  console.log(`  ${p.nombre} -> ${ref.id}`)
}

console.log(`\nListo: ${n} productos cargados en Firestore.`)
process.exit(0)
