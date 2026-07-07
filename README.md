# TecnoVirtual

Aplicación de eCommerce hecha con React y Vite. Incluye catálogo de productos,
carrito de compras con Context API, autenticación de usuarios y un panel de
administración con CRUD de productos sobre Firebase (Authentication + Firestore).
Además tiene búsqueda, paginación, rutas protegidas por rol, SEO por página y un
diseño responsive.

Aplicación en vivo: https://proyecto-react-omega-six.vercel.app

## Contenido

- [Tecnologías](#tecnologías)
- [Funcionalidades](#funcionalidades)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración de Firebase](#configuración-de-firebase)
- [Reglas de seguridad de Firestore](#reglas-de-seguridad-de-firestore)
- [Roles y permisos de administrador](#roles-y-permisos-de-administrador)
- [Carga inicial de productos](#carga-inicial-de-productos)
- [Ejecutar el proyecto](#ejecutar-el-proyecto)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Rutas](#rutas)
- [Usuario de prueba](#usuario-de-prueba)
- [Deploy](#deploy)

## Tecnologías

- React 19 y Vite 7.
- react-router-dom 7 para el ruteo, con rutas protegidas.
- Context API para el estado global del carrito y de la autenticación.
- Firebase: Authentication (registro, login y logout) y Firestore (CRUD de productos).
- React-Bootstrap y Bootstrap 5.3 para formularios, modales, tablas, spinners,
  alertas, paginación y toasts. El tema oscuro se activa con `data-bs-theme`.
- styled-components para componentes con estilo propio (por ejemplo la barra de búsqueda).
- react-icons para los íconos de la interfaz.
- react-helmet-async para el título y la descripción de cada página.
- CSS propio con variables para el tema oscuro, que convive con Bootstrap.

## Funcionalidades

- Carrito con Context API: agregar, quitar, vaciar, sumar y restar cantidades,
  subtotales y total. Se guarda en `localStorage` y muestra un aviso al agregar un producto.
- Autenticación con Firebase: registro, login, logout, sesión persistente y
  mensajes de error claros.
- Rutas protegidas: `/perfil` requiere estar logueado y `/admin` requiere ser
  administrador. Si no hay sesión, se redirige al login.
- CRUD de productos sobre Firestore, con formulario validado y confirmación antes de borrar.
- Estados de carga y error con spinners, alertas y mensajes de lista vacía.
- Búsqueda en tiempo real por nombre, categoría o descripción.
- Paginación de a 8 productos, que vuelve a la primera página al buscar.
- Título y descripción propios por página, más mejoras de accesibilidad.
- Diseño adaptado a celular, tablet y escritorio.

## Requisitos

- Node.js 24.13.1 (fijado en `.nvmrc`). El mínimo soportado es 20.19.0.
- Una cuenta de Firebase con un proyecto que tenga Authentication y Firestore habilitados.

## Instalación

```bash
nvm use        # usa la versión de Node del .nvmrc
npm install
```

## Configuración de Firebase

Las credenciales no van escritas en el código: se leen de variables de entorno.

1. Crear un proyecto en la consola de Firebase.
2. Activar Authentication con el método Email/Password.
3. Crear una base de Firestore.
4. En la configuración del proyecto, copiar los datos del SDK web.
5. Copiar el archivo de ejemplo y completarlo:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

El archivo `.env` está ignorado en git y no se sube al repositorio.

## Reglas de seguridad de Firestore

Estas reglas dejan la lectura del catálogo abierta, permiten escribir productos
solo a los administradores y evitan que un usuario se dé permisos a sí mismo.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /usuarios/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null
                    && request.auth.uid == uid
                    && request.resource.data.isStaff == false;
      allow update, delete: if false;
    }

    match /productos/{doc} {
      allow read: if true;
      allow write: if request.auth != null
        && exists(/databases/$(database)/documents/usuarios/$(request.auth.uid))
        && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.isStaff == true;
    }
  }
}
```

## Roles y permisos de administrador

Estar registrado no alcanza para administrar productos. La ruta `/admin` y la
escritura en Firestore quedan reservadas a los usuarios marcados como staff.

El rol se guarda en Firestore, en el documento `usuarios/{uid}`, con un campo
`isStaff`. El front lo único que hace con ese campo es leerlo para mostrar u
ocultar el panel. Quien decide si una escritura se permite son las reglas de
seguridad, no el navegador.

Cuando alguien se registra, la app crea su documento de perfil con `isStaff` en
`false`. Que ese valor viaje desde el cliente no es un problema, porque las
reglas no confían en lo que manda el front: lo validan. La regla de creación
solo acepta el documento si `isStaff` es `false`, y la actualización del perfil
está prohibida para todos. Como consecuencia, desde el navegador es imposible:

- crear el perfil con `isStaff` en `true` (la creación exige `false`);
- modificarlo después (la actualización está denegada);
- tocar el documento de otro usuario (solo se permite el propio `uid`).

El único que puede pasar `isStaff` a `true` es el dueño del proyecto, desde la
consola de Firebase. Ese valor nunca sale del navegador. Para escribir en la
colección `productos`, las reglas verifican que el usuario tenga `isStaff` en
`true`, así que un usuario común navega la tienda pero no puede crear, editar ni
borrar productos.

Para designar un administrador:

1. Registrarse o iniciar sesión con el email que será administrador. Al entrar,
   la app crea su documento `usuarios/{uid}` con `isStaff` en `false`.
2. En la consola de Firebase, dentro de la colección `usuarios`, abrir ese
   documento (el id es el UID del usuario, visible también en Authentication).
3. Cambiar el campo `isStaff` a `true`.
4. En la app, cerrar sesión y volver a entrar. Ahora aparece el acceso al panel
   y se pueden administrar los productos.

## Carga inicial de productos

Los productos viven en Firestore. Para no cargarlos a mano la primera vez, el
panel de administración tiene un botón "Cargar catálogo inicial" que, si la
colección está vacía, la completa con los productos de `public/productos.json`.
Ese botón solo está disponible para un usuario administrador.

También hay un script equivalente para correr desde la terminal, que necesita un
usuario administrador ya creado porque las reglas exigen ese permiso:

```bash
SEED_EMAIL=tu@email.com SEED_PASSWORD=tuclave npm run seed
```

## Ejecutar el proyecto

```bash
npm run dev
```

Queda disponible en http://localhost:5173.

Para generar y probar la versión de producción:

```bash
npm run build
npm run preview
```

## Scripts disponibles

| Script            | Descripción                                            |
|-------------------|--------------------------------------------------------|
| `npm run dev`     | Servidor de desarrollo con recarga en caliente.        |
| `npm run build`   | Build de producción en la carpeta `dist/`.             |
| `npm run preview` | Sirve localmente el build de producción.               |
| `npm run seed`    | Carga los productos iniciales en Firestore.            |

## Estructura del proyecto

```
proyecto_react/
├── .env.example
├── index.html
├── vite.config.js
├── vercel.json
├── scripts/
│   └── seed.mjs
├── public/
│   ├── productos.json
│   └── img/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── firebase/
    │   └── config.js
    ├── context/
    │   ├── CartContext.jsx
    │   └── AuthContext.jsx
    ├── services/
    │   ├── productsService.js
    │   └── usersService.js
    ├── components/
    │   ├── Layout.jsx  Header.jsx  NavBar.jsx  Footer.jsx
    │   ├── CartWidget.jsx  ProductImage.jsx  ProductIcon.jsx
    │   ├── Item.jsx  ItemListContainer.jsx  ItemDetailContainer.jsx
    │   ├── ProtectedRoute.jsx  Seo.jsx
    │   ├── SearchBar.jsx  Pagination.jsx
    │   └── ProductForm.jsx  ConfirmModal.jsx
    └── pages/
        ├── Home.jsx  Productos.jsx  ProductoDetalle.jsx  Carrito.jsx
        ├── Contacto.jsx  Login.jsx  Register.jsx  Perfil.jsx
        └── AdminProducts.jsx  NotFound.jsx
```

## Rutas

| Ruta            | Acceso        | Descripción                          |
|-----------------|---------------|--------------------------------------|
| `/`             | Público       | Inicio.                              |
| `/productos`    | Público       | Catálogo con búsqueda y paginación.  |
| `/producto/:id` | Público       | Detalle de un producto.              |
| `/carrito`      | Público       | Carrito de compras.                  |
| `/contacto`     | Público       | Página de contacto.                  |
| `/login`        | Público       | Inicio de sesión.                    |
| `/register`     | Público       | Registro de usuario.                 |
| `/perfil`       | Con sesión    | Datos del usuario.                   |
| `/admin`        | Administrador | CRUD de productos.                   |
| `*`             | Público       | Página no encontrada.                |

## Usuario de prueba

Cualquier email con una contraseña de al menos 6 caracteres sirve para
registrarse como usuario común desde `/register`. Para probar el panel de
administración hay que convertir ese usuario en administrador siguiendo los
pasos de la sección de roles.

Ya hay un usuario administrador configurado para probar el panel:

- Email: admin@admin.com
- Contraseña: Adminadmin123

## Deploy

El proyecto está preparado para Vercel o cualquier hosting estático. Hay que
cargar las mismas variables `VITE_FIREBASE_*` en el panel del hosting, usar
`npm run build` como comando de build y `dist` como carpeta de salida. El
archivo `vercel.json` incluye la redirección necesaria para que el ruteo del
lado del cliente funcione al recargar cualquier ruta.
