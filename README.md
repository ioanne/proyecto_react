# TecnoVirtual — Catálogo React

🚀 **Ver app en vivo:** https://proyecto-react-omega-six.vercel.app

Aplicación de e-commerce (catálogo + carrito de compras) construida con **React + Vite** y **react-router-dom**, usando la **Context API** para el estado global del carrito.

---

## Índice

- [Requisitos](#requisitos)
- [Configuración del entorno (nvm + Node)](#configuración-del-entorno-nvm--node)
- [Puesta en marcha](#puesta-en-marcha)
- [Scripts disponibles](#scripts-disponibles)
- [Stack / tecnologías](#stack--tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Cómo se cumplen los requerimientos](#cómo-se-cumplen-los-requerimientos)
- [Detalle de la implementación](#detalle-de-la-implementación)
  - [Persistencia de la sesión (localStorage)](#persistencia-de-la-sesión-localstorage)
- [Datos de productos](#datos-de-productos)

---

## Requisitos

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- Node.js **24.13.1** (fijado en [`.nvmrc`](.nvmrc))
- npm (incluido con Node)

---

## Configuración del entorno (nvm + Node)

El proyecto fija la versión de Node mediante el archivo [`.nvmrc`](.nvmrc), que contiene:

```
24.13.1
```

Para usar exactamente esa versión:

```bash
# Si todavía no tenés Node 24.13.1 instalado:
nvm install

# Activar la versión del proyecto (lee el .nvmrc):
nvm use
```

> Con `nvm use` dentro de la carpeta del proyecto, nvm toma automáticamente la versión declarada en `.nvmrc`. También podés configurar tu shell para que lo haga solo al entrar a la carpeta.

El `package.json` además declara el requisito mínimo de motor:

```json
"engines": { "node": ">=20.19.0" }
```

---

## Puesta en marcha

```bash
nvm install   # instala Node 24.13.1 (solo la primera vez)
nvm use       # activa Node 24.13.1
npm install   # instala las dependencias
npm run dev   # levanta el servidor de desarrollo
```

El servidor de desarrollo queda disponible en:

```
http://localhost:5173
```

---

## Scripts disponibles

| Script            | Descripción                                            |
|-------------------|--------------------------------------------------------|
| `npm run dev`     | Servidor de desarrollo con hot reload (Vite).          |
| `npm run build`   | Build de producción optimizado en la carpeta `dist/`.  |
| `npm run preview` | Sirve localmente el build de producción para probarlo. |

---

## Stack / tecnologías

- **React 19** — librería de UI.
- **Vite 7** — bundler y servidor de desarrollo.
- **react-router-dom 7** — ruteo del lado del cliente (SPA).
- **Context API** — estado global del carrito (sin librerías externas de estado).
- **CSS** plano con variables CSS (tema oscuro, diseño responsive).

---

## Estructura del proyecto

```
proyecto_react/
├── .nvmrc
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── productos.json
│   └── vite.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── CartContext.jsx
    ├── components/
    │   ├── Layout.jsx
    │   ├── Header.jsx
    │   ├── NavBar.jsx
    │   ├── Footer.jsx
    │   ├── CartWidget.jsx
    │   ├── ProductImage.jsx
    │   ├── ProductIcon.jsx
    │   ├── Item.jsx
    │   ├── ItemListContainer.jsx
    │   └── ItemDetailContainer.jsx
    └── pages/
        ├── Home.jsx
        ├── Productos.jsx
        ├── ProductoDetalle.jsx
        ├── Carrito.jsx
        ├── Contacto.jsx
        └── NotFound.jsx
```

---

## Rutas de la aplicación

| Ruta              | Componente            | Descripción                          |
|-------------------|-----------------------|--------------------------------------|
| `/`               | `Home`                | Pantalla de bienvenida.              |
| `/productos`      | `Productos`           | Catálogo completo de productos.      |
| `/producto/:id`   | `ProductoDetalle`     | Detalle de un único producto.        |
| `/carrito`        | `Carrito`             | Carrito de compras.                  |
| `/contacto`       | `Contacto`            | Página de contacto (GitHub, etc.).   |
| `*`               | `NotFound`            | Cualquier ruta inexistente (404).    |

La navegación usa `<Link>` / `<NavLink>`, por lo que **no hay recargas de página** al moverse entre vistas.

---

## Cómo se cumplen los requerimientos

### Requerimiento #1 — Estructura y Layout
- Estructura de carpetas organizada (`components/`, `pages/`, `context/`).
- `Layout.jsx` compone `Header.jsx` (que contiene la `nav` dentro de `NavBar.jsx`) y `Footer.jsx`, con apariencia consistente en toda la app.
- El `Footer.jsx` incluye **información de la empresa** (dirección, teléfono y GitHub) y las **tarjetas de 3 integrantes** del equipo (nombre, rol y foto), más una línea de copyright con el año 2026.

### Requerimiento #2 — Catálogo de productos con datos de una API
- `ItemListContainer.jsx` carga la información desde el archivo local `public/productos.json` usando **`useEffect` + `fetch`**, con estados de **carga** y **error**.
- Cada producto se renderiza con el componente reutilizable `Item.jsx`, que **recibe los datos por props**.
- Cada producto muestra su **foto real** (en `public/img/`) mediante `ProductImage.jsx`, que cae a un ícono SVG (`ProductIcon.jsx`) si la imagen no carga.

### Requerimiento #3 — Sistema de ruteo
- La navegación es gestionada por **`react-router-dom`**.
- Existen las rutas: `/` (la tienda), `/productos`, `/producto/:id` y `/carrito`.
- El `NavBar` utiliza `<Link>` / `<NavLink>` para una **navegación fluida sin recargas**.

### Requerimiento #4 — Funcionalidad del carrito con Context API
- `CartContext.jsx` gestiona el **estado global** del carrito.
- Desde la vista de detalle, el usuario agrega productos llamando a **`addToCart`** del contexto.
- El `NavBar` muestra el `CartWidget` (ícono de carrito con **indicador numérico**) cuyo valor sale del `CartContext` y se **actualiza en tiempo real**.
- La ruta `/carrito` muestra el detalle de los productos agregados, **consumiendo la información directamente del `CartContext`**.
- El carrito se **persiste en `localStorage`**, por lo que la sesión se mantiene aunque el usuario cierre la pestaña o el navegador y vuelva a entrar.

---

## Detalle de la implementación

### Persistencia de la sesión (`localStorage`)
El carrito se guarda en `localStorage` bajo la clave `tecnovirtual.cart`, de modo que la información de la sesión **se mantiene entre visitas** (al cerrar y reabrir el navegador o recargar la página). En [`src/context/CartContext.jsx`](src/context/CartContext.jsx):

- **Inicialización perezosa:** `useState(leerCarritoGuardado)` lee el carrito guardado al montar el `CartProvider`. Si no hay nada (o el dato está corrupto), arranca con un array vacío.
- **Guardado automático:** un `useEffect` que depende de `cart` serializa el carrito a JSON y lo escribe en `localStorage` cada vez que cambia.
- **Tolerancia a fallos:** la lectura y la escritura están envueltas en `try/catch`, así que si `localStorage` no está disponible (modo privado, cuota llena, etc.) la app sigue funcionando solo en memoria.

### Estado global del carrito
El `CartProvider` envuelve a `<App/>` en [`src/main.jsx`](src/main.jsx), por lo que el carrito es accesible desde cualquier componente. El contexto expone:

| Valor / función      | Descripción                                                       |
|----------------------|-------------------------------------------------------------------|
| `cart`               | Array de productos en el carrito (`{ ...producto, cantidad }`).   |
| `addToCart(p, cant)` | Agrega un producto o suma cantidad si ya existe.                  |
| `removeFromCart(id)` | Elimina un producto del carrito.                                  |
| `clearCart()`        | Vacía el carrito completo.                                        |
| `isInCart(id)`       | Indica si un producto ya está en el carrito.                      |
| `totalQuantity`      | Cantidad total de unidades (lo que muestra el `CartWidget`).      |
| `totalPrice`         | Precio total del carrito.                                         |

Para consumir el contexto se usa el hook `useCart()`, que valida que el componente esté dentro del `CartProvider`.

### Carga de datos
Tanto el listado (`ItemListContainer`) como el detalle (`ItemDetailContainer`) hacen `fetch('/productos.json')` dentro de un `useEffect`. El detalle filtra por el `:id` de la URL (`useParams`) y maneja el caso de producto no encontrado.

### Estilos y responsive
`src/index.css` define un tema oscuro mediante variables CSS y una grilla responsive. La `--max-width` del contenedor crece por breakpoints (1280 → 1480 → 1760 → 2200 → 2800 px) para que en pantallas grandes y 4K el contenido no quede angosto en el centro; como la grilla usa `auto-fill`, aparecen más columnas a medida que hay más ancho disponible.

---

## Datos de productos

El catálogo se alimenta de [`public/productos.json`](public/productos.json). Cada producto tiene la forma:

```json
{
  "id": 1,
  "nombre": "Notebook Pro 14\"",
  "categoria": "Computación",
  "precio": 1299990,
  "stock": 12,
  "descripcion": "Notebook ultraliviana con pantalla de 14 pulgadas...",
  "icono": "notebook",
  "imagen": "/img/notebook.jpg"
}
```

> - `imagen`: ruta a la foto real del producto, servida localmente desde `public/img/` (no depende de servicios externos en runtime).
> - `icono`: tipo usado como **fallback** SVG por `ProductIcon.jsx` si la imagen no carga (valores: `notebook`, `auriculares`, `smartphone`, `teclado`, `monitor`, `mouse`, `tablet`, `parlante`).
