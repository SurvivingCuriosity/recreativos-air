# Brief de rework de UI — Recreativos AIR

> Documento de entrada para una IA/diseñador que va a rehacer la interfaz **completa** de la app web Recreativos AIR (Liga de Futbolín de Salamanca). Contiene, pantalla por pantalla, todos los textos literales, elementos, estados, condicionales por rol, navegación y assets. Nada de lo que aquí se describe puede perderse en el rework.

## 0. Objetivo y reglas del rework

**Qué es la app.** Web app móvil-first (React) para gestionar ligas de futbolín: los usuarios se registran, crean equipos (parejas), se inscriben en ligas, consultan jornadas y clasificación e introducen resultados de sus enfrentamientos. Un rol **admin** crea ligas y temporadas, aprueba equipos, valida resultados y gestiona usuarios y equipos.

**Libertad total en:** estética, tipografía, paleta, espaciados, radios, sombras, iconografía (manteniendo el significado), animaciones y sistema de componentes (se migrará a **shadcn/ui**, ver §11).

**Intocable (debe reproducirse exactamente):**
1. **Rutas y navegación**: mismas URLs, mismos enlaces y destinos, misma estructura de menú (header + menú hamburguesa fullscreen en móvil, enlaces inline en desktop `lg`), mismas tabs en el detalle de liga.
2. **Copys**: todos los textos entre comillas de este documento son literales y deben conservarse tal cual (incluidas erratas marcadas con [sic]; el cliente decidirá aparte si las corrige).
3. **Jerarquía y orden de elementos** dentro de cada pantalla (el orden numerado de "Elementos y copys").
4. **Comportamiento y estados**: loading, vacío, error, validaciones, toasts, diálogos de confirmación, deshabilitados.
5. **Condicionales por rol** (invitado / usuario autenticado / admin) y por estado de dominio (estado de liga, de equipo en liga, de enfrentamiento, de invitación).
6. **Tema oscuro** como base (fondo casi negro, texto claro, acento azul). El rework puede proponer variante clara, pero la oscura es la referencia; existen versiones `*light` de logos y fondos de futbolín sin usar que sirven para ello.

**Convenciones del documento:**
- Texto literal: `"así"`. Texto dinámico: `{nombreLiga}`, `{n}`, con explicación.
- Iconos: nombres de FontAwesome Solid actuales (`faTrophy`…) para indicar el significado; pueden sustituirse por el set del nuevo diseño (p. ej. Lucide en shadcn) manteniendo la semántica.
- Medidas de referencia en clases Tailwind actuales (`h-10` = 40px, `max-w-screen-sm` = 640px, `lg:` ≥ 1024px, `md:` ≥ 768px).
- Índice: §1 sistema visual · §2 shell global · §3 mapa de rutas · §4 pantallas públicas · §5 pantallas de usuario · §6 detalle de liga · §7 administración · §8 componentes de tarjeta · §9 overlays y selectores · §10 assets · §11 componentes → shadcn e iconos → Lucide · §12 catálogo de copys · §13 checklist.

---

## 1. Sistema visual actual

### 1.1 Tokens y base global (`globals.css`, `index.html`)

**Framework:** Tailwind v4 (`@import "tailwindcss"`) con un bloque `@theme` que solo añade dos colores custom y dos animaciones. El resto de la paleta es la neutral por defecto de Tailwind. No hay modo claro: toda la app es oscura por defecto (el `MainLayout` pinta `bg-neutral-950 text-neutral-50`).

**Colores custom del tema:**

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#1f93eb` (azul) | Color de marca: títulos, botón primary, bordes activos, enlaces del menú desktop, focus de inputs, borde del header cuando el usuario es admin, badge de progreso, iconos destacados |
| `--color-primary2` | `#44a5ea` (azul más claro) | Solo se usa como origen del degradado radial del botón `primary` (`from-primary2 to-primary`) |

En el CSS hay dos paletas alternativas comentadas (una verde oscura con primary amarillo `#f1da0c` y otra marrón/naranja), que no están activas.

**Paleta neutral de Tailwind usada (roles observados en este ámbito):**

| Rol | Clases |
|---|---|
| Fondo de página | `neutral-950` (también `neutral-950/95` para el menú móvil y `neutral-950/90` para backdrop de `Window`) |
| Texto principal | `neutral-50` |
| Superficies (tarjetas, formularios, items de menú, spinner, diálogo) | `neutral-900` (y `neutral-900/80`, `neutral-900/70` con `backdrop-blur-xs` sobre la foto de landing) |
| Inputs, pista de barra de progreso | `neutral-800` |
| Bordes de tarjetas/formularios/tabla | `neutral-800`; borde del header y de `Window` y del menú del Select: `neutral-700`; separadores de `FormField` con `border`: `neutral-500` |
| Texto secundario | `neutral-400` (párrafos secundarios, enlaces "He olvidado mi contraseña", labels de ProgressBar, texto de tabla, items inactivos de InlinePicker) |
| Texto terciario / enlaces discretos | `neutral-500` (subtítulos de formularios, texto del FullPageSpinner) y `neutral-600` (enlaces "¿No tienes cuenta? Regístrate", "Volver…", icono del ContextButton) |
| Labels de formulario, texto del menú desktop/móvil | `neutral-200` / `neutral-300` |
| Disabled | fondo `neutral-700` + texto `neutral-600` (botones); fondo `neutral-600` + texto `neutral-500` (inputs) |

**Colores semánticos:**

| Color | Uso |
|---|---|
| Rojo `red-500` | botón `danger`, badge de pendientes en la hamburguesa, texto de errores de validación (`text-red-500 text-xs`), texto "Error al cargar las ligas" |
| Rojo `red-400` | texto y borde del botón `outline-danger` |
| Rojo `red-600` | botón confirmar de `ConfirmDialog` (`hover:bg-red-700`), fondo del banner "Sin conexión", fondo de `Message error` al 50 % (`red-600/50`), fondo de inputs con error al 20 % (`red-600/20`) |
| Rojo `red-200` | texto/icono de `Message error` |
| Verde `green-600` | banner "Conexión restablecida", fondo de `Message success` al 50 % |
| Verde `green-200` | texto/icono de `Message success` |
| Verde `#4dc247` | botón flotante de WhatsApp |
| Ámbar `amber-300` / `amber-500/15` / `amber-500/30` | texto / fondo / borde del `AvisoPerfilSinNombre` |
| Negro `black/60` + `backdrop-blur-[2px]` | overlay de `ConfirmDialog`; `black/20` overlay sobre la foto de landing |
| `zinc-200` + texto negro | items del menú de `ContextButton` |

**Tipografía:**

- Cuerpo: `Inter` (variable 100–900, itálica incluida), aplicada a `*` vía `@layer base`. Google Fonts con `preconnect`.
- Display: `Zen Dots` bajo la clase utilitaria `.font-cool`. Se usa en: labels de items del menú móvil (`text-base`), "Mis ligas" en landing (`text-2xl font-black`), bloque "¡ Encuentra futbolines cerca !" (`text-xs`), título de `CtaLigasDisponibles` (`text-lg`), h1 "Competiciones" (`text-3xl font-bold`).
- `user-select: none` global en todos los elementos; `scroll-behavior: smooth`.
- Se ocultan las flechas de los `input[type=number]` (WebKit y Firefox).

**Radios recurrentes:** `rounded-2xl` (16 px: botones, inputs, textarea, items de menú móvil, contenedor de `Window`, bloque logo futbolin.app del menú), `rounded-3xl` (24 px: bloque futbolin.app en landing, tarjeta CTA), `rounded-xl` (12 px: formularios de auth, `ConfirmDialog`, contenedor de `InlinePicker`, botón WhatsApp), `rounded-lg` (8 px: tabla, items FAB/ContextButton, indicador InlinePicker, skeletons), `rounded-full` (botón solo icono, badge, pista de progreso, FAB principal), `rounded` (4 px: `Message`, botones de `ConfirmDialog`), Select: `0.375rem`.

**Animaciones:**

| Nombre | Definición | Dónde |
|---|---|---|
| `animate-fade-in-top` | `fade-in-top 0.5s ease-out both`: de `translateY(-15px)` + opacidad 0 a posición normal + opacidad 1 | h1 y párrafo de landing, tarjeta CTA, cada `TarjetaLiga` en Competiciones (con `animationDelay` escalonado de 0,1 s por índice), contenedor de `Window`, menú de `ContextButton` |
| `animate-in-right` | `in-right 0.5s ease-in-out both`: de `translateX(80px)` a posición normal | Botón WhatsApp de landing (con `animationDelay: 0.5s`) |
| `.animate` (`tri-right`) | animación vinculada a scroll (`animation-timeline: view()`) con desplazamiento diagonal y fade; definida pero no se usa en este ámbito | — |
| `animate-pulse` (Tailwind) | pulso de opacidad | skeletons "Cargando..." de landing, banner rojo sin conexión |
| `animate-spin` (Tailwind) | giro | spinner circular de landing mientras carga auth |
| `animate-pulste` [sic] | clase inexistente (errata) en `FullPageSpinner`; no produce animación | FullPageSpinner |
| Transiciones | hamburguesa (barras `transition-all duration-200`), panel de menú móvil (`left-full` → `left-0`, 200 ms), `ConfirmDialog` (opacidad 300 ms + `scale-95`→`scale-100`), indicador de `InlinePicker` (`transition-transform 300ms ease-in-out`), barra de `ProgressBar` (300 ms), `AdaptativeFlexContainer` (`flex 200ms ease-out`), FAB (300 ms opacidad + `translate-y-4`) | — |

Nota: el menú móvil añade la clase `no-scroll` al `body` al abrirse, pero esa clase no está definida en ningún CSS (no bloquea realmente el scroll).

**Meta / head:** título de pestaña "Recreativos AIR"; `meta description` "Liga Futbolín Salamanca - Recreativos AIR"; `og:site_name` "Recreativos AIR"; `og:locale` `es_ES`; imagen OG/Twitter `https://recreativosair.com/fondo.png`; favicons en `/favicon/*` (96x96 PNG, SVG, ICO, apple-touch 180) más `/logo.png`; `apple-mobile-web-app-title` "Recreativos AIR"; manifest `/favicon/manifest.json`. Algunas páginas fijan `<title>` propio: "Registro | Recreativos Air", "Competiciones | Recreativos Air".

### 1.2 Fichas de componentes base (`src/packages/components`, `src/shared/components`)

#### Button
- Elemento `button` (o `a` si se pasa `href` y `as="a"`). Siempre `w-full h-10`, `flex items-center justify-center gap-2 font-bold rounded-2xl`, sin outline de foco.
- Con texto: `px-3 py-1`. **Solo icono** (sin children y con `icon`): `p-2 rounded-full aspect-square` (círculo de 40 px).
- Icono FontAwesome a `w-5 h-5`, a la izquierda del texto.
- Variantes (por defecto `primary`):

| Variante | Fondo | Texto | Borde |
|---|---|---|---|
| `primary` | degradado radial `from-primary2 (#44a5ea) to-primary (#1f93eb)` | `neutral-900` | — |
| `outline` | `neutral-900/80` | `primary` | `primary` |
| `neutral` | `neutral-400` | `neutral-900/80` | `neutral-400` |
| `outline-neutral` | `neutral-900/80` | `neutral-400` | `neutral-400` |
| `danger` | `red-500` | blanco | `red-500` |
| `outline-danger` | `neutral-900/80` | `red-400` | `red-400` |

- Disabled (todas las variantes): fondo `neutral-700` plano (se elimina el degradado), texto `neutral-600`.
- Comportamiento: hace `stopPropagation`; si `type !== "submit"` hace `preventDefault`.

#### Titulo
Etiqueta semántica según `variant`, siempre `text-primary`:
`h1` `text-4xl font-extrabold` · `h2` `text-3xl font-bold` · `h3` `text-2xl font-bold` · `h4` `text-xl font-bold` · `h5` `text-lg font-bold` · `h6` `text-base font-bold`. (No se usa en las pantallas públicas de este ámbito; los h1 de auth usan `text-2xl font-bold text-center` en color neutral-50 directamente.)

#### Message
Caja `flex items-center p-1 px-2 rounded text-xs gap-2` con icono a la izquierda:

| Variante | Icono | Fondo | Texto/icono |
|---|---|---|---|
| `success` | `faCheckCircle` | `green-600/50` | `green-200` |
| `error` | `faExclamationCircle` | `red-600/50` | `red-200` |
| `info` | `faInfoCircle` | `neutral-900` | `neutral-400` |

#### TextInput
`input type=text`, `w-full h-10 p-1 px-2 rounded-2xl`, fondo `neutral-800`, sin borde; foco: `outline-1 outline-primary`. **hasError**: fondo `red-600/20`. Disabled: fondo `neutral-600`, texto `neutral-500`, `cursor-not-allowed`. El mensaje de error va fuera del input, como `<p>` `text-red-500 text-xs` bajo el campo.

#### PasswordInput
Igual que TextInput pero con botón interior a la derecha (`right-2`, centrado verticalmente, color `neutral-400`) que alterna `faEye` (oculta) / `faEyeSlash` (mostrando) y cambia el tipo `password`↔`text`.

#### TextArea
`textarea` `h-18 max-h-32 min-h-10 bg-neutral-800 p-1 px-2 rounded-2xl`, foco `outline-1 outline-primary`, disabled igual que TextInput. Sin variante de error.

#### FormField / FormLabel
- `FormField` columna: `flex flex-col space-y-0.5 mb-2`; con `row`: `flex flex-row items-center space-x-2`; con `border`: sustituye `mb-2` por `pb-2 border-b border-neutral-500`.
- `FormLabel`: `label text-sm text-neutral-200`.

#### Select (`CustomSelect`, `CustomAsyncSelect`, `CustomMultiSelect`) — react-select con `sharedStyles`
- Control: alto `36px`, fondo `neutral-800` (`neutral-700` disabled), borde transparente 1 px, radio `0.375rem`, sin sombra; **focus-within**: borde 1 px `primary`; hover: sin cambio.
- Texto escrito `neutral-300`; valor seleccionado `neutral-200` (`neutral-500` disabled).
- Menú desplegable: fondo `neutral-950`, borde 1 px `neutral-700`, padding `0.25em`, color base `primary`.
- Opción: radio 5 px, texto `neutral-50`, fondo `neutral-950`; seleccionada fondo `neutral-900`; hover fondo `neutral-800` + texto `primary`.
- `CustomSelect`: no buscable por defecto, no limpiable; copys por defecto: placeholder "Escribe para buscar", sin opciones "Sin resultados", cargando "Cargando...". Las opciones pueden llevar `imageUrl` (imagen 20x20 a la izquierda de la etiqueta).
- `CustomAsyncSelect`: buscable, limpiable, debounce 250 ms; mismos copys y además "Escribe para buscar..." cuando el input está vacío.
- `CustomMultiSelect`: alto automático, chips de valor con fondo `neutral-700`, radio `0.375rem`, texto `neutral-200`, botón quitar `neutral-400` que en hover pasa a fondo `red-500` + texto `neutral-50`; no cierra al seleccionar; buscable por defecto.

#### InlinePicker (tabs segmentadas)
Contenedor `rounded-xl bg-neutral-900 p-1`; indicador deslizante absoluto `rounded-lg bg-neutral-500/20` de ancho `100/n %` que se traslada con `transition-transform 300ms`. Items: `rounded-lg px-2 py-0.5 text-center`, icono opcional encima del texto, activo `text-primary`, inactivo `text-neutral-400`. Tamaños de texto: `sm` = `text-xs`, `md` = `text-sm`, `lg` = `text-base`. Opcional punto `size-1.5 bg-primary` arriba a la derecha (`showDot`).

#### Tabla
`table w-full table-auto border-separate border-spacing-0 rounded-lg overflow-hidden shadow-sm text-left text-neutral-400 border border-neutral-800`. Cabeceras `text-center p-1 font-semibold text-sm border-b border-r border-neutral-800`; si la columna es ordenable la cabecera es un botón y muestra "▲" (asc) / "▼" (desc) en `text-xs` junto al texto solo en la columna activa. Celdas `p-1 text-sm text-center border-b border-r border-neutral-800`; la columna cuyo header es "Equipo" se alinea a la izquierda con `max-w-27 truncate`. Sin hover de fila.

#### ContextButton (menú contextual "tres puntos")
Botón disparador `size-8 text-neutral-600` con icono `text-2xl` (por defecto `faPlus` cerrado / `faXmark` abierto). Al abrir, menú absoluto a la izquierda del botón (`top-[70%] right-9`) con `animate-fade-in-top`, items `w-60 bg-zinc-200 border border-neutral-800 text-black p-2 px-3 rounded-lg flex gap-2 font-medium` con icono + label. Cierra al hacer clic fuera o al elegir un item.

#### FAB
Fijo `right-4 bottom-4`. Botón principal `h-14 w-14 rounded-full bg-primary text-black shadow-lg` con icono `text-2xl` (`faPlus` / `faXmark`), hover `bg-primary/70`, `focus-visible:ring-2 ring-primary/70`; aria-label "Abrir menú" / "Cerrar menú". Lista de acciones sobre él (`mb-4`, alineadas a la derecha): `min-w-44 bg-primary text-black p-2 px-3 rounded-lg flex gap-2 font-medium`, aparecen con fade + `translate-y-4`.

#### Window (modal `<dialog>`)
`dialog` centrado horizontalmente, `mt-20`, ancho `w-11/12 md:w-1/2 xl:w-1/4`, fondo transparente, backdrop `neutral-950/90` + `backdrop-blur-xs`. Panel interior `bg-neutral-900 border border-neutral-700 rounded-2xl p-3 pt-6` con `animate-fade-in-top`. Botón cerrar `faXmark` `size-6` en `top-2 right-2`, `text-neutral-400` (hover `neutral-500`). Título `text-primary font-bold text-xl truncate mb-5` (por defecto vacío).

#### ConfirmDialog
Portal a `body`; overlay `bg-black/60 backdrop-blur-[2px]` (clic cierra/cancela); cuadro `bg-neutral-900 rounded-xl shadow-lg p-6 w-full max-w-sm mx-4`, transición opacidad + escala. Icono opcional centrado arriba; título `text-lg font-semibold text-center text-primary`; descripción `text-sm text-neutral-400 text-center`; dos botones a ancho completo en fila: cancelar `border border-neutral-300 text-neutral-400 rounded text-sm px-4 py-2` (hover `bg-neutral-100`), confirmar `bg-red-600 text-white rounded` (hover `bg-red-700`). Bloquea el scroll del body mientras está abierto.
Copys por defecto: título "¿Estás seguro?", descripción "Esta acción no se puede deshacer.", confirmar "Confirmar", cancelar "Cancelar".

#### FullPageSpinner
`div w-full h-svh bg-neutral-900 flex items-center justify-center` con texto "Cargando..." en `text-neutral-500` (clase de animación mal escrita, sin efecto).

#### ProgressBar
Opcional fila de label `text-xs text-neutral-400` con `{label}` y a su derecha `{porcentaje}%` en `text-primary font-bold` (redondeado, 0–100). Pista `h-2 w-full rounded-full bg-neutral-800`; relleno `rounded-full` color configurable (por defecto `bg-primary`) con `transition-all 300ms`.

#### Portal
Utilidad sin UI: renderiza hijos en `document.body`.

### 1.3 Iconos FontAwesome (free-solid) usados en este ámbito

| Icono | Dónde |
|---|---|
| `faUser` | Menú: "Mi perfil" y "Equipos" (admin) |
| `faTrophy` | Menú: "Competiciones" (invitado y usuario); tarjeta `CtaLigasDisponibles` (landing); botón "Nueva liga" (Competiciones, admin) |
| `faPlus` | Menú: "Crear equipo", "Crear liga" (admin); icono por defecto abierto de ContextButton y FAB |
| `faUsers` | Menú: "Usuarios" (admin) |
| `faCalendarDays` | Menú: "Temporadas" (admin) |
| `faRightToBracket` | Menú invitado: "Inciar sesión" [sic] |
| `faUserPlus` | Menú invitado: "Crear cuenta" |
| `faSync` | Botón "Actualizar" del menú móvil |
| `faCheck` / `faXmark` | Botones "Confirmar" / "Rechazar" del bloque "Pendientes de confirmar" del menú (admin); `faXmark` también cierra Window, ContextButton y FAB |
| `faTriangleExclamation` | `AvisoPerfilSinNombre` |
| `faEye` / `faEyeSlash` | Alternar visibilidad en `PasswordInput` |
| `faCheckCircle` / `faExclamationCircle` / `faInfoCircle` | `Message` success / error / info |

---

---

## 2. Shell global

### 2.1 MainLayout
- Contenedor raíz `bg-neutral-950 text-neutral-50 min-h-svh flex flex-col`. Orden: `TopNav` → `AvisoPerfilSinNombre` → área de contenido (`relative mx-auto flex flex-col items-center flex-1 w-full`) → fuera del flujo, `NetworkStatusBanner`.
- **Marca de agua:** imagen `/logo.png` fija (`fixed`), `w-full` en móvil (`md:w-90`, 360 px), opacidad **4 %**, `pointer-events-none`, anclada `-bottom-1/12 left-1/3` (en `md`: `left-20`), debajo del contenido (`z-1` frente a `z-2` del `Outlet`).
- Se usa el mismo layout para las tres ramas de rutas (públicas, protegidas, admin).

### 2.2 TopNav (header)
- `header` `h-14 p-2 border-b w-full`, `relative z-3`. Borde inferior `neutral-700`; **si el usuario es admin, borde `primary`**.
- Interior `nav max-w-screen-lg mx-auto flex items-center justify-between`: a la izquierda enlace a `/` con `/logo.png` a `size-10` (40 px); a la derecha el bloque `HamburgerMenu`.
- **Botón hamburguesa** (solo `< lg`): `size-6`, tres barras `h-[3px] w-full rounded-lg` color `neutral-200` (o `primary` si admin), `gap-2`. Abierto: barra 1 rota 45° y escala 120 %, barra 2 se desvanece, barra 3 rota −45°. `aria-label` "Botón abrir menú lateral".
- **Badge de pendientes (solo admin, si conteo > 0):** círculo `bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1` en la esquina superior derecha del botón (`-top-2 -right-2`) con `{conteoEnfrentamientosPendientes}` (número de resultados pendientes de confirmar).
- **Enlaces desktop (`hidden lg:flex`, `gap-6`, texto `primary`, sin icono):**
  - Sesión iniciada: "Mi perfil" → `/mi-perfil`, "Competiciones" → `/competiciones`.
  - Invitado: "Iniciar sesión" → `/login`, "Crear cuenta" → `/register`, "Competiciones" → `/competiciones`.
  - (Nota: en desktop no aparecen los enlaces de admin ni "Crear equipo"; en desktop el menú hamburguesa está oculto.)

### 2.3 Menú fullscreen móvil (`< lg`)
Panel `fixed top-0 h-dvh w-screen bg-neutral-950/95`, se desliza desde la derecha (`left-full` → `left-0`, 200 ms), `pt-20 pb-4`. Lista interior `px-7 space-y-2 text-xl text-neutral-300 flex flex-col h-full`. Cada item (`TopNavItem`) es una tarjeta `flex items-center gap-2 p-3 bg-neutral-900 rounded-2xl w-full overflow-hidden` con icono pequeño a la izquierda, el mismo icono gigante decorativo (`text-6xl opacity-5`, rotado −12°, arriba a la derecha) y el label en `font-cool text-base`. Al pulsar cierra el menú y navega.

Orden y contenido por rol:

**Invitado**
1. Botón "Actualizar" (variante `outline-neutral`, icono `faSync`) — invalida todas las queries y cierra el menú.
2. "Inciar sesión" [sic] — `faRightToBracket` → `/login`
3. "Crear cuenta" — `faUserPlus` → `/register`
4. "Competiciones" — `faTrophy` → `/competiciones`
5. Al fondo (`mt-auto ml-auto`): bloque `bg-neutral-900 rounded-2xl` con imagen `/logo-futbol-in.png` `w-40 p-2 px-5` → enlace externo `https://www.futbolin.app` (nueva pestaña).

**Usuario registrado (no admin)**
1. Botón "Actualizar" (igual).
2. "Mi perfil" — `faUser` → `/mi-perfil`
3. "Competiciones" — `faTrophy` → `/competiciones`
4. "Crear equipo" — `faPlus` → `/crear-equipo`
5. Bloque logo futbolin.app (igual).

**Admin**
1. Bloque "Pendientes de confirmar" (solo si hay enfrentamientos pendientes): cabecera `text-sm text-neutral-400 font-semibold uppercase tracking-wide` "Pendientes de confirmar"; debajo, por cada enfrentamiento una `TarjetaEnfrentamiento` (ver §8.2) y una fila con dos botones: "Rechazar" (`outline`, `faXmark`) y "Confirmar" (`primary`, `faCheck`), ambos deshabilitados mientras cualquiera de las dos acciones está en curso. Toasts: éxito "Resultado confirmado" / "Resultado rechazado y reiniciado"; error "Error al confirmar el resultado" / "Error al rechazar el resultado".
2. Botón "Actualizar".
3. "Mi perfil" — `faUser` → `/mi-perfil`
4. "Competiciones" — `faTrophy` → `/competiciones`
5. "Crear equipo" — `faPlus` → `/crear-equipo`
6. Fila de dos tarjetas (`flex gap-2`): "Usuarios" — `faUsers` → `/admin-usuarios` · "Equipos" — `faUser` → `/admin-equipos`
7. "Temporadas" — `faCalendarDays` → `/admin-temporadas`
8. Bloque logo futbolin.app.

(El item "Crear liga" — `faPlus` → `/crear-liga`, `onlyAdmin` — está definido en el contenido de navegación pero **no se renderiza** en el menú; el acceso a crear liga se hace desde el botón "Nueva liga" de Competiciones.)

Existe además un componente `TopNavCompeticiones` (header alternativo con items "Competiciones" y "Mi perfil") que **no está en uso** en el router.

### 2.4 AvisoPerfilSinNombre
- Aparece justo bajo el header cuando hay usuario logueado, su `nombre` está vacío/en blanco y la ruta actual **no** es `/mi-perfil/editar`.
- Banda a ancho completo, enlace a `/mi-perfil/editar`: `flex items-center justify-center gap-2 px-3 py-2 text-sm`, texto `amber-300`, fondo `amber-500/15`, borde inferior `amber-500/30`, icono `faTriangleExclamation`.
- Copy literal: "Tu perfil no tiene nombre. Ponte un nombre para que tus compañeros te reconozcan." — el fragmento "Ponte un nombre" va subrayado y en negrita.

### 2.5 NetworkStatusBanner
Banda `fixed top-0 left-0 w-full z-50 text-center py-2 text-sm font-medium text-white shadow-md`.
- Sin conexión (evento `offline`): fondo `red-600`, `animate-pulse`, texto "🔌 Sin conexión a internet". Permanece hasta reconectar.
- Al reconectar (evento `online`): fondo `green-600`, texto "✅ Conexión restablecida", se oculta a los 3 s.
- No se muestra nada en estado normal.

### 2.6 Toaster (react-hot-toast)
Montado en `main.tsx` con `duration: 2000` (2 s) para todos los toasts; posición por defecto de la librería (top-center) y estilo por defecto (no personalizado). Se usan `toast.success` y `toast.error`.

### 2.7 Guards
- **RequireAuth** (`src/navigation/components/RequireAuth.tsx`): mientras carga `useMe` muestra `FullPageSpinner` ("Cargando..."). Si hay error o no hay usuario, redirige a `/login` (replace) guardando `state.from` con la ubicación original (el login vuelve ahí tras entrar). Si hay usuario, renderiza la ruta hija dentro de `Suspense` con fallback `FullPageSpinner`.
- **RequireAdmin**: mientras carga muestra `FullPageSpinner`; si el usuario no es admin redirige a `/` (replace); si es admin renderiza la hija.
- Existe un segundo `RequireAuth` en `src/shared/api/auth/RequireAuth.tsx` (wrapper por children, redirige a `/login` sin `state`), no usado por el router.

---

---

## 3. Mapa de navegación y roles

Guards: **RequireAuth** (sin sesión → redirige a `/login` guardando la ruta de origen; mientras carga la sesión muestra el `FullPageSpinner`). **RequireAdmin** (si el usuario no es admin → redirige a `/`). El rol es un único booleano `admin`; "jugador de un equipo / capitán / espectador" se deduce por pertenencia en cada pantalla.

| Ruta | Pantalla | Acceso | Desde dónde se llega |
|---|---|---|---|
| `/` | Landing | Pública | Logo del header; redirección de RequireAdmin |
| `/login` | Iniciar sesión | Pública | Menú (invitado), Landing, redirección de RequireAuth, enlaces desde Registro/Reset |
| `/register` | Crear cuenta | Pública | Menú (invitado), Landing, enlace en Login |
| `/reset-password` | Recuperar contraseña (paso 1: pedir código) | Pública | Enlace en Login |
| `/reset-password/:token` | Recuperar contraseña (paso 2: nueva contraseña) | Pública | Enlace del email de recuperación |
| `/verify-email` | Verificar email | Pública (necesita el email en el state de navegación) | Tras registro |
| `/competiciones` | Lista de competiciones | Pública | Menú (todos), Landing, Mi perfil |
| `/competiciones/:id` | Detalle de liga (layout con tabs) | Autenticado | Sin index: todos los enlaces van a `/clasificacion` |
| `/competiciones/:id/clasificacion` | Tab Clasificación | Autenticado | TarjetaLiga, tab |
| `/competiciones/:id/jornadas` | Tab Jornadas | Autenticado | Tab |
| `/competiciones/:id/equipos` | Tab Equipos | Autenticado | Tab |
| `/competiciones/:id/info` | Tab Información | Autenticado | Tab |
| `/competiciones/:id/ajustes` | Tab Ajustes | Autenticado (tab visible solo para admin) | Tab (admin) |
| `/user/:id` | Perfil público | Autenticado | Nombre de jugador en tarjetas/listas; si es uno mismo → `/mi-perfil` |
| `/mi-perfil` | Mi perfil | Autenticado | Menú, header desktop, banner "perfil sin nombre" |
| `/mi-perfil/editar` | Editar perfil | Autenticado | Botón en Mi perfil, banner ámbar |
| `/crear-equipo` | Crear equipo | Autenticado | Menú, Mi perfil |
| `/equipos/:id` | Detalle de equipo | Autenticado | TarjetaEquipo, listas de equipos |
| `/jornadas/:id` | Detalle de jornada / enfrentamiento | Autenticado | TarjetaEnfrentamiento, panel "Enfrentamientos pendientes" (admin) |
| `/crear-liga` | Crear liga | Admin | Botón "+" en Mi perfil y "Nueva liga" en Competiciones (no está en el menú) |
| `/admin-equipos` | Admin · Equipos | Admin | Menú (admin) |
| `/admin-usuarios` | Admin · Usuarios | Admin | Menú (admin) |
| `/admin-temporadas` | Admin · Temporadas | Admin | Menú (admin) |
| `/admin-temporadas/nueva` | Admin · Nueva temporada | Admin | Botón en lista de temporadas |
| `/admin-temporadas/:id` | Admin · Detalle temporada | Admin | TarjetaTemporadaAdmin |

Notas: no existe página 404 ni error boundary (el rework puede proponerlas, no es obligatorio). Todas las pantallas comparten el shell de §2 (header + menú + banners).

---

## 4. Pantallas públicas

### Landing — `/`
**Acceso:** pública (contenido distinto según sesión). **Propósito:** portada de marca con acceso rápido a login/registro, o resumen "Mis ligas" si hay sesión.

**Layout:** `main p-4 pt-8 pb-18 flex-1 flex flex-col items-center justify-between` a ancho completo. Fondo: foto `tsunami.jpg` fija a pantalla completa (`h-svh w-full object-cover object-center fixed -z-1`) con overlay fijo `bg-black/20`. Orden vertical: h1 → párrafo descriptivo → bloque central (spinner / "Mis ligas" / botones de invitado) → bloque futbolin.app empujado al fondo (`mt-auto`) → botón WhatsApp flotante (solo invitado). El bloque de invitado tiene `max-w-lg`; el de "Mis ligas" `max-w-11/12 md:min-w-md md:max-w-3xl`. Sin sticky.

**Elementos y copys (en orden visual):**
1. Título h1 (Inter, `font-black text-4xl xl:text-5xl 2xl:text-6xl leading-none text-center`, `animate-fade-in-top`): "Recreativos AIR" — la palabra "AIR" en `text-primary`, el resto `neutral-50`.
2. Párrafo (`text-neutral-400 text-sm text-center text-balance mt-4`, `animate-fade-in-top`): "Empresa especializada en futbolines Tsunami e Infinity en la provincia de Salamanca."
3. **Si sesión cargando:** spinner circular `w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin` centrado.
4. **Si logueado — bloque "Mis ligas":**
   1. Título (`font-cool text-primary text-2xl font-black my-3`): "Mis ligas"
   2. Carrusel horizontal (`flex overflow-x-auto gap-2 snap-x rounded-lg pb-3`) de `TarjetaLiga` (una por liga del usuario, `w-11/12` si hay más de una, `w-full` si solo hay una ; ver §8.2). Las ligas activas van primero (activa = no finalizada y de la temporada actual o sin temporada).
   3. Tarjeta `CtaLigasDisponibles` (solo si el usuario no tiene ninguna liga activa): `p-4 rounded-3xl border border-primary/30 bg-neutral-900/80 backdrop-blur-xs mt-3`, `animate-fade-in-top`. Fila con icono `faTrophy` `text-primary` + título `font-cool text-lg text-primary`: "Tus ligas han terminado" (si tiene ligas) o "Aún no estás en ninguna liga" (si no tiene). Descripción `text-sm text-neutral-400`: si hay ligas abiertas → "Hay {n} liga abierta a inscripción{ en {nombreTemporada}}." / "Hay {n} ligas abiertas a inscripción{ en {nombreTemporada}}." (el sufijo " en {temporadaActual.nombre}" solo si hay temporada actual); si no → "Ahora mismo no hay ligas abiertas a inscripción. Estate atento a las próximas competiciones." Botón: variante `primary` "Ver ligas disponibles" si hay ligas abiertas; variante `outline` "Ver competiciones" si no.
5. **Si invitado:** columna `mt-5 gap-4 items-center`:
   1. Fila de dos botones (`flex w-full gap-2`): Button `primary` con enlace "Entrar 🚀" → `/login`; Button `outline` con enlace "No tengo cuenta" → `/register`.
   2. Enlace (`text-neutral-400 text-sm underline`): "He olvidado mi contraseña" → `/reset-password`.
6. Bloque enlace externo (`bg-neutral-900/70 backdrop-blur-xs rounded-3xl font-cool p-4 min-w-80 text-center text-xs`): texto "¡ Encuentra futbolines cerca !" y debajo imagen `/logo-futbol-in.png` (`max-w-32 mx-auto`) → `https://www.futbolin.app` (nueva pestaña).
7. **Botón WhatsApp** (solo invitado): `fixed bottom-3 right-3`, fondo `#4dc247`, `rounded-xl`, SVG del logo de WhatsApp en blanco `size-12 p-2`, `animate-in-right` con retardo 0,5 s. Abre `https://wa.me/34690175066?text=Hola%20%F0%9F%98%8A` (mensaje predeterminado "Hola 😊") en nueva pestaña. (Existe una variante `ButtonWhatsapp2`, no usada.)

**Estados:**
- Loading sesión: spinner circular (sin texto).
- Loading ligas del usuario: tres skeletons `animate-pulse max-w-80 h-30 bg-neutral-900 border border-neutral-800 rounded-lg` con texto "Cargando...".
- Error ligas: párrafo `text-red-500 text-center` "Error al cargar las ligas: {mensaje de error}".
- Vacío: gestionado por la tarjeta CTA descrita (títulos "Aún no estás en ninguna liga" / "Tus ligas han terminado").
- Sin toasts propios.

**Acciones y navegación:** "Entrar 🚀" → `/login`; "No tengo cuenta" → `/register`; "He olvidado mi contraseña" → `/reset-password`; `TarjetaLiga` → `/competiciones/{idLiga}/clasificacion`; "Ver ligas disponibles" / "Ver competiciones" → `/competiciones`; bloque futbolin.app → futbolin.app (externo); WhatsApp → wa.me (externo); logo del header → `/`.

**Assets:** `src/shared/assets/tsunami.jpg` (fondo fijo pantalla completa, `object-cover`, overlay negro 20 %); `/logo-futbol-in.png` (máx. 128 px de ancho, centrado); `/logo.png` (header 40 px y marca de agua 4 %); SVG inline WhatsApp.

---

### Login — `/login`
**Acceso:** pública. **Propósito:** iniciar sesión con email y contraseña.

**Layout:** `main h-full w-full p-4 max-w-screen-lg mx-auto flex flex-col justify-center` (formulario centrado verticalmente). Formulario `max-w-lg mx-auto w-full flex flex-col gap-4 rounded-xl p-2`; a partir de `sm`: `bg-neutral-900 border border-neutral-800 shadow-md p-6` (en móvil no tiene tarjeta: fondo transparente y sin borde). Sobre la marca de agua del layout.

**Elementos y copys (en orden visual):**
1. Título h1 (`text-2xl font-bold text-center`, Inter, neutral-50): "Iniciar sesión"
2. Campo — label "Email"; TextInput tipo text, placeholder "test@test.com", autofocus, autocomplete `username`.
3. Campo — label "Contraseña"; PasswordInput, placeholder "********", autocomplete `current-password`, botón ojo.
4. Enlace alineado a la izquierda (`mr-auto underline text-sm text-neutral-400 mt-2`): "He olvidado mi contraseña" → `/reset-password`.
5. Button `primary` type submit: "Entrar"
6. Enlace centrado (`mx-auto underline text-sm text-neutral-600 mt-2`): "¿No tienes cuenta? Regístrate" → `/register`.

**Estados:**
- Validación zod (`LoginSchema`), mensajes bajo cada campo en `text-red-500 text-xs` e input en fondo rojo 20 %: email no válido → "Introduce un correo válido"; contraseña < 6 caracteres → "La contraseña debe tener al menos 6 caracteres".
- `isPending`: botón "Entrar" deshabilitado (gris).
- Toasts: éxito "Inicio de sesión correcto" (login correcto; redirige a `state.from` o `/competiciones`); error "Tu correo no está verificado" (si la respuesta contiene "no verificado"; redirige a `/verify-email` con el email); error `{res.message}` (respuesta sin éxito, mensaje del servidor); error `{err.message}` (excepción de red/servidor: mensaje del backend o "Error desconocido del servidor" / "Error de red o servidor no disponible").

**Acciones y navegación:** "Entrar" → POST login → `from` (por defecto `/competiciones`) con replace; "He olvidado mi contraseña" → `/reset-password`; "¿No tienes cuenta? Regístrate" → `/register`.

**Assets:** ninguno propio (marca de agua del layout).

---

### Registro — `/register`
**Acceso:** pública. **Propósito:** crear una cuenta nueva; tras el alta envía a verificar el correo.

**Layout:** `main h-full w-full p-4 max-w-screen-lg mx-auto flex flex-col justify-center`. Formulario `max-w-md mx-auto w-full flex flex-col gap-4 rounded-xl p-2`, en `sm+`: `bg-neutral-900 border border-neutral-800 shadow-md p-6`. Los pares Email/Móvil y Nickname/Nombre van en fila (`AdaptativeFlexContainer`: `flex flex-row gap-2`; el campo con foco crece a `flex: 2` y el otro a `flex: 1` con transición de 200 ms; sin foco ambos `flex: 1`). Pestaña: "Registro | Recreativos Air".

**Elementos y copys (en orden visual):**
1. Título h1 (`text-2xl font-bold text-center`): "Registro"
2. Fila adaptativa:
   - label "Email"; TextInput placeholder "test@test.com", autofocus, autocomplete `email`.
   - label "Móvil"; TextInput placeholder "666666666", `inputMode=tel`, autocomplete `tel-national`.
3. Fila adaptativa:
   - label "Nickname"; TextInput placeholder "fer99", autocomplete `username`.
   - label "Nombre (opcional)"; TextInput placeholder "Fernando", autocomplete `given-name`.
4. label "Contraseña"; PasswordInput placeholder "********", autocomplete `new-password`.
5. label "Confirmar contraseña"; PasswordInput placeholder "********", autocomplete `new-password`.
6. Button `primary` type submit: "Registrarme"
7. Enlace centrado (`mx-auto underline mt-4`, color heredado neutral-50): "Ya tengo una cuenta" → `/login`.

**Estados:**
- Validación zod (`RegisterSchema`), mensajes `text-red-500 text-xs` bajo el campo + fondo rojo del input: email → "Introduce un correo válido"; username vacío → "Introduce un nombre de usuario", < 3 → "El nombre de usuario debe tener al menos 3 caracteres"; password vacío → "Introduce una contraseña", < 6 → "La contraseña debe tener al menos 6 caracteres"; confirmPassword < 6 → "La contraseña debe tener al menos 6 caracteres"; móvil vacío → "Introduce un número de móvil". (El esquema de registro **no** comprueba que las contraseñas coincidan; eso lo hace el servidor.)
- Errores de servidor por campo: si la API devuelve una lista `{field, message}`, cada mensaje se pinta bajo su campo (`handleApiErrors`); si devuelve un string, toast de error con ese texto; si es un objeto, toast "Error inesperado en la respuesta del servidor".
- `isPending`: botón "Registrarme" deshabilitado.
- Toasts: éxito "Te enviamos un código de verificación a tu correo" (alta correcta; navega a `/verify-email` con el email); error `{res.message}` (respuesta sin éxito con mensaje); error `{error.message}` o, si no hay, "Error del servidor. Inténtalo de nuevo más tarde." (fallo de red/servidor).

**Acciones y navegación:** "Registrarme" → POST register → `/verify-email`; "Ya tengo una cuenta" → `/login`.

**Assets:** ninguno propio.

---

### Reset password — `/reset-password` y `/reset-password/:token`
**Acceso:** pública. **Propósito:** recuperar la contraseña en dos pasos: solicitar código por email y luego introducir código + nueva contraseña.

Ambas rutas renderizan el **mismo componente**; el parámetro `:token` no se lee. El paso se controla por estado interno (empieza siempre en el paso 1). No hay indicador visual de pasos.

**Layout:** `main h-full w-full p-4 max-w-screen-lg mx-auto flex flex-col justify-center`. Cada paso es un formulario `max-w-md mx-auto w-full flex flex-col gap-4 bg-neutral-900 border border-neutral-800 shadow-md rounded-xl p-6` (aquí la tarjeta se muestra **también en móvil**, a diferencia de Login/Registro).

#### Paso 1 — solicitar código
**Elementos y copys (en orden visual):**
1. Título h1 (`text-2xl font-bold text-center`): "Recuperar contraseña"
2. Párrafo (`text-center text-neutral-500 text-sm`): "Introduce tu correo y te enviaremos un código de recuperación"
3. label "Email"; TextInput placeholder "test@test.com", autofocus, autocomplete `username`.
4. Button `primary` type submit: "Enviar código"
5. Enlace centrado (`mx-auto underline text-sm text-neutral-600 mt-2`): "Volver al inicio de sesión" → `/login`.

**Estados:** validación zod (`ForgotPasswordSchema`): "Introduce un correo válido". `isPending`: botón deshabilitado. Toasts: éxito "Si el correo existe, recibirás un código en breve" (tras enviar; pasa al paso 2); error `{err.message}` o "Error del servidor".

#### Paso 2 — código + nueva contraseña
**Elementos y copys (en orden visual):**
1. Título h1: "Nueva contraseña"
2. Párrafo (`text-center text-neutral-500 text-sm`): "Hemos enviado un código de 6 dígitos a {email}" — `{email}` en `<strong>`, es el correo introducido en el paso 1.
3. label "Código"; TextInput placeholder "123456", `inputMode=numeric`, `pattern=[0-9]*`, `maxLength=6`, autocomplete `one-time-code`, autofocus.
4. label "Nueva contraseña"; PasswordInput placeholder "********", autocomplete `new-password`.
5. label "Confirmar contraseña"; PasswordInput placeholder "********", autocomplete `new-password`.
6. Button `primary` type submit: "Cambiar contraseña"
7. Botón de texto centrado (`mx-auto underline text-sm text-neutral-600 mt-2`): "Volver a introducir el correo" → vuelve al paso 1.

**Estados:** validación zod (`ResetPasswordSchema`): código ≠ 6 caracteres → "El código debe tener 6 dígitos"; contraseña < 6 → "La contraseña debe tener al menos 6 caracteres"; confirmación < 6 → "La contraseña debe tener al menos 6 caracteres"; contraseñas distintas → "Las contraseñas no coinciden" (bajo "Confirmar contraseña"). `isPending`: botón deshabilitado. Toasts: éxito "Contraseña actualizada correctamente" (navega a `/login`); error `{res.message}` (respuesta sin éxito); error `{err.message}` o "Error del servidor".

**Acciones y navegación:** "Enviar código" → POST forgot-password → paso 2; "Volver al inicio de sesión" → `/login`; "Cambiar contraseña" → POST reset-password → `/login`; "Volver a introducir el correo" → paso 1.

**Assets:** ninguno propio.

---

### Verificar email — `/verify-email`
**Acceso:** pública (se llega desde Registro o desde Login con correo no verificado; el email viene en `location.state`). **Propósito:** introducir el código de 6 dígitos recibido por correo para activar la cuenta.

**Layout:** `main h-full w-full p-4 max-w-screen-sm mx-auto flex flex-col justify-center`. Formulario `flex flex-col gap-4 bg-neutral-900 border border-neutral-800 shadow-md rounded-xl p-6` (tarjeta también en móvil), sin `max-w` propio (ocupa el `max-w-screen-sm`).

**Elementos y copys (en orden visual):**
1. Título h1 (`text-2xl font-bold text-center`): "Verifica tu correo"
2. Párrafo (`text-center text-neutral-500 text-sm`): "Hemos enviado un código de 6 dígitos a {email}" — `{email}` en `<strong>`; si no llega email en el estado, queda vacío.
3. label "Código"; TextInput placeholder "123456", `inputMode=numeric`, `pattern=[0-9]*`, `maxLength=6`, autocomplete `one-time-code`. Sin estado de error visual (no se usa `hasError`).
4. Button `primary` (type button, también dispara con Enter vía submit del form): "Verificar"

**Estados:**
- Sin validación zod en cliente. Validación manual: si no hay email → toast error "Falta el correo electrónico".
- `isPending`: botón deshabilitado.
- Toasts: éxito "Correo verificado correctamente" (guarda el token y navega a `/`); error `{res.message}` (respuesta sin éxito); error "Código inválido o expirado {error}" (excepción; se concatena el error serializado).

**Acciones y navegación:** "Verificar" → POST verify-email → `/`. No hay enlace de volver ni de reenviar código.

**Assets:** ninguno propio.

---

### Competiciones — `/competiciones`
**Acceso:** pública (con extras según rol: mensaje si el usuario no tiene equipo, botón "Nueva liga" si admin). **Propósito:** listar las ligas filtradas por temporada y entrar a su detalle.

**Layout:** contenedor `max-w-screen-md mx-auto flex flex-col items-center justify-start p-4 h-full gap-3`. Orden: h1 sticky → selector de temporada → (Message info) → (botón Nueva liga) → estados → lista de tarjetas. El h1 es **sticky** (`sticky top-0 bg-neutral-950 pb-2 w-full`, mismo fondo que la página para tapar el scroll). La lista es `flex flex-row flex-wrap gap-4 w-full h-11/12 overflow-y-auto pt-2 justify-center`, cada tarjeta envuelta en un `span w-full` con `animate-fade-in-top` y `animationDelay = índice × 0,1 s` (una columna de tarjetas a ancho completo). Pestaña: "Competiciones | Recreativos Air".

**Elementos y copys (en orden visual):**
1. Título h1 (`text-3xl font-bold font-cool`, Zen Dots, color neutral-50): "Competiciones"
2. **Selector de temporada** (`SelectorTemporada` → `CustomSelect` de react-select con `sharedStyles`, ancho completo): placeholder "Temporada". Opciones: "Todas" (siempre en esta pantalla); "Sin temporada" (solo admin); una por temporada con `{nombre}` o "{nombre} (actual)" si es la temporada actual. Valor inicial: la temporada actual si existe; si no, "Todas". No buscable.
3. **Message `info`** (`w-full mb-2`, solo si el usuario logueado tiene 0 equipos; icono `faInfoCircle`): párrafo "No perteneces a ningún equipo. Debes crear un equipo para poder inscribirte a las competiciones" y enlace (`text-primary underline text-sm`) "Crear equipo" → `/crear-equipo`.
4. **Button `primary` con icono `faTrophy`** (solo admin): "Nueva liga" → `/crear-liga`.
5. Estado loading: párrafo "Cargando..." (sin estilo especial).
6. Estado error: párrafo "Error al cargar {error}" (error serializado).
7. Lista de `TarjetaLiga` (una por liga; ver §8.2), clic → `/competiciones/{idLiga}/clasificacion`.

**Estados:**
- Loading: "Cargando..." (la query de ligas espera a que se resuelva la temporada actual).
- Vacío (0 ligas): párrafo centrado `p-10 text-neutral-400` "No hay ligas".
- Error: "Error al cargar {error}".
- Condicionales: Message "No perteneces a ningún equipo…" solo para usuarios logueados sin equipos; "Nueva liga" y opción "Sin temporada" solo para admin.
- Sin toasts propios.

**Acciones y navegación:** selector → refiltra la lista por temporada (o todas); "Crear equipo" → `/crear-equipo`; "Nueva liga" → `/crear-liga`; `TarjetaLiga` → `/competiciones/{id}/clasificacion` (ruta protegida: si no hay sesión, `RequireAuth` redirige a `/login` y tras entrar vuelve a la liga).

**Assets:** ninguno propio (marca de agua del layout; las tarjetas pueden llevar sus propias imágenes).

---

---

## 5. Pantallas de usuario autenticado

Notas comunes del bloque (enums y labels de estado que deben conservarse):

- Enums (paquete `recreativos-air-core`):
  - `EstadoEnfrentamiento`: `SinJugar = "SIN_JUGAR"`, `CorroborarResultado = "CORROBORAR_RESULTADO"`, `ConfirmarResultado = "CONFIRMAR_RESULTADO"`, `Jugado = "JUGADO"`. Variante `EstadoEnfrentamientoConOpcionCualquiera` añade `Cualquiera = "CUALQUIERA"`.
  - `EstadoJugadorEnEquipo`: `RECHAZADO`, `ACEPTADO`, `PENDIENTE` (los valores son los mismos strings en mayúsculas; TarjetaEquipo pinta el valor crudo `PENDIENTE` como label).
  - `EstadoEquipoEnLiga`: `Pendiente = "PENDIENTE"`, `Aprobado = "APROBADO"`, `Rechazado = "RECHAZADO"` (usado en TarjetaLiga, §8.2).
  - Labels de estado del enfrentamiento en frontend (tres mapas distintos, deben conservarse literales):
    | Estado | InfoEstadoEnfrentamiento (título) | TarjetaEnfrentamiento (chip) | SelectorEstadoEnfrentamiento (opción) |
    |---|---|---|---|
    | SinJugar | "Sin jugar" | "No jugado" (rojo 600) | "No jugado" |
    | CorroborarResultado | "Pendiente de confirmación" | "Corroborar resultado" (orange-300) | "Esperar rival" |
    | ConfirmarResultado | "Pendiente de finalización" | "Confirmar resultado" (yellow-300) | "Esperar admin" |
    | Jugado | "Jugado" | "Jugado" (verde 600) | "Jugado" |
- Aviso global relacionado (descrito en §2.4; enlaza a /mi-perfil/editar): banner ámbar `AvisoPerfilSinNombre` con icono `faTriangleExclamation` y texto "Tu perfil no tiene nombre. **Ponte un nombre** para que tus compañeros te reconozcan." (la parte en negrita va subrayada). Se oculta en `/mi-perfil/editar` y cuando el usuario ya tiene nombre. Todo él es un enlace a `/mi-perfil/editar`.


### Perfil público — `/user/:id`
**Acceso:** autenticado (datos de contacto y botón WhatsApp solo admin). **Propósito:** ver el perfil de otro usuario con sus equipos y las competiciones en las que juega.

**Layout:** contenedor sin `max-w` (ancho completo), `p-4`, columna con `gap-4`. Bloque 1: cabecera del usuario en tarjeta `bg-neutral-900 rounded-xl p-3`, `flex justify-between`, posición relativa para etiqueta ADMIN y botón WhatsApp en la esquina superior derecha. Bloque 2: dos paneles ("Equipos" y "Competiciones") en columna en mobile (`flex-col gap-2`) y en fila en `md:` (`md:flex-row md:gap-3`), cada uno `grow`; en `md:` los paneles reciben fondo `bg-neutral-900/80`, `rounded-xl` y `p-6` (en mobile no tienen fondo). Ambos listados son carruseles horizontales (`overflow-x-auto`). Sin sticky. Si el usuario logueado abre su propio id se redirige a `/mi-perfil`.

**Elementos y copys (en orden visual):**
1. Título h2 `font-cool` (primary, 3xl): "{username}" del usuario visto.
2. Párrafo `text-neutral-500`: "{nombre}" (nombre real).
3. [Solo admin] Fila icono `faPhone` + párrafo `text-neutral-500`: "{movil}".
4. [Solo admin] Fila icono `faEnvelope` + párrafo `text-neutral-500`: "{email}".
5. [Solo admin y si el usuario tiene móvil] Botón WhatsApp `ButtonWhatsapp2` absoluto arriba-derecha (`top-1 right-2`): círculo verde `#4dc247` de 56px con logo SVG de WhatsApp en blanco, escala 0.8, sin texto. Abre `https://wa.me/34{movil}?text=Hola 😊` en pestaña nueva.
6. [Si el usuario visto es admin] Etiqueta absoluta `top-2 right-2` `text-primary text-xs`: "ADMIN".
7. Panel Equipos: título h4 `font-cool text-neutral-300 tracking-widest underline underline-offset-2 mb-4`: "Equipos".
8. Lista horizontal de `TarjetaEquipo` (una por equipo del usuario visto; ver componente) con `gap-2`.
9. Vacío equipos: bloque `text-neutral-500 p-4 text-center` con párrafo "No tiene equipos".
10. Panel Competiciones: título h4 mismo estilo: "Competiciones".
11. Carrusel horizontal (`gap-4 snap-x`, cada ítem `w-[87%] max-w-96 shrink-0 snap-center`) de `TarjetaLiga` (componente descrito en otra parte del brief) con las ligas donde algún equipo del usuario visto está inscrito.
12. Vacío competiciones: bloque `text-neutral-500 p-4 text-center`: párrafo "No estas inscrito a ninguna competición" [sic, sin tilde en "estas"; además habla en 2ª persona aunque es un perfil ajeno] + enlace `text-primary underline` "Ver competiciones".

**Estados:** loading: no hay texto de carga; los campos aparecen vacíos hasta que llega la query (`useGetUserById`, `useGetEquiposUsuario`, `useLigas`). Vacío: "No tiene equipos" / "No estas inscrito a ninguna competición" + enlace. Error: no hay tratamiento (queda vacío). Condicionales: móvil, email y WhatsApp solo si el usuario logueado es admin; "ADMIN" solo si el usuario visto es admin. Sin toasts propios (los de `TarjetaEquipo`: "Invitación actualizada" / "Error al actualizar invitación", ver componente). Sin ConfirmDialog.

**Acciones y navegación:** TarjetaEquipo → `/equipos/{idEquipo}`. TarjetaLiga → `/competiciones/{idLiga}/clasificacion`. Enlace "Ver competiciones" → `/competiciones`. Botón WhatsApp → wa.me externo. Redirección automática a `/mi-perfil` si es el propio usuario.

**Assets:** solo el SVG inline del logo de WhatsApp (path en `src/features/LandingPage/ButtonWhatsapp.tsx`), blanco sobre círculo `#4dc247`. Sin imágenes.

---

### Mi perfil — `/mi-perfil`
**Acceso:** autenticado (botón "+" de competiciones solo admin). **Propósito:** ver mis datos, mis equipos (con invitaciones pendientes) y mis competiciones, y acceder a editar perfil, crear equipo o cerrar sesión.

**Layout:** `<title>` del documento: "Mi perfil | Recreativos Air". Contenedor `max-w-screen-lg mx-auto w-full`, `p-3`, columna `gap-4`. Bloque 1: cabecera del usuario `bg-neutral-900 rounded-xl p-3 md:p-6`, `flex justify-between`, relativa; a la izquierda datos, a la derecha columna de dos botones alineados al fondo (`items-end mt-auto`); badge "ADMIN" absoluto sobresaliendo por la esquina superior izquierda (`-top-2 -left-2`). Bloque 2: dos paneles en columna en mobile y en fila `md:flex-row md:gap-3`, cada uno `md:w-1/2 md:grow`, `p-3 rounded-xl`, y en `md:` `p-8` y fondo `bg-neutral-900/60`; `min-w-0` para permitir carruseles. Cada panel tiene cabecera icono + título + botón "+" a la derecha (`ml-auto`). Sin sticky. Si no hay sesión, redirige a `/login`.

**Elementos y copys (en orden visual):**
1. Título h2 `font-cool`: "{username}".
2. Párrafo `text-neutral-500`: "{nombre}".
3. Párrafo `text-neutral-500`: "{email}".
4. Párrafo `text-neutral-500`: "{movil}".
5. Botón nativo (no componente Button) `rounded-lg text-primary bg-neutral-950 border border-primary px-3 py-1`, icono `faPen` a la izquierda: "Editar".
6. Botón nativo `rounded-lg text-red-600 bg-neutral-950 border border-red-600 px-3 py-1`: "Salir".
7. [Si soy admin] Badge `bg-primary text-black text-xs font-bold rounded-md p-0.5 px-2`, absoluto `-top-2 -left-2`: "ADMIN".
8. Panel Equipos — cabecera: icono `faUsers` (`text-neutral-300`, size lg) + título h4 `font-cool text-neutral-300 tracking-widest`: "Equipos" + Button `outline-neutral` solo icono `faPlus` (circular) alineado a la derecha.
9. Componente `MisEquipos` (lista horizontal `snap-x`, cada tarjeta ocupa `w-11/12`, `gap-2`, `pb-2`): `TarjetaEquipo` por cada equipo del usuario que no tenga ningún jugador en estado RECHAZADO.
10. Panel Competiciones — cabecera: icono `faTrophy` (`text-neutral-300`, lg) + título h4 mismo estilo: "Competiciones" + [solo admin] Button `outline-neutral` solo icono `faPlus`.
11. Componente `MisCompeticiones`: carrusel horizontal (`gap-4 snap-x`, ítems `w-[87%] max-w-96 shrink-0 snap-center`) de `TarjetaLiga` con las ligas donde juego.

**Estados:**
- MisEquipos loading: párrafo `text-center p-8 text-neutral-500` "Cargando equipos...". Error: párrafo `text-red-500` "Ups... {error}" (si error vacío, "Ups... Algo pasó"). Vacío: caja `bg-neutral-800/80 rounded-lg text-neutral-300 p-4 text-center` con párrafo "No tienes equipos".
- MisCompeticiones loading: "Cargando ligas..." (`text-neutral-500 p-8 text-center`). Error: "Ups... {error}" / "Ups... Algo pasó" (`text-red-500`). Error de datos indefinidos: "Ups... error ligas=undefined" (`text-red-500`). Vacío: caja `bg-neutral-800/90 rounded-lg text-neutral-300 p-4 text-center` con párrafo "No inscrito a ninguna competición" + Button `outline` icono `faTrophy` "Ver competiciones".
- Toast éxito al pulsar "Salir": "Sesión cerrada".
- Condicionales: badge "ADMIN" y botón "+" de Competiciones solo admin. Invitaciones pendientes: se muestran dentro de `TarjetaEquipo` (ver componente: texto "Has sido invitado a este equipo" + botones "Aceptar"/"Rechazar").
- Sin ConfirmDialog.

**Acciones y navegación:** "Editar" → `/mi-perfil/editar`. "Salir" → logout + toast "Sesión cerrada" + `/login` (replace). "+" Equipos → `/crear-equipo`. "+" Competiciones (admin) → `/crear-liga`. TarjetaEquipo → `/equipos/{id}`. TarjetaLiga → `/competiciones/{idLiga}/clasificacion`. "Ver competiciones" → `/competiciones`.

**Assets:** ninguno (iconos FontAwesome: faPen, faUsers, faTrophy, faPlus).

---

### Editar perfil — `/mi-perfil/editar`
**Acceso:** autenticado. **Propósito:** editar nombre de usuario, nombre y móvil del propio usuario.

**Layout:** `<title>`: "Editar perfil | Recreativos Air". Contenedor `max-w-screen-sm mx-auto w-full p-4`. Título h1 con `mb-4` y debajo un formulario vertical `space-y-4` con cuatro `FormField` (label encima del input) y el botón de guardar a ancho completo al final. Igual en mobile y desktop. Sin sticky.

**Elementos y copys (en orden visual):**
1. Título h1 (4xl, extrabold, primary): "Editar perfil".
2. Campo: label "Nombre de usuario" + TextInput texto, placeholder "Nombre de usuario", valor inicial {username}.
3. Campo: label "Nombre" + TextInput texto, placeholder "Tu nombre", valor inicial {nombre} (o vacío).
4. Campo: label "Móvil" + TextInput `type="tel"`, placeholder "Número de móvil", valor inicial {movil}.
5. Campo: label "Email" + TextInput deshabilitado (fondo neutral-600, texto neutral-500) con valor {email}, sin placeholder, no editable.
6. Button `primary` icono `faSave`: "Guardar cambios"; mientras guarda: "Guardando..." (y disabled).

**Estados:** loading (sin usuario cargado): párrafo `text-neutral-400 text-center p-10 animate-pulse` "Cargando perfil...". Validaciones (toast.error, en este orden, al pulsar Guardar o enviar el form con Enter): "El nombre de usuario debe tener al menos 3 caracteres" (username recortado < 3); "El nombre debe tener al menos 2 caracteres" (nombre recortado < 2); "Introduce un número de móvil" (móvil vacío). El username se envía en minúsculas y recortado. Disabled/isPending: botón deshabilitado y texto "Guardando...". Toasts del hook `useUpdateMe`: éxito "Perfil actualizado"; error "{error.message}" o, si no hay mensaje, "Error al actualizar el perfil". Tras éxito navega a `/mi-perfil`. Sin ConfirmDialog. Sin condicionales por rol.

**Acciones y navegación:** "Guardar cambios" → PUT `/users/me` → toast → `/mi-perfil`. No hay botón cancelar/volver (se usa la navegación global).

**Assets:** ninguno.

---

### Crear equipo — `/crear-equipo`
**Acceso:** autenticado (modo "Equipo de bots" solo admin). **Propósito:** crear un equipo de 2 a 3 jugadores (registrados o sin cuenta), con nombre y color.

**Layout:** contenedor `max-w-screen-md mx-auto p-4 pt-1`. Título h2 centrado (`text-center font-extrabold mb-2`). [Admin] fila de dos cajas radio (`flex-row gap-3 mb-4`). Después columna `gap-2` con: campo Nombre en fila (label + input, borde inferior), campo Color en fila (label + input color 40px, borde inferior), bloque "Agregar jugadores" (label, fila de radios, y debajo el selector o el input manual + botón "+"), bloque "Jugadores (n/3)" con lista horizontal de chips de jugador (`overflow-x-auto gap-2`), y botón primario final a ancho completo. Igual en mobile y desktop. Sin sticky.

**Elementos y copys (en orden visual):**
1. Título h2 (primary, extrabold, centrado): "Crear equipo".
2. [Solo admin] Radio en caja `bg-neutral-800 p-2 rounded-md`, `accent-primary`, texto `text-neutral-400`: "Equipo de bots".
3. [Solo admin] Radio en caja igual: "Equipo para mi" [sic, sin tilde en "mi"] (seleccionado por defecto).
4. FormField fila con borde: label "Nombre: " + TextInput placeholder "Ej: Los Titanes".
5. FormField fila con borde: label "Color (opcional): " + `<input type="color">` de 40×40px (`size-10 rounded-lg border-0`), valor por defecto `#333333`.
6. FormField con borde: label "Agregar jugadores".
7. Fila de radios (`text-xs text-neutral-400`, cajas `bg-neutral-800 p-2 rounded-md`, `accent-primary`): "Usuario registrado" (oculto en modo bots) y "Usuario no registrado". Por defecto "Usuario registrado" (en modo bots se fuerza "Usuario no registrado").
8. Si "Usuario registrado": overlay/select `SelectorUsuario` con placeholder "Buscar usuario..." (ver Overlays).
9. Si "Usuario no registrado": fila con TextInput placeholder "Nombre del jugador sin cuenta" + Button `outline-neutral` solo icono `faPlus` en un contenedor de 48px (`w-12`).
10. FormField: label "Jugadores ({n}/3)" donde {n} = número actual de jugadores.
11. Lista vacía: párrafo `text-neutral-500 text-xs p-4 text-center` "Agrega jugadores".
12. Chip de jugador (`bg-neutral-800/50 rounded-md px-2 py-2 text-sm w-fit`): nombre `text-neutral-200 font-medium truncate max-w-20` "{nombre}" + [si suplente] span `text-primary text-xs font-semibold` "(Suplente)"; debajo `text-xs text-neutral-500` "Registrado" (si tiene idUsuario) o "Sin cuenta"; [si soy yo] etiqueta `bg-primary text-black text-sm rounded p-1 px-2` "Tú"; [si no soy yo] Button `outline` solo icono `faTrash`.
13. Button `primary` icono `faPlus`: "Crear equipo"; en pending: "Creando equipo...".

**Estados:**
- Inicial: si NO soy admin, la lista arranca conmigo como primer jugador (nombre = mi nombre, o username, o "Sin nombre"), estado ACEPTADO, no suplente, no eliminable. Si soy admin: en modo "Equipo para mi" igual (conmigo dentro); en modo "Equipo de bots" lista vacía y modo de agregado forzado a "Usuario no registrado" (el radio "Usuario registrado" desaparece).
- Regla suplente: con 3 jugadores, el último añadido se marca "(Suplente)" automáticamente; con ≤2 nadie es suplente.
- Alerts nativos (`window.alert`, no toast): "Máximo 3 jugadores por equipo" (al intentar añadir un 4º); "Ese usuario ya está en el equipo" (usuario registrado repetido); "Introduce un nombre válido" (nombre manual vacío); "Ese nombre ya está en el equipo" (nombre manual repetido, comparación sin mayúsculas).
- `toast.custom` (texto crudo sin estilo): "No puedes eliminarte del equipo" (usuario no admin intenta borrarse; en la práctica el botón de borrar no se muestra en el propio chip).
- Validaciones al crear (toast.error): "El nombre del equipo es obligatorio" (nombre vacío); "Debe haber al menos 2 jugadores por equipo" (menos de 2).
- Toasts del hook `useCrearEquipo`: éxito `Equipo "{nombre}" creado correctamente`; error "Error al crear el equipo".
- isPending: deshabilita SelectorUsuario, botón "+" manual, botones de borrar y botón crear (texto "Creando equipo...").
- Jugadores registrados añadidos se crean con estado PENDIENTE (recibirán invitación en su TarjetaEquipo); los manuales, ACEPTADO.
- Sin ConfirmDialog.

**Acciones y navegación:** "Crear equipo" → POST `/equipos` → toast → `navigate(-1)` (vuelve atrás) e invalida la lista de equipos del usuario. Botón papelera → elimina jugador del chip. "+" manual → añade jugador sin cuenta. Seleccionar en SelectorUsuario → añade jugador registrado.

**Assets:** ninguno (input color nativo).

---

### Detalle equipo — `/equipos/:id`
**Acceso:** autenticado. **Propósito:** ver el nombre del equipo y la lista de sus jugadores, con enlace al perfil de los registrados.

**Layout:** contenedor `max-w-screen-sm mx-auto p-4 h-full`. Título arriba y debajo lista vertical (`flex-col gap-3`) de filas a ancho completo. Igual en mobile y desktop.

**Elementos y copys (en orden visual):**
1. Título h1 nativo `font-cool text-3xl font-bold text-primary mb-4`: "{nombre del equipo}".
2. Fila por jugador registrado: enlace `bg-neutral-800 rounded-md p-2 px-4 text-neutral-400 w-full flex items-center gap-2` con icono `faUser` + "{nombre}" + [si soy yo] `text-xs text-primary` "(Tú)".
3. Fila por jugador sin cuenta (idUsuario null): caja no clicable mismo estilo `justify-between` con "{nombre}" a la izquierda y `text-xs text-red-400` "(No registrado)" a la derecha.

**Estados:** loading: párrafo `text-center p-10 text-neutral-500` "Cargando equipo...". Error o equipo inexistente: párrafo `text-red-500 text-center p-10` "Ups... {error}". No hay estado vacío específico (un equipo siempre tiene jugadores). Sin toasts, sin diálogos, sin condicionales por rol (solo "(Tú)" si el jugador soy yo). No se muestra el color del equipo ni estados de invitación.

**Acciones y navegación:** fila de jugador registrado → `/user/{idUsuario}` (si es el propio usuario, el perfil público redirige a `/mi-perfil`). Fila de no registrado: sin acción.

**Assets:** ninguno.

---

### Detalle jornada — `/jornadas/:id`
**Acceso:** autenticado; acciones según rol (jugador del enfrentamiento / admin). **Propósito:** ver un enfrentamiento (fecha, lugar, estado, marcador por partidos) y gestionar su resultado: proponer, aceptar/rechazar (rival) y confirmar/rechazar (admin).

**Layout:** contenedor `max-w-screen-sm mx-auto w-full p-4`, columna `gap-3`. Orden: (1) cabecera con los dos nombres de equipo, (2) fecha, (3) ubicación, (4) caja de estado, (5) tabla de resultado + avisos de propuesto/aceptado/rechazado, (6) botones de jugador, (7) botones de admin. Cabecera: bloque relativo `flex-col gap-8 items-center`, `text-xl font-black font-cool text-primary`, `overflow-x-hidden`; nombre del equipo A en mayúsculas alineado a la izquierda (`mr-auto text-left truncate w-full`), nombre del equipo B en mayúsculas alineado a la derecha (`ml-auto text-right truncate w-full`), y entre ambos, centrado en absoluto (`top-1/2 -translate-y-1/2`), un "vs" grande `text-4xl text-neutral-700 font-cool`. Botones a ancho completo apilados en columna (`flex-col gap-2 mt-3`). Igual en mobile y desktop. Sin sticky.

**Elementos y copys (en orden visual):**
1. Cabecera: "{EQUIPO A}" (uppercase), "vs" (decorativo), "{EQUIPO B}" (uppercase).
2. `FechaYLugarEnfrentamiento` — fila fecha: icono `faCalendarDays` + "{fecha}" en formato `toLocaleDateString()` si existe (texto `text-neutral-300`) o "Fecha no especificada" (`text-neutral-600`).
3. Fila ubicación: icono `faLocationDot` + "{ubicacion}" (`text-neutral-300`) o "Ubicación no especificada" (`text-neutral-600`).
4. `InfoEstadoEnfrentamiento` — caja `w-full rounded-lg p-2 px-4 flex items-center gap-3` con icono a la izquierda y dos líneas (título `font-extrabold`, descripción `text-xs`), color según estado:
   - SinJugar: fondo `bg-red-500/10`, texto `text-red-400`, icono `faInfoCircle`; título "Sin jugar"; descripción "Este partido no ha sido jugado aún."
   - CorroborarResultado: fondo `bg-orange-500/10`, texto `text-orange-400`, icono `faHand`; título "Pendiente de confirmación"; descripción: si el resultado lo propuso mi equipo → "El resultado debe ser confirmado por la otra pareja."; en cualquier otro caso (rival, admin o espectador) → "Debes aceptar o rechazar el resultado".
   - ConfirmarResultado: fondo `bg-yellow-500/10`, texto `text-yellow-400`, icono `faHand`; título "Pendiente de finalización"; descripción "El administrador debe confirmar finalmente el resultado."
   - Jugado: fondo `bg-green-500/10`, texto `text-green-400`, icono `faCheckCircle`; título "Jugado"; descripción "El partido ha finalizado."
5. `ResultadoEnfrentamiento` — tabla: contenedor `border border-neutral-800 rounded-2xl bg-neutral-950/60 p-2 flex justify-between`. Columna izquierda (`max-w-32 w-full border-r border-neutral-700`): "{equipo A}" (fila superior, `font-semibold truncate`, borde inferior) y "{equipo B}" (fila inferior). A la derecha, una columna por partido (`text-neutral-400`, scroll horizontal), con "{golesA}" arriba (borde inferior) y "{golesB}" abajo; si el valor es null/undefined muestra "-".
6. [Si estado ≠ Jugado y hay `resultadoPropuestoPor`] aviso `bg-neutral-900 p-3 rounded-lg text-sm` icono `faInfoCircle` `text-neutral-400`: "Resultado propuesto por {equipo}".
7. [Si estado ≠ Jugado y hay `resultadoAceptadoPor`] aviso `bg-green-900/50` icono `faCheckCircle` `text-green-200`: "Resultado aceptado por {equipo}".
8. [Si estado ≠ Jugado y hay `resultadoRechazadoPor`] aviso `bg-red-900/50` icono `faXmarkCircle` `text-red-200`: "Resultado rechazado por {equipo}".
9. `BotonesUser` (solo si participo en el enfrentamiento):
   - [Estado CorroborarResultado y (mi equipo NO propuso el resultado, o soy admin)] columna: Button `outline` icono `faXmark` "Rechazar" + Button `primary` icono `faCheck` "Aceptar resultado".
   - [Estado SinJugar] `BotonIntroducirResultado`: Button `primary` "Introducir resultado".
10. `BotonesAdmin` (solo admin y estado ConfirmarResultado): columna: Button `outline` icono `faXmark` "Rechazar y reiniciar" + Button `primary` icono `faCheck` "Confirmar resultado".

**Flujo "Introducir resultado" (ventana modal `Window`, título "Proponer resultado"):**
- Se abre como `<dialog>` nativo (`showModal`), caja `bg-neutral-900 border border-neutral-700 rounded-2xl p-3 pt-6`, ancho `w-11/12 md:w-1/2 xl:w-1/4`, `mt-20`, fondo `backdrop:bg-neutral-950/90` con blur; botón "X" (`faXmark`) arriba a la derecha; título `text-primary font-bold text-xl truncate mb-5`.
- Contenido: fila con scroll horizontal. Columna izquierda de 160px con dos etiquetas `bg-neutral-800 text-white text-sm rounded-xl px-3 truncate max-w-32`: "{equipo A}" arriba, "{equipo B}" abajo. A la derecha, una columna de 40px por cada partido del enfrentamiento con dos `<input type="number">` (goles A arriba, goles B abajo), estilo `bg-neutral-700 text-neutral-100 text-center rounded-lg p-2`, borde transparente que pasa a primary en foco, `max` = golesParaGanar de la liga, sin placeholder ni label, autofocus en el primero. Las flechas del input number están ocultas por CSS global.
- Pie: Button `outline` "Cancelar" + Button `primary` "Guardar" (disabled en pending).
- Validación al guardar (toast.error, {goles} = `liga.configuracion.golesParaGanar`, por defecto 10): "En todos los partidos, uno de los equipos debe llegar a {goles} goles" (algún partido donde ninguno alcanza la cifra); "Ningún equipo puede superar los {goles} goles por partido" (algún valor por encima).
- Éxito: toast "Resultado propuesto", se cierra la ventana y se refresca el enfrentamiento. Error del hook: toast "Ups...{error}".
- El botón "Introducir resultado" queda disabled mientras isPending.

**Estados:**
- Loading de página: párrafo `text-center p-10 text-neutral-500` "Cargando liga..." [sic, dice "liga" aunque carga un enfrentamiento].
- Enfrentamiento no encontrado: párrafo `text-red-500 text-center p-10` "Ups...Esta liga ya no existe" [sic, sin espacio tras los puntos y habla de "liga"].
- Matriz estado × usuario (lo que ve cada uno además de la cabecera, fecha/lugar y tabla):
  - **SinJugar**: tabla con "-" en las casillas vacías (o los goles guardados si los hubiera). Caja roja "Sin jugar / Este partido no ha sido jugado aún.". Jugador local o visitante: botón "Introducir resultado". Admin que no juega: nada más. Espectador: nada más.
  - **CorroborarResultado** (un equipo ya propuso): caja naranja "Pendiente de confirmación". Aviso "Resultado propuesto por {equipo}". Jugador del equipo que propuso: descripción "El resultado debe ser confirmado por la otra pareja.", sin botones. Jugador del equipo rival: descripción "Debes aceptar o rechazar el resultado" + botones "Rechazar" / "Aceptar resultado". Admin que además juega en el equipo proponente: ve también los botones (excepción por admin). Admin sin participar y espectador: descripción "Debes aceptar o rechazar el resultado" (el texto no distingue), sin botones.
  - **ConfirmarResultado** (rival aceptó, falta admin): caja amarilla "Pendiente de finalización / El administrador debe confirmar finalmente el resultado.". Avisos "Resultado propuesto por {equipo}" y "Resultado aceptado por {equipo}" (si existen esos campos). Admin: botones "Rechazar y reiniciar" / "Confirmar resultado". Jugadores y espectador: sin botones.
  - **Jugado**: caja verde "Jugado / El partido ha finalizado.". Tabla con los goles finales. Se ocultan los avisos de propuesto/aceptado/rechazado. Nadie ve botones.
  - Si existe `resultadoRechazadoPor` (tras un rechazo, el estado vuelve a SinJugar), se muestra el aviso rojo "Resultado rechazado por {equipo}" junto al botón "Introducir resultado".
- Toasts de acciones (éxito): "Resultado aceptado" (Aceptar resultado), "Resultado rechazado" (Rechazar, jugador), "Resultado confirmado" (Confirmar resultado, admin) y también "Resultado confirmado" [sic, mensaje reutilizado] al pulsar "Rechazar y reiniciar" desde esta página. Errores: los hooks de aceptar/rechazar/confirmar no tienen toast de error; solo proponer muestra "Ups...{error}".
- Disabled/isPending: cada botón se deshabilita mientras su mutación está en curso.
- Sin ConfirmDialog en esta pantalla (las acciones son inmediatas).

**Acciones y navegación:** "Introducir resultado" → abre ventana "Proponer resultado". "Guardar" → POST proponer → toast → cierra. "Cancelar"/"X"/Esc → cierra la ventana. "Aceptar resultado" → POST aceptar → toast. "Rechazar" → POST rechazar → toast. "Confirmar resultado" → POST confirmar-admin → toast. "Rechazar y reiniciar" → POST rechazar-admin → toast. No hay enlaces a los equipos ni a la liga desde esta pantalla.

**Assets:** ninguno (iconos FontAwesome: faCalendarDays, faLocationDot, faInfoCircle, faHand, faCheckCircle, faXmarkCircle, faCheck, faXmark).

---

---

## 6. Detalle de liga


Enumerados usados (paquete `recreativos-air-core`):
- `EstadoLiga`: `SinEmpezar` (texto visible "Aún no ha comenzado"), `EnCurso` ("En curso"), `Finalizada` ("Finalizada").
- `EstadoEquipoEnLiga`: `Pendiente`, `Aprobado`, `Rechazado` (sin etiqueta propia; en la UI admin `Pendiente` se muestra como "No aceptado").
- `TipoFutbolin`: `Infinity` ("Infinity"), `Tsunami` ("Tsunami").
- `EstadoEnfrentamientoConOpcionCualquiera`: `Cualquiera` ("Cualquiera"), `ConfirmarResultado` ("Esperar admin"), `CorroborarResultado` ("Esperar rival"), `Jugado` ("Jugado"), `SinJugar` ("No jugado").
- `SIN_TEMPORADA` = valor interno `"none"`, texto visible "Sin temporada".

---

### 6.1 Shell del detalle de liga

#### DetalleLigaLayout — `/competiciones/:id` (padre de `/clasificacion`, `/jornadas`, `/equipos`, `/info`, `/ajustes`)

**Acceso:** usuario autenticado (ruta bajo `RequireAuth`). **Propósito:** cabecera común de una liga con su estado, la acción de inscripción y la navegación por pestañas hacia las sub-pantallas.

**Layout:** contenedor `max-w-screen-sm` centrado, padding 16px (superior 8px), altura completa, posición relativa. Orden vertical: (1) cabecera sticky en `top: 0` con fondo `neutral-950`, z-index 2, animación de entrada "fade-in-top", fila horizontal con gap 8px alineada al centro; (2) bloque condicional de inscripción/espera; (3) `NavDetalleLiga` (picker de pestañas + etiqueta sticky); (4) contenido de la sub-pantalla (`Outlet`). Mismo layout en mobile y desktop (no hay breakpoints propios).

**Elementos y copys (en orden visual):**
1. Imagen: logo del tipo de futbolín, `logoFutbolinMap[liga.tipoFutbolin]` (36×36 px, `size-9`), alt = `{liga.nombre}`.
2. Título h1: `{liga.nombre}` en Zen Dots, 24px (`text-2xl`), negrita, color `primary`.
3. Chip `ChipEstadoLiga` de `{liga.estadoLiga}` empujado a la derecha (`ml-auto`). Ver C4.
4. Condicional A — si el usuario ya está inscrito (algún equipo de la liga contiene a un jugador con su `idUsuario`) **y** el estado de su equipo es `EstadoEquipoEnLiga.Pendiente`: párrafo-chip "Esperando confirmación..." (padding 4px, fondo `neutral-500/20`, ancho ajustado al contenido, esquinas redondeadas, 14px, color `primary`, margen vertical 8px).
5. Condicional B — si el usuario **no** está inscrito **y** `liga.estadoLiga === SinEmpezar`: fila centrada (margen vertical 16px) con Botón variante `primary` "Inscribirme" (sin icono).
6. `NavDetalleLiga` (ver abajo).
7. Contenido de la pestaña activa.

**Estados:**
- Loading (carga de la liga): párrafo centrado, color `neutral-400`, padding 40px, animación pulse: "Cargando liga...".
- Error o liga inexistente: bloque centrado, padding 40px, color `neutral-400`, con Título h2 color `primary` "Liga no encontrada" y párrafo "No se ha podido cargar la información de esta liga.".
- Botón "Inscribirme" `disabled` mientras la mutación de inscripción está `isPending`.
- Toast error "Error al cargar liga" si se pulsa "Inscribirme" sin liga cargada (caso defensivo).
- Toasts de la mutación (ver "Copys transversales"): éxito "Equipo inscrito correctamente" / error "No se pudo inscribir el equipo".

**Acciones y navegación:**
- "Inscribirme" → abre una ventana modal (`Window`, título por defecto "Ventana" porque aquí no se pasa título) con el componente `SelectorEquipoUsuario`: etiqueta "Selecciona tu equipo para inscribirte", select buscable de equipos del usuario (placeholder "Buscar equipo"), botones "Cancelar" (outline) e "Inscribirme" (primary, disabled si no hay equipo elegido). Si el usuario no tiene equipos: "Ups... no tienes ningún equipo" + botón "Crear equipo" → `/crear-equipo`. Loading "Cargando equipos..."; error "Error al cargar equipos". Al elegir, se lanza la inscripción y se cierra la ventana.
- La ventana modal (`Window`) es un `<dialog>` con margen superior 80px, ancho 11/12 (md: 1/2, xl: 1/4), fondo `neutral-900`, borde `neutral-700`, esquinas 16px, backdrop `neutral-950/90` con blur, botón de cierre con icono FontAwesome `faXmark` arriba a la derecha y título en `primary` negrita 20px.

**Assets:** `src/shared/assets/logos/infinity.png` y `src/shared/assets/logos/tsunami.png` (36px, sin tratamiento). Existen también variantes `infinitylight.png` / `tsunamilight.png` no usadas en este ámbito.

**Componente auxiliar exportado en este fichero — `BotonRefrescar`:** Botón variante `outline-neutral` con icono FontAwesome `faSync` y texto "Actualizar"; invalida todas las queries con un debounce de 2 s. (Se usa fuera de este ámbito.)

#### NavDetalleLiga (dentro del layout)

**Layout:** `nav` con margen superior 8px y animación fade-in-top (retardo 0,2 s) que contiene un `InlinePicker` tamaño `md`: contenedor `rounded-xl` fondo `neutral-900` padding 4px; fila de pestañas de igual ancho; un indicador deslizante (fondo `neutral-500/20`, `rounded-lg`, transición 300 ms) se desplaza bajo la pestaña activa. Debajo, un párrafo sticky en `top: 38px` (`top-9.5`), fondo `neutral-950`, z-index 2, Zen Dots 20px, peso black, animación fade-in-top (retardo 0,4 s) con el nombre de la pestaña activa.

**Elementos y copys:**
1. Pestaña 1 — solo icono `faListOl` (label vacío; el atributo `title` también queda vacío) → etiqueta sticky "Clasificación".
2. Pestaña 2 — icono `faCalendarDays` → "Jornadas".
3. Pestaña 3 — icono `faPeopleGroup` → "Equipos".
4. Pestaña 4 — icono `faInfoCircle` → "Información".
5. Pestaña 5 — icono `faGear` → "Ajustes". **Solo se renderiza si `user.admin`.**
- Pestaña activa: icono color `primary`; inactivas: `neutral-400`. Cada ítem es 18px (`text-lg`), padding horizontal 8px.

**Estados:** la pestaña inicial se deduce de la URL (segmentos `clasificacion`/`jornadas`/`equipos`/`info`/`ajustes`; por defecto 1).

**Acciones y navegación:** clic en pestaña → navega (replace) a la ruta hija relativa `clasificacion` / `jornadas` / `equipos` / `info` / `ajustes`.

---

### 6.2 Sub-pantallas (tabs)

#### Clasificación — `/competiciones/:id/clasificacion`

**Acceso:** autenticado. **Propósito:** tabla de posiciones de la liga.

**Layout:** bloque con animación fade-in-top; opcionalmente una fila centrada (margen vertical 12px) con el chip de posición del usuario; debajo la tabla a ancho completo.

**Elementos y copys (en orden visual):**
1. Condicional — si `liga.estadoLiga === Finalizada` y el usuario tiene equipo en la liga: `PosicionUsuarioChip` en modo `finalizada` (ver C4; textos "¡Campeones! Has quedado 1º" / "Has quedado {pos}º").
2. Tabla (`Tabla`, borde `neutral-800`, esquinas 8px, texto `neutral-400` 14px, celdas centradas con borde inferior y derecho, cabeceras negrita 14px). Columnas en orden, con cabecera literal:
   - "#" → `{pos}` (ordenable).
   - "Equipo" → `{nombre}` (no ordenable; celda alineada a la izquierda, ancho máximo ~108px con truncado).
   - "PTS" → `{pts}` (ordenable).
   - "J" → `{jj}` partidos jugados (ordenable).
   - "PP" → `{pp}` partidos perdidos (ordenable).
   - "DIF" → `{gf - gc}` diferencia de goles (ordenable).
3. Orden inicial: el que devuelve la API (por posición). Al pulsar una cabecera ordenable, se ordena asc y muestra "▲"; segundo clic desc "▼".
4. Resaltado por podio (aplica a las celdas "#" y "Equipo"): posición 1 en `amber-300`, posición 2 en `orange-400`, posición 3 en `neutral-300`, resto sin color propio. **No hay resaltado específico de la fila del equipo del usuario** (solo el chip superior en ligas finalizadas).

**Estados:**
- Loading: "Cargando clasificación..." (centrado, `neutral-500`, padding 40px).
- Vacío: "No hay equipos para la clasificación" (centrado, padding 40px).
- Gate: si `liga.estadoLiga === SinEmpezar` y el usuario **no** es admin: "La liga no ha comenzado" (centrado, `neutral-500`, padding 40px). Nota: este gate se evalúa después del vacío, así que con cero equipos prima "No hay equipos para la clasificación".

**Acciones y navegación:** solo ordenación de columnas; sin navegación.

**Assets:** ninguno.

#### Jornadas — `/competiciones/:id/jornadas`

**Acceso:** autenticado. **Propósito:** listar los enfrentamientos de la liga con filtros por equipos propios y estado.

**Layout:** columna vertical con gap 12px y padding inferior 80px. Arriba `FiltrosJornadas` (dos columnas de igual ancho, gap 8px, separadas `justify-between`); debajo la lista de `TarjetaEnfrentamiento` (una por enfrentamiento, sin agrupación por jornada: es una lista plana filtrada).

**Elementos y copys (en orden visual):**
1. `FiltrosJornadas`, columna izquierda: texto auxiliar "Equipos:" (12px, `neutral-500`) y un checkbox nativo de 20px con etiqueta "Mostrar todos" (desmarcado por defecto → solo se muestran enfrentamientos donde participa algún equipo del usuario).
2. `FiltrosJornadas`, columna derecha: texto auxiliar "Estado:" (12px, `neutral-500`) y `SelectorEstadoEnfrentamiento` (select `react-select` no buscable, placeholder "Cualquiera") con opciones literales, en este orden: "Cualquiera" (por defecto), "Esperar admin", "Esperar rival", "Jugado", "No jugado".
3. Lista de tarjetas `TarjetaEnfrentamiento` (componente documentado en otra parte del brief) para cada enfrentamiento que cumpla: (mostrar todos **o** pertenece a un equipo del usuario) **y** (estado = "Cualquiera" **o** coincide con el filtro). Recibe `cfgLiga = {liga.configuracion}`.

**Estados:**
- Gate: si `liga.estadoLiga === SinEmpezar` y el usuario **no** es admin: "La liga no ha comenzado" (centrado, `neutral-500`, padding 40px) — sustituye a toda la pantalla, incluidos filtros.
- Vacío tras filtrar: "Sin resultados" (centrado, blanco, padding 40px).
- No hay literal propio de loading (la lista simplemente sale vacía → "Sin resultados" mientras carga).
- Toast error del hook de enfrentamientos (`enfrentamientos/hooks.ts`): "Ups..." + `{error}`.

**Acciones y navegación:** clic en una `TarjetaEnfrentamiento` → `/jornadas/{enfrentamiento.id}`.

**Assets:** ninguno propio.

#### Equipos — `/competiciones/:id/equipos`

**Acceso:** autenticado. **Propósito:** ver los equipos inscritos; para admin, gestionar inscripciones, pagos y bajas.

**Layout:** (admin) bloque superior con margen inferior 12px y botón; debajo lista vertical (`ul`) con gap 8px de tarjetas a ancho completo.

**Elementos y copys (en orden visual):**
1. **Solo admin:** Botón variante `outline-neutral` "Inscribir equipo existente" (sin icono).
2. Lista: para **usuario no admin** se muestran solo equipos con `estado === Aprobado` como `TarjetaEquipoLiga`; para **admin** se muestran todos (pendientes incluidos) como `TarjetaEquipoLigaAdmin`. Ver C4 para ambas tarjetas.

**Estados:**
- Sin liga cargada: párrafo "Ups algo pasó" (sin estilos).
- Vacío: "Ups... no hay equipos aún" (centrado, `neutral-400`, padding 16px).
- Toast error "Error al cargar liga" si se pulsa el botón sin liga.

**Acciones y navegación:**
- "Inscribir equipo existente" → abre `Window` con título "Elige un equipo" y el formulario `InscribirEquipoExistenteForm`.
- `TarjetaEquipoLiga` (usuario): clic en toda la tarjeta → `/equipos/{equipo.id}`.
- `TarjetaEquipoLigaAdmin` (admin): cabecera despliega/pliega; botón "Ver equipo" → `/equipos/{equipo.id}`; resto de acciones en C4.

**Formulario `InscribirEquipoExistenteForm`** (dentro de la ventana "Elige un equipo"):
- Layout: caja de 320px de alto (`h-80`), columna con contenido arriba y botones abajo.
- Elementos: (1) `SelectorEquipo` con todos los equipos de la app, buscable, placeholder "Buscar equipo", primera opción "Cualquiera" (valor `-1`, se trata como "sin selección"), seguida de `{equipo.nombre}` por cada equipo; (2) fila de botones con gap 8px: "Agregar" (primary, `disabled` hasta elegir un equipo) y "Cancelar" (outline).
- Guard: si el usuario no es admin, el contenido es el párrafo "No eres admin " [sic, con espacio final].
- Validaciones (toast error): "No se encontró la liga"; "No se encontró el equipo"; "El equipo ya está en la liga".
- Acciones: "Agregar" → inscribe el equipo (toasts "Equipo inscrito correctamente" / "No se pudo inscribir el equipo") y cierra la ventana; "Cancelar" → cierra.

**Assets:** ninguno.

#### Información — `/competiciones/:id/info`

**Acceso:** autenticado. **Propósito:** mostrar descripción, normas, ubicaciones y premio de la liga.

**Layout:** bloque simple de párrafos apilados; los títulos de sección llevan margen superior 16px, Zen Dots 20px, padding vertical 4px.

**Elementos y copys (en orden visual):**
1. Párrafo `neutral-400`: `{liga.descripcion}`; si está vacía: "Sin información disponible".
2. Condicional (si hay `normas`): título "Normas" + párrafo `neutral-400` con `{liga.normas}` respetando saltos de línea (`whitespace-pre-wrap`).
3. Condicional (si hay ubicaciones): título "Ubicaciones" + un párrafo `neutral-400` por cada `{ubicacion}`.
4. Condicional (si hay `premio`): título "Premio" + párrafo `neutral-400` con `{liga.premio}` (`whitespace-pre-wrap`).

**Estados:** sin loading propio (mientras carga se ve "Sin información disponible"). Sin acciones.

**Assets:** ninguno.

#### Ajustes — `/competiciones/:id/ajustes`

**Acceso:** **solo admin**; si no lo es, redirige (replace) a `/competiciones/{id}/clasificacion`. **Propósito:** cambiar el estado de la liga, editar sus datos y eliminarla.

**Layout:** columna con animación fade-in-top, separación vertical 24px entre secciones, padding inferior 24px. Tres bloques: sección "Estado", formulario "Datos de la liga" (gap 16px), sección "Zona de peligro" (borde `red-500/30`, esquinas 6px, padding 12px, gap 8px). Los botones ocupan el ancho completo (el `Button` es `w-full`, alto 40px, esquinas 16px).

**Elementos y copys (en orden visual):**
1. Título de sección (Zen Dots 18px, `primary`): "Estado".
2. Botón de estado según `liga.estadoLiga`:
   - `SinEmpezar`: Botón primary, icono `faPlay`, "Arrancar liga" (en curso: "Arrancando liga...").
   - `EnCurso`: Botón outline, icono `faFlagCheckered`, "Finalizar liga" (en curso: "Finalizando liga...").
   - `Finalizada`: Botón outline, icono `faPlay`, "Reanudar liga" (en curso: "Reanudando liga...").
3. Título de sección: "Datos de la liga".
4. Campo — label "Nombre"; input texto placeholder "Nombre de la liga"; valor inicial `{liga.nombre}`.
5. Campo — label "Descripción"; textarea placeholder "Breve descripción".
6. Campo — label "Temporada"; `SelectorTemporada` con opción "Sin temporada" incluida (ver C5). Valor inicial `{liga.temporada}` o "Sin temporada".
7. Campo — label "Tipo de futbolín"; `SelectorTipoFutbolin` (ver C5). **Deshabilitado si la liga no está `SinEmpezar`** (control en `neutral-700`, texto `neutral-500`).
8. Caja "Ubicaciones" (fondo `neutral-900`, borde `neutral-700`, esquinas 6px, padding 12px): label "Ubicaciones"; fila con input placeholder "Añadir ubicación..." y botón outline "+"; lista de ítems (fondo `neutral-800`, esquinas 6px, 14px, `neutral-300`) con `{ubicacion}` a la izquierda y botón de texto "Eliminar" (12px, `red-500`, hover `red-400`) a la derecha.
9. Campo — label "Normas"; textarea placeholder "Introduce normas de la liga (opcional)".
10. Campo — label "Premio"; textarea placeholder "Premios de la liga (opcional)".
11. Botón primary, icono `faSave`, "Guardar cambios" (en curso: "Guardando...").
12. Título "Zona de peligro" (Zen Dots 18px, `red-400`).
13. Párrafo 12px `neutral-500`: "Se eliminará la liga y todos sus enfrentamientos.".
14. Botón `outline-danger`, icono `faTrash`, "Eliminar liga" (en curso: "Eliminando...").

**Estados:**
- Loading: "Cargando ajustes..." (centrado, `neutral-400`, padding 40px, pulse).
- Validaciones (toast error): "Introduce un nombre válido" (nombre vacío al guardar); "Introduce una ubicación válida" (ubicación vacía al pulsar "+"); "Esa ubicación ya está añadida" (duplicada).
- `disabled`: botón de estado mientras `cambiandoEstado`; "Guardar cambios" mientras `guardando`; "Eliminar liga" mientras `eliminando`; selector de tipo de futbolín si la liga ya empezó (el tipo solo se envía si `SinEmpezar`).
- Toasts (hooks): "Liga actualizada" / "Error al actualizar la liga"; "Estado de la liga actualizado" / "Error al cambiar el estado de la liga"; "Liga eliminada" / "Error al eliminar la liga".
- ConfirmDialogs (todos con botón cancelar "Cancelar"; botón confirmar rojo `red-600`):
  - Arrancar: título "¿Arrancar la liga?", descripción "Se generarán los enfrentamientos y los usuarios podrán comenzar a introducir resultados", confirmar "Arrancar liga".
  - Finalizar: "¿Finalizar la liga?", "La clasificación quedará como definitiva y no se podrán introducir más resultados", confirmar "Finalizar liga".
  - Reanudar: "¿Reanudar la liga?", "La liga volverá a estar en curso", confirmar "Reanudar liga".
  - Eliminar: "¿Eliminar la liga?", `Se eliminará "{liga.nombre}" junto con todos sus enfrentamientos. Esta acción no se puede deshacer.`, confirmar "Eliminar liga".
- Layout del ConfirmDialog: overlay negro 60% con blur 2px; caja `neutral-900`, esquinas 12px, padding 24px, `max-w-sm`; título 18px semibold centrado `primary`; descripción 14px `neutral-400` centrada; dos botones de ancho completo alineados a la derecha: cancelar con borde `neutral-300` y texto `neutral-400`, confirmar fondo `red-600` texto blanco.

**Acciones y navegación:**
- "Arrancar liga" → confirm → estado `EnCurso`. "Finalizar liga" → confirm → `Finalizada`. "Reanudar liga" → confirm → `EnCurso`.
- "+" → añade ubicación y limpia el input. "Eliminar" (en ítem) → quita esa ubicación (solo local hasta guardar).
- "Guardar cambios" / submit del formulario → actualiza la liga (nombre, descripción, normas, premio, ubicaciones, temporada o `null` si "Sin temporada", y tipo de futbolín solo si `SinEmpezar`).
- "Eliminar liga" → confirm → elimina y navega a `/competiciones`.

**Assets:** ninguno.

---

---

## 7. Pantallas de administración

### Crear liga — `/crear-liga`

**Acceso:** **solo admin** (`RequireAdmin`; muestra `FullPageSpinner` mientras comprueba, y si no es admin redirige a `/`). **Propósito:** dar de alta una liga nueva.

**Layout:** contenedor `max-w-screen-sm` centrado, padding 16px, altura completa. Título h1 arriba (margen inferior 16px). Formulario en columna que ocupa 11/12 de la altura, con el área de campos desplazable verticalmente (padding horizontal 4px, gap 16px) y el botón de envío fijo al pie del formulario (padding inferior 8px).

**Elementos y copys (en orden visual):**
1. Título h1 (36px, extrabold, `primary`): "Crear liga".
2. Campo — label "Nombre"; input texto placeholder "Nombre de la liga".
3. Campo — label "Descripción"; textarea placeholder "Breve descripción".
4. Campo — label "Tipo de futbolín"; `SelectorTipoFutbolin` (valor inicial "Tsunami").
5. Campo — label "Temporada"; `SelectorTemporada` con "Sin temporada" incluida; valor inicial: la temporada marcada como actual si existe (se muestra "{nombre} (actual)"), si no "Sin temporada".
6. Caja "Configuración de la liga" (fondo `neutral-900`, borde `neutral-700`, esquinas 6px, padding 12px; filas `justify-between`, gap 8px):
   - Label "Configuración de la liga".
   - Fila: etiqueta 14px `neutral-400` "Partidos por enfrentamiento:" + input numérico (mín. 1, ancho 64px, fondo `neutral-800`, centrado) valor inicial 4.
   - Fila: "Goles para ganar:" + input numérico (mín. 1) valor inicial 10.
   - Fila: "Ida y vuelta:" + checkbox 20px (`accent-primary`) marcado por defecto.
7. Caja "Ubicaciones" (mismo estilo de caja): label "Ubicaciones"; fila input placeholder "Añadir ubicación..." + botón outline "+"; lista de ítems `{ubicacion}` con botón de texto "Eliminar" (12px, `red-500`).
8. Campo — label "Normas"; textarea placeholder "Introduce normas de la liga (opcional)".
9. Campo — label "Premio"; textarea placeholder "Premios de la liga (opcional)".
10. Botón primary, icono `faPlus`, "Crear liga" (en curso: "Creando...").

**Estados:**
- Validaciones (toast error): "Introduce un nombre válido"; "Introduce una ubicación válida"; "Esa ubicación ya está añadida".
- `disabled`: "Crear liga" mientras `isPending`.
- Toasts: éxito "Liga creada correctamente"; error "Error al crear la liga".
- La liga se crea con `estadoLiga = SinEmpezar`.

**Acciones y navegación:** "Crear liga" / submit → crea la liga y, en éxito, navega a `/competiciones`. "+" añade ubicación; "Eliminar" la quita.

**Assets:** ninguno.

### Admin equipos — `/admin-equipos`

**Acceso:** solo admin. **Propósito:** listar y buscar todos los equipos de la app y ver en qué ligas están.

**Layout:** contenedor con padding 12px (sin max-width). Título h1 sticky en `top: 0` con fondo `neutral-950`, z-index 10, padding inferior 8px. Buscador debajo (margen superior 8px). Lista vertical (`ul`) con gap 12px y margen superior 12px.

**Elementos y copys (en orden visual):**
1. Título h1 (Zen Dots 24px, `primary`): "Lista de equipos".
2. Input texto placeholder "Buscar equipo..." (filtra con debounce 300 ms por `id` o `nombre`, ignorando tildes y mayúsculas).
3. Lista de `TarjetaEquipoAdmin` (ver C4), cada una con las ligas en las que está inscrito el equipo.

**Estados:** vacío/sin coincidencias: "No se encontraron equipos" (centrado, `neutral-500`, margen superior 40px). Sin literal de loading (mientras carga aparece el vacío).

**Acciones y navegación:** ninguna (las tarjetas no son clicables).

**Assets:** ninguno.

### Admin usuarios — `/admin-usuarios`

**Acceso:** solo admin. **Propósito:** listar y buscar usuarios registrados y contactarlos por WhatsApp.

**Layout:** padding 12px. Bloque sticky en `top: 0` (fondo `neutral-950`, z-index 10, padding inferior 8px) con título y buscador (margen superior 8px). Lista vertical con gap 12px, margen superior 12px.

**Elementos y copys (en orden visual):**
1. Título h1 (Zen Dots 24px, `primary`): "Lista de usuarios".
2. Input texto placeholder "Buscar usuario..." (debounce 300 ms; filtra por `username`, `nombre` o `email`, normalizando tildes y mayúsculas).
3. Lista de `TarjetaUsuarioAdmin` (ver C4).

**Estados:**
- Loading: "Cargando usuarios..." (centrado, `neutral-400`, padding 24px, pulse).
- Vacío: "No se encontraron usuarios" (centrado, `neutral-500`, margen superior 40px).

**Acciones y navegación:** botón WhatsApp de cada tarjeta → abre `https://wa.me/34{movil}?text=Hola%20😊` en pestaña nueva (mensaje predeterminado "Hola 😊").

**Assets:** icono WhatsApp inline SVG (36px, círculo, relleno `#4dc247`).

### Temporadas — `/admin-temporadas`

**Acceso:** solo admin. **Propósito:** listar temporadas y crear nuevas.

**Layout:** padding 12px, `max-w-screen-sm` centrado, ancho completo. Bloque sticky `top: 0` (fondo `neutral-950`, z-index 10, padding inferior 8px) con título y botón (margen superior 8px). Lista vertical gap 12px, margen superior 12px. Título del documento: "Temporadas | Recreativos Air".

**Elementos y copys (en orden visual):**
1. Título h1 (Zen Dots 24px, `primary`): "Temporadas".
2. Botón primary, icono `faPlus`, "Nueva temporada".
3. Lista de `TarjetaTemporadaAdmin` (ver C4).

**Estados:**
- Loading: "Cargando temporadas..." (centrado, `neutral-400`, padding 24px, pulse).
- Vacío: "No hay temporadas" (centrado, `neutral-500`, margen superior 40px).

**Acciones y navegación:** "Nueva temporada" → `/admin-temporadas/nueva`; clic en tarjeta → `/admin-temporadas/{temporada.id}`.

**Assets:** ninguno.

### Nueva temporada — `/admin-temporadas/nueva`

**Acceso:** solo admin. **Propósito:** crear una temporada.

**Layout:** `max-w-screen-sm` centrado, padding 16px, ancho completo. Título h1 (margen inferior 16px) + `TemporadaForm`. Título del documento: "Nueva temporada | Recreativos Air".

**Elementos y copys (en orden visual):**
1. Título h1 (36px extrabold `primary`): "Nueva temporada".
2. `TemporadaForm` con botón de envío "Crear temporada" (ver debajo).

**Estados:** los del formulario; toasts "Temporada creada correctamente" / "Error al crear la temporada". La temporada se crea con `actual: false`.

**Acciones y navegación:** submit → crea y navega a `/admin-temporadas`.

### Detalle de temporada — `/admin-temporadas/:id`

**Acceso:** solo admin. **Propósito:** editar una temporada, marcarla como actual o eliminarla.

**Layout:** `max-w-screen-sm` centrado, padding 16px. Fila de cabecera (gap 12px, margen inferior 16px) con título y chip; debajo `TemporadaForm`; debajo fila de dos botones (gap 8px, margen superior 24px). Título del documento: "{temporada.nombre} | Recreativos Air".

**Elementos y copys (en orden visual):**
1. Título h1: `{temporada.nombre}`.
2. Condicional (si `temporada.actual`): chip "Actual" (12px, `green-400` sobre `green-500/20`, esquinas 6px, padding horizontal 4px).
3. `TemporadaForm` precargado con la temporada, botón "Guardar cambios".
4. Botón outline, icono `faStar`: "Marcar como actual"; si ya es la actual, texto "Es la actual" y `disabled`.
5. Botón `outline-danger`, icono `faTrash`: "Eliminar".

**Estados:**
- Loading: "Cargando temporada..." (centrado, `neutral-400`, padding 24px, pulse).
- No encontrada: "Temporada no encontrada" (centrado, `neutral-500`, margen superior 40px).
- `disabled`: "Marcar como actual" si `temporada.actual` o mientras `marcando`; "Eliminar" mientras `eliminando`; botón del formulario mientras `isPending`.
- Toasts: "Temporada actualizada" / "Error al actualizar la temporada"; "Temporada marcada como actual" / "Error al marcar la temporada como actual"; "Temporada eliminada" / "Error al eliminar la temporada".
- ConfirmDialog eliminar: título "Eliminar temporada", descripción `Se eliminará "{temporada.nombre}". {numLigas} liga(s) quedarán sin temporada.` (`{numLigas}` = ligas cuya temporada es esta), confirmar "Eliminar", cancelar "Cancelar".

**Acciones y navegación:** "Guardar cambios" → actualiza. "Marcar como actual" → marca. "Eliminar" → confirm → elimina y navega a `/admin-temporadas`.

### TemporadaForm (usado en nueva y detalle)

**Layout:** formulario en columna con gap 16px. Fechas en una fila de dos campos (gap 8px). Caja de ligas con fondo `neutral-900`, borde `neutral-700`, esquinas 6px, padding 12px.

**Elementos y copys (en orden visual):**
1. Campo — label "Nombre"; input texto placeholder "Nombre de la temporada".
2. Campo — label "Fecha inicio"; input tipo `date`.
3. Campo — label "Fecha fin"; input tipo `date`.
4. Caja — label "Ligas de la temporada"; multiselect buscable (`react-select` multi, chips `neutral-700` con texto `neutral-200` y aspa que en hover pasa a `red-500`), placeholder "Buscar liga", sin cerrar el menú al seleccionar; mensaje sin coincidencias "Sin resultados". Opciones: `{liga.nombre}`; si la liga pertenece a otra temporada: "{liga.nombre} (en otra temporada)". Preseleccionadas las ligas de esta temporada.
5. Botón primary con `{submitLabel}` ("Crear temporada" o "Guardar cambios"); en curso: "Guardando...".

**Estados / validaciones (toast error):** "Introduce un nombre válido" (nombre vacío); "La fecha de fin debe ser posterior a la de inicio" (ambas fechas rellenas y inicio > fin). Botón `disabled` mientras `isPending`.

---

---

## 8. Componentes de tarjeta reutilizados

### 8.1 TarjetaEquipo y TarjetaEnfrentamiento

**TarjetaEquipo** (`src/shared/components/TarjetaEquipo/TarjetaEquipo.tsx`). Usada en Perfil público y Mi perfil (MisEquipos). Requiere usuario logueado (si no, no renderiza).
- Contenedor: `border border-neutral-700 rounded-lg p-2 px-4 min-w-62 overflow-hidden relative`. Franja vertical de color del equipo en el borde izquierdo (`w-2 h-full`, `backgroundColor: {color}`), solo si el equipo tiene color.
- Variantes de fondo/interacción:
  - **Mi invitación pendiente** (no soy el creador y mi registro está PENDIENTE): fondo `bg-neutral-800`, NO clicable.
  - **Esperando compañero** (soy creador, hay jugadores PENDIENTE y no soy yo el pendiente): fondo `bg-neutral-900`, clicable, nombre en `text-amber-400`.
  - **Completado** (sin pendientes): fondo `bg-neutral-900`, `hover:border-primary cursor-pointer`, nombre en `text-primary`.
  - Resto: nombre `text-neutral-200`.
- Campos: nombre del equipo `font-cool text-lg font-bold` "{nombre}". [Invitación pendiente] párrafo `text-sm text-amber-400 mb-3` "Has sido invitado a este equipo". Lista de jugadores separada por `border-t border-neutral-700`: por jugador (`text-sm flex justify-between`): "{nombre}" (`text-primary` si soy yo, si no `text-neutral-300`) + [suplente] span `text-amber-400 text-xs` "(Suplente)"; [si soy yo] chip `bg-neutral-800 text-neutral-400 text-xs px-2 rounded` "Tú"; a la derecha, para jugadores que no son el creador, estado: solo se pinta si es PENDIENTE, como texto crudo del enum "PENDIENTE" en `text-amber-500 text-sm` (ACEPTADO y RECHAZADO no se muestran).
- [Invitación pendiente] fila de botones `mt-4 gap-2`: Button `primary` "Aceptar" + Button `outline` "Rechazar" (ambos disabled en pending). Disparan PATCH `/equipos/invitacion`; toasts del hook: éxito "Invitación actualizada", error "Error al actualizar invitación".
- Navegación: click en la tarjeta (salvo invitación pendiente) → callback del padre, en ambos usos `/equipos/{id}`.

**TarjetaEnfrentamiento** (`src/shared/components/TarjetaEnfrentamiento/TarjetaEnfrentamiento.tsx`). Usada en el listado de jornadas de la liga (otra parte) y en el panel admin "Pendientes de confirmar" (aquí sin onClick).
- Contenedor `border border-neutral-700 rounded-md bg-neutral-900/50 overflow-hidden`.
- Cabecera `bg-neutral-800 text-xs text-neutral-300 p-1` en tres columnas: izquierda (3/12) icono `faCalendarDays` + "{fecha}" (`toLocaleDateString`) o "-"; centro (6/12, centrado) icono `faLocationDot` + "{ubicacion}" (vacío si no hay); derecha (3/12, alineado derecha) chip de estado textual: "No jugado" `text-red-600` / "Jugado" `text-green-600` / "Corroborar resultado" `text-orange-300` / "Confirmar resultado" `text-yellow-300`.
- Cuerpo `text-sm`: mitad izquierda con dos filas "{equipo A}" (borde inferior) y "{equipo B}", cada una con barra de color del equipo de 4px a la izquierda (`w-1 h-full`, `backgroundColor: {color}`), `truncate` con `title` completo; el nombre se pinta `text-primary` si el equipo es uno de los míos. Mitad derecha (`border-l`, scroll horizontal): una columna por partido con "{golesA}" arriba y "{golesB}" abajo (`text-neutral-300 py-2 px-3 text-center`, separadas por `border-r`); si el estado es SinJugar se muestra "-" en ambas; la casilla del ganador (goles == `cfgLiga.golesParaGanar`) lleva fondo `bg-green-400/5`.
- Navegación: `onClick` opcional del padre (en las jornadas de liga → `/jornadas/{id}`; en el panel admin no navega).

---

### 8.2 Tarjetas de liga y administración

#### TarjetaLiga

**Uso:** listados de ligas en Competiciones, Landing, Mi perfil ("Mis competiciones") y Perfil público. **Propósito:** resumen de una liga con estado, progreso y acceso rápido a inscribirse.

**Layout:** tarjeta de alto completo, fondo `neutral-900`, borde `neutral-800` (hover `neutral-700`), esquinas 24px (`rounded-3xl`), padding 12px (md: 16px), `overflow-hidden`, posición relativa. Tres capas: (a) imagen de fondo absoluta pegada a la derecha, alto 100%, `object-cover`, `object-right`; (b) degradado horizontal de `neutral-900` (izquierda) a `neutral-900/60` a transparente (derecha) cubriendo toda la tarjeta; (c) contenido en columna `justify-between` con gap 4px.

**Elementos y copys (en orden visual):**
1. Fila (gap 8px): logo del tipo de futbolín `logoFutbolinMap[tipoFutbolin]` 36px + nombre `{liga.nombre}` (Zen Dots, negrita, `primary`, 18px; lg: 24px).
2. `ChipEstadoLiga` absoluto en la esquina superior derecha (`-top-1 -right-1`, z 3).
3. Condicional (usuario con equipo en la liga): `PosicionUsuarioChip` (modo `finalizada` si la liga está `Finalizada`).
4. Condicional (`estadoLiga === EnCurso`): `LigaProgress` con el equipo del usuario.
5. Condicional botón (margen superior 12px), variante `outline-neutral`, "Inscribirme":
   - Usuario logueado, **no** inscrito y liga `SinEmpezar` → abre ventana "Elige un equipo" con `SelectorEquipoUsuario` (mismo flujo que en C1).
   - Usuario **no** logueado → siempre visible; navega a `/login`.
6. Condicional (equipo del usuario en estado `Pendiente`): chip "Esperando confirmación..." (padding 4px, `neutral-500/20`, 14px, `primary`, margen superior 12px).
- No se muestra texto de temporada ni fechas en la tarjeta (hay bloques de "Equipos: N" y descripción comentados en el código, no visibles).

**Estados:** toast "Error al cargar liga" (defensivo); toasts de inscripción "Equipo inscrito correctamente" / "No se pudo inscribir el equipo".

**Acciones y navegación:** clic en la tarjeta → en todos los usos actuales navega a `/competiciones/{liga.id}/clasificacion`. El clic en "Inscribirme" se propaga también a la tarjeta (no hay `stopPropagation`).

**Assets:** fondo `src/shared/assets/futbolines/infinity.jpg` / `tsunami.jpg` (`object-cover`, anclado a la derecha, con degradado oscuro encima); logo `src/shared/assets/logos/infinity.png` / `tsunami.png` (36px).

#### ChipEstadoLiga

Párrafo de ancho ajustado, 12px, padding horizontal 4px, esquinas 6px, sin salto de línea. Texto y color por `EstadoLiga`:
- `EnCurso` → "En curso" — texto `orange-400`, fondo `orange-500/20`.
- `SinEmpezar` → "Aún no ha comenzado" — texto `green-400`, fondo `green-500/20`.
- `Finalizada` → "Finalizada" — texto `sky-400`, fondo `sky-500/20`.

#### PosicionUsuarioChip

Píldora (`rounded-full`) con borde, padding 12px/6px, 12px negrita, icono + texto. Se oculta si no hay equipo o clasificación, o si el equipo no aparece en ella.
- Posición 1: icono `faTrophy`, texto `amber-400`, fondo `amber-400/10`, borde `amber-400/20`.
- Posición 2: icono `faMedal`, `slate-400` / `slate-400/10` / `slate-400/20`.
- Posición 3: icono `faMedal`, `orange-700` / `orange-700/10` / `orange-700/20`.
- Resto: icono `faShieldHalved`, `neutral-500`, fondo `neutral-800`, borde `neutral-700`.
- Texto: modo normal "{pos}º Puesto"; modo finalizada: "¡Campeones! Has quedado 1º" si `pos === 1`, si no "Has quedado {pos}º".

#### LigaProgress

Columna con gap 8px, margen superior 4px, ancho completo, padding derecho 8px. Se oculta si la liga no tiene enfrentamientos. Contiene hasta dos `ProgressBar` (fila superior 12px `neutral-400` con etiqueta y porcentaje en `primary` negrita "{n}%"; barra de 8px, fondo `neutral-800`, relleno `primary`, esquinas redondeadas, transición 300 ms):
1. **Solo admin:** barra etiqueta "Liga" = % de enfrentamientos en estado `Jugado` sobre el total.
2. Si el usuario tiene equipo con enfrentamientos: barra etiqueta "Has jugado" = % de sus enfrentamientos jugados.

#### TarjetaEquipoLiga (vista usuario, en /equipos)

Contenedor fondo `neutral-800/80`, esquinas 8px, padding 8px/12px con 20px a la izquierda, `overflow-hidden`, clicable completo. Franja vertical absoluta de 8px a la izquierda con `{equipo.color}` (o `primary` si no hay).
1. Nombre `{equipo.nombre}` — Zen Dots, extrabold, 18px, `primary`, tracking apretado.
2. Fila `neutral-400` (padding 6px, gap 8px): icono `faUsers` (sm) + texto 14px con los jugadores "{nombre1}, {nombre2}, …" (unidos por ", ").
Acción: clic → `/equipos/{equipo.id}`.

#### TarjetaEquipoLigaAdmin (vista admin, en /equipos)

Mismo contenedor y franja de color que la de usuario. Es un acordeón:
- **Cabecera (siempre visible, clic para desplegar/plegar)**: nombre `{equipo.nombre}` (mismo estilo), fila `faUsers` + jugadores, fila de chips; a la derecha icono `faChevronDown` `neutral-400` que rota 180° al abrir (transición 200 ms).
  - Chip absoluto esquina superior derecha si `pagado === false`: fondo `red-400/10`, texto `red-400`, icono `faEuro` (sin texto).
  - Chip en línea si `estado === Pendiente`: fondo `red-400/10`, texto `red-400`, icono `faHand` + texto 12px "No aceptado".
- **Panel desplegable** (grid animado 0fr→1fr, 200 ms) con botones en fila con wrap, gap 8px:
  1. Botón outline, icono `faEye`, "Ver equipo" → `/equipos/{equipo.id}`.
  2. Si pendiente de pago: Botón outline "Marcar pagado" → ConfirmDialog título "¿Estás seguro?", descripción "Marcarás como pagado el equipo", botones "Cancelar" / "Confirmar" (por defecto) → toasts "Equipo marcado como pagado" / "Error al marcar como pagado".
  3. Si `Pendiente`: Botón primary "Aceptar" → aprueba la inscripción sin confirmación → toasts "Inscripción actualizada" / "Error al actualizar la inscripción".
  4. Botón `outline-danger`, icono `faTrash`, "Eliminar de la liga" → ConfirmDialog título "¿Estás seguro?", descripción "Se eliminarán todos sus enfrentamientos. Esta acción no se puede deshacer", botones "Cancelar" / "Confirmar" → toasts "Equipo eliminado correctamente" / "Error al eliminar el equipo de la liga".
- No hay `ContextButton`; las acciones se muestran como botones dentro del acordeón.

#### TarjetaEquipoAdmin (en /admin-equipos)

Tarjeta fondo `neutral-900`, esquinas 8px, padding 8px/16px, no clicable.
1. `{equipo.id}` — 12px `neutral-500`.
2. `{equipo.nombre}` — Zen Dots 20px `primary`.
3. Dos columnas (2/3 y 1/3, alineadas arriba):
   - Izquierda: título subrayado `neutral-600` "Jugadores"; por cada jugador fila 14px `neutral-400` con icono `faUser` + `{nombre}` (truncado) y, si `idUsuario === null`, texto 12px `neutral-600` "(No registrado)".
   - Derecha: título subrayado `neutral-600` "Liga"; por cada liga fila 14px `neutral-400` con icono `faTrophy` + `{liga.nombre}`.

#### TarjetaUsuarioAdmin (en /admin-usuarios)

Tarjeta fondo `neutral-900`, esquinas 8px, padding 8px/16px, posición relativa.
1. Botón absoluto arriba a la derecha con icono WhatsApp (SVG 36px, verde `#4dc247`) → abre chat `wa.me/34{movil}` con texto "Hola 😊".
2. Fila (gap 8px): `{username}` Zen Dots 20px `primary` + "({nombre})" 12px `neutral-400`.
3. Fila 14px `neutral-600`: icono `faPhone` + `{movil}`.
4. Fila 14px `neutral-600`: icono `faEnvelope` + `{email}`.
5. Condicional (`!verified`): texto absoluto abajo a la derecha, 12px `red-500`: "Debe verificar correo".

#### TarjetaTemporadaAdmin (en /admin-temporadas)

Tarjeta fondo `neutral-900`, esquinas 8px, padding 8px/16px, cursor pointer, clicable completa.
1. Condicional (`actual`): chip absoluto `-top-1 -right-1` "Actual" (12px, `green-400` sobre `green-500/20`, esquinas 6px).
2. `{temporada.nombre}` — Zen Dots 20px `primary`.
3. Fila 14px `neutral-500`: icono `faCalendarDays` + "{fechaInicio} - {fechaFin}" con fechas en formato `es-ES` (dd/mm/aaaa) y "—" cuando la fecha es nula.
Acción: clic → `/admin-temporadas/{temporada.id}`.

---

---

## 9. Overlays y selectores

### 9.1 SelectorUsuario, SelectorEquipo, SelectorEquipoUsuario, SelectorEstadoEnfrentamiento, EnfrentamientosPendientes

Mecanismos de apertura disponibles en el proyecto:
- **`Window`** (`src/packages/components/Window/Window.tsx`): `<dialog>` nativo abierto con `showModal()`; panel `bg-neutral-900 border border-neutral-700 rounded-2xl p-3 pt-6`, `w-11/12 md:w-1/2 xl:w-1/4`, separado 80px del top (`mt-20`), animación `animate-fade-in-top`; backdrop `bg-neutral-950/90` con blur ligero; botón cerrar `faXmark` (24px, `text-neutral-400`) absoluto arriba-derecha; título `text-primary font-bold text-xl truncate mb-5` (por defecto "Ventana" si no se pasa). Se cierra con la X, con Esc (evento close del dialog) o cuando el contenido llama a `close()`.
- **`WindowProvider` / `useWindow()`** (`src/shared/context/WindowProvider.tsx`): contexto global con `show(contenido, título)` y `close()`; renderiza un único `Window` por portal en `document.body`. Es la forma en la que se abren SelectorEquipoUsuario ("Elige un equipo" desde TarjetaLiga) e InscribirEquipoExistenteForm ("Elige un equipo" desde EquiposLigaPage, admin).
- **`Modal`** (`src/shared/components/Modal.tsx`): overlay `fixed inset-0 z-[60]`, fondo `bg-black/60` con blur 2px; panel CLARO `bg-neutral-100 rounded-2xl shadow-xl` con tamaños `max-w-sm/md/lg/2xl` (md por defecto), `mx-4`; cabecera con título `text-lg font-semibold text-neutral-900` y botón cerrar `faXmark` (aria-label "Cerrar", `hover:bg-neutral-200`); cierra por overlay, Esc y botón; bloquea scroll del body. Actualmente no lo usa ninguna pantalla de este ámbito (componente disponible).
- **`BottomSheetDrawer`** (`src/shared/components/BottomSheetDrawer.tsx`): hoja inferior `fixed inset-0 z-50`, overlay `bg-black/80`, panel CLARO `bg-neutral-200 rounded-t-2xl` que sube desde abajo (`translate-y`), botón cerrar `faXmark` arriba-derecha, título opcional `text-lg font-semibold mb-2`; cierra por overlay, Esc y botón. No lo usa ninguna pantalla de este ámbito.
- **`ConfirmDialog`** (`src/shared/components/ConfirmDialog.tsx`): overlay `bg-black/60` blur, panel `bg-neutral-900 rounded-xl p-6 max-w-sm`; título `text-primary text-lg font-semibold` centrado (por defecto "¿Estás seguro?"), descripción `text-sm text-neutral-400` (por defecto "Esta acción no se puede deshacer."), dos botones a ancho completo: cancelar `border border-neutral-300 text-neutral-400` (por defecto "Cancelar") y confirmar `bg-red-600 text-white` (por defecto "Confirmar"). No lo usa ninguna pantalla de este ámbito.
- **Selects (`react-select`)** con `sharedSelectStyles`: control de 36px, fondo neutral-800 (neutral-700 disabled), borde transparente que pasa a primary con foco, radio 6px; texto neutral-200; menú desplegable `bg-neutral-950 border neutral-700`, opciones `text-neutral-50`, seleccionada `bg-neutral-900`, hover `bg-neutral-800 text-primary`. Mensajes por defecto del `CustomSelect`: sin resultados "Sin resultados", cargando "Cargando...", placeholder por defecto "Escribe para buscar".

**SelectorUsuario** (`src/shared/components/SelectorUsuario/SelectorUsuario.tsx`). Select asíncrono (`CustomAsyncSelect`, debounce 250ms, `isClearable`) que busca en `GET /users/buscar?q=&limit=10` y excluye al propio usuario. No es un overlay separado: se renderiza inline en Crear equipo (modo "Usuario registrado").
- Placeholder por defecto "Escribe para buscar..." (Crear equipo lo sustituye por "Buscar usuario...").
- Mensaje con input vacío: "Escribe el nombre de tu compañero...". Cargando: "Cargando...". Sin resultados con texto escrito: "Sin resultados".
- Opción del desplegable (`flex items-center gap-4 p-2 rounded-lg hover:bg-neutral-900`): icono `faUser` `text-neutral-300` + dos líneas: "{username}" (`text-neutral-300`) y "{nombre}" (`text-neutral-500`).
- Al seleccionar dispara `onSelect` con el usuario (en Crear equipo lo añade como jugador PENDIENTE). Disabled mientras se crea el equipo.

**SelectorEquipo** (`src/shared/components/SelectorEquipo/SelectorEquipo.tsx`). `CustomSelect` con búsqueda (`searchable`), placeholder "Buscar equipo". Opciones: "{nombre de equipo}" por equipo; si `incluirOpcionTodos` (por defecto sí) antepone la opción "Cualquiera" (valor "-1"). Se usa dentro de SelectorEquipoUsuario (sin "Cualquiera") y en `InscribirEquipoExistenteForm` (admin, con "Cualquiera", dentro de la Window "Elige un equipo" junto a botones "Agregar" (primary, disabled sin selección) y "Cancelar" (outline); ese formulario muestra "No eres admin " [sic, espacio final] si no eres admin y sus toasts de error son "No se encontró la liga", "No se encontró el equipo", "El equipo ya está en la liga").

**SelectorEquipoUsuario** (`src/shared/components/SelectorEquipoUsuario/SelectorEquipoUsuario.tsx`). Se abre con `useWindow().show(..., "Elige un equipo")` desde `TarjetaLiga` al pulsar inscribirse; se cierra con `close()` tras seleccionar o cancelar, o con la X/Esc de la Window.
- Loading: párrafo "Cargando equipos...". Error: párrafo "Error al cargar equipos".
- Vacío (sin equipos): párrafo `text-neutral-200 p-2` "Ups... no tienes ningún equipo" + Button `primary` "Crear equipo" (navega a `/crear-equipo` y cierra la ventana).
- Normal: label "Selecciona tu equipo para inscribirte" + `SelectorEquipo` (placeholder "Buscar equipo", sin opción "Cualquiera") + fila alineada a la derecha: Button `outline` "Cancelar" + Button `primary` "Inscribirme" (disabled hasta elegir equipo). Al confirmar dispara la inscripción del equipo en la liga (toasts de `useInscribirEquipo`, fuera de este ámbito) y cierra.

**SelectorEstadoEnfrentamiento** (`src/shared/components/SelectorEstadoEnfrentamiento/SelectorEstadoEnfrentamiento.tsx`). `CustomSelect` no buscable, placeholder "Cualquiera". Opciones en este orden: "Cualquiera", "Esperar admin" (= ConfirmarResultado), "Esperar rival" (= CorroborarResultado), "Jugado", "No jugado" (= SinJugar). Se usa inline en `FiltrosJornadas` (listado de jornadas de la liga) bajo la etiqueta `text-xs text-neutral-500` "Estado:", junto al checkbox "Mostrar todos" bajo la etiqueta "Equipos:". No es overlay.

**EnfrentamientosPendientes** (`src/features/Jornadas/DetalleJornada/components/EnfrentamientosPendientes.tsx`). Panel de admin renderizado dentro del menú hamburguesa móvil (`HamburgerMenu` en `TopNav`, panel `fixed` a pantalla completa `bg-neutral-950/95`, `lg:hidden`), como primer ítem de la lista de navegación y solo si el usuario es admin. Fuente: `GET /enfrentamientos/pendientes-admin` (`useEnfrentamientosPendientesAdmin`, con `placeholderData: []`).
- Si no hay enfrentamientos pendientes no renderiza nada (ni título). No tiene texto de carga.
- Título `text-sm text-neutral-400 font-semibold uppercase tracking-wide mb-2`: "Pendientes de confirmar".
- Lista vertical `gap-4`; por cada enfrentamiento: `TarjetaEnfrentamiento` (sin navegación) + fila `gap-2` con Button `outline` icono `faXmark` "Rechazar" y Button `primary` icono `faCheck` "Confirmar" (ambos disabled mientras cualquiera de las dos mutaciones está en curso).
- Toasts: "Confirmar" → éxito "Resultado confirmado", error "Error al confirmar el resultado". "Rechazar" → éxito "Resultado rechazado y reiniciado", error "Error al rechazar el resultado".
- Indicador asociado: el botón hamburguesa muestra un badge rojo (`bg-red-500 text-white text-[10px] font-bold rounded-full`, mínimo 16px) con "{n}" = número de pendientes, solo para admin y si n > 0.
- Se "cierra" cerrando el menú hamburguesa (no tiene cierre propio).

---

### 9.2 Selectores de liga

Ambos selectores usan `CustomSelect` (`react-select` de selección única): control de 36px de alto, fondo `neutral-800` (deshabilitado `neutral-700`), borde transparente que pasa a `primary` al enfocar, esquinas 6px, texto `neutral-200` (deshabilitado `neutral-500`). El menú se abre **desplegable bajo el control** al hacer clic (no es una ventana modal) y se cierra al seleccionar una opción, al hacer clic fuera o con Escape; fondo `neutral-950`, borde `neutral-700`, padding 4px; opciones con esquinas 5px, texto `neutral-50`, seleccionada con fondo `neutral-900`, hover fondo `neutral-800` y texto `primary`. No se puede limpiar el valor (`isClearable=false`). Mensaje sin opciones por defecto "Sin resultados"; cargando "Cargando..."; placeholder por defecto "Escribe para buscar" (cada selector lo sobrescribe). Las opciones admiten imagen de 20×20 px a la izquierda del texto, **pero ninguno de estos dos selectores pasa `imageUrl`, así que se muestran solo texto.**

#### SelectorTipoFutbolin

- No buscable. Sin placeholder propio (usa "Escribe para buscar" si no hubiera valor, aunque siempre recibe valor).
- Opciones literales en orden: "Infinity", "Tsunami".
- Prop `disabled` (en Ajustes: cuando la liga no está `SinEmpezar`).
- Usado en: Crear liga, Ajustes de liga.

#### SelectorTemporada

- No buscable. Placeholder "Temporada".
- Opciones en orden: (opcional, `incluirOpcionTodas`) "Todas"; (opcional, `incluirOpcionSinTemporada`) "Sin temporada"; después una por temporada con `{temporada.nombre}` o "{temporada.nombre} (actual)" si es la actual.
- En Crear liga y Ajustes se incluye "Sin temporada" y no "Todas".

---

---

## 10. Inventario de assets (logos e imágenes)

Se entregan junto a este documento. Deben aparecer en los mismos lugares con la misma función; el tratamiento visual (tamaño, opacidad, recorte) es libre mientras se mantenga el significado.

| Asset | Descripción | Dónde se usa hoy | Tratamiento actual |
|---|---|---|---|
| `public/logo.png` | Logo Recreativos AIR | Header (enlace a `/`), marca de agua de fondo en todas las pantallas, favicon básico | 40×40px en header; marca de agua fija abajo-izquierda al 4% de opacidad, ancho completo en móvil / 360px en desktop |
| `public/logo-futbol-in.png` | Logo de futbolin.app (partner) | Pie del menú lateral móvil y sección final de la Landing; enlace externo a https://www.futbolin.app en pestaña nueva | Caja oscura redondeada, imagen de 160px de ancho con padding |
| `public/logo-admin.png` | Variante de logo para admin | **Sin uso actual** (disponible si el rework quiere diferenciar el modo admin, que hoy se señala con el borde azul del header) | — |
| `public/fondo.png` | Imagen Open Graph (redes sociales) | Solo en la meta `og:image` | — |
| `public/favicon/*` + `manifest.json` | Favicons (svg, ico, 96px, apple-touch 180px, PWA 192/512) | `index.html` | Nombre PWA "Recreativos AIR" |
| `src/shared/assets/logos/infinity.png`, `tsunami.png` | Logos de los dos modelos de futbolín (tipo de liga: Infinity / Tsunami) | TarjetaLiga (logo sobre la tarjeta), cabecera del Detalle de liga (36px junto al nombre), opciones del selector de tipo de futbolín | Mapeados por tipo de futbolín |
| `src/shared/assets/logos/infinitylight.png`, `tsunamilight.png` | Versiones para fondo claro | Sin uso actual | — |
| `src/shared/assets/futbolines/infinity.jpg`, `tsunami.jpg` | Fotos de cada modelo de futbolín | Fondo de TarjetaLiga según tipo de liga | Imagen de fondo con overlay oscuro para legibilidad |
| `src/shared/assets/futbolines/infinitylight.jpg`, `tsunamilight.jpg` | Versiones claras | Sin uso actual | — |
| `src/shared/assets/tsunami.jpg` | Foto futbolín Tsunami | Hero de la Landing | Imagen de fondo del hero (ver §4 Landing) |
| `src/shared/assets/fondo-tsunami.jpg`, `fondo-tsunami-full.jpg`, `fondo-tsunami-full-light.jpg` | Fondos alternativos | Sin uso actual | — |
| `src/shared/assets/img/billar.png`, `img/dardos.webp` | Ilustraciones de billar y dardos (otros recreativos) | Sin uso actual (reservadas para futuras secciones) | — |

**No existen** avatares de usuario ni escudos de equipo: la identidad de usuarios y equipos se muestra solo con texto (nombre). El rework puede proponer iniciales o avatares generados, pero no hay imágenes que cargar.

**Fuentes:** Inter (variable, Google Fonts) para todo el cuerpo; Zen Dots (Google Fonts) para títulos display (nombre de liga, título de tab, landing). Meta description del sitio: "Liga Futbolín Salamanca - Recreativos AIR".

---

## 11. Inventario de componentes actuales → migración a shadcn/ui

La app se migrará a **shadcn/ui** (Radix + Tailwind) y los iconos de **FontAwesome Solid a Lucide**. Esta tabla lista todos los componentes propios que existen hoy, su función, dónde se usan y el bloque de shadcn que se propone para sustituirlos. El diseño nuevo debe cubrir todas las variantes y estados listados.

### 11.1 Primitivos (carpeta `src/packages/components`)

| Componente actual | Función y variantes | Usado en | Equivalente shadcn propuesto |
|---|---|---|---|
| `Button` | Botón 40px alto, ancho completo, esquinas `2xl`, texto en negrita, icono opcional a la izquierda; modo **solo icono** circular. Variantes: `primary` (degradado radial azul, texto oscuro), `outline` (fondo oscuro translúcido, borde y texto azul), `neutral` (gris claro, texto oscuro), `outline-neutral` (borde y texto gris), `danger` (rojo sólido), `outline-danger` (borde y texto rojo). Disabled: fondo gris oscuro, texto gris. | Toda la app | `Button` con variantes `default`, `outline`, `secondary`, `ghost`, `destructive` + variante outline-destructive personalizada; `size="icon"` para solo icono |
| `Titulo` | Encabezados h1–h6, siempre en color primario, de `text-4xl extrabold` (h1) a `text-base bold` (h6) | Casi todas las páginas | `Typography` (h1–h6) del tema; mantener escala |
| `TextInput` / `PasswordInput` / `TextArea` | Campos 40px alto, fondo gris oscuro (`neutral-800`), esquinas `2xl`, sin borde; estado `hasError` con tinte rojo. PasswordInput con botón ojo (`faEye`/`faEyeSlash`) para mostrar/ocultar | Login, Registro, Reset, Editar perfil, Crear equipo, Crear liga, Ajustes, Temporadas, introducir resultado | `Input`, `Textarea`; botón de visibilidad como `Button size="icon" variant="ghost"` dentro de un wrapper |
| `FormField` / `FormLabel` | Contenedor vertical label + control + mensaje de error | Formularios | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` (react-hook-form ya presente) |
| `Select` (CustomSelect) / `AsyncSelect` / `MultiSelect` | Basados en react-select con estilos oscuros; opciones con imagen opcional (`imageUrl`); búsqueda asíncrona de usuarios; multiselección con chips | Crear liga, Crear equipo, selectores de usuario/equipo/temporada/tipo de futbolín | `Select` (simple), `Combobox` (Command + Popover) para búsqueda asíncrona, `Combobox` multi con `Badge` para chips |
| `InlinePicker` / `InlinePickerItem` | Control segmentado horizontal, tamaños `sm/md/lg`, ítems con icono y/o texto, ítem activo resaltado | Tabs del detalle de liga (icono solo), filtros de jornadas, selector de estado de enfrentamiento | `Tabs` (`TabsList`/`TabsTrigger`) o `ToggleGroup type="single"` |
| `Tabla` | Tabla con cabeceras ordenables (clic en cabecera), fila resaltada | Clasificación de liga | `Table` + `DataTable` (TanStack Table) con ordenación |
| `Message` | Aviso inline pequeño con icono: `success` (verde), `error` (rojo), `info` (gris) | Formularios, estados | `Alert` con variantes `default`/`destructive` + variante success personalizada |
| `ContextButton` | Botón "+" flotante/contextual que despliega un menú de acciones; cierre con `faXmark` | Tarjetas de admin (equipos, usuarios, equipos en liga) | `DropdownMenu` (trigger icono) |
| `Window` | Modal oscuro basado en `<dialog>` nativo, con botón cerrar `faXmark`; abierto por `useWindow()` | Selectores (equipo, usuario, tipo de futbolín…), formulario de inscribir equipo existente | `Dialog` (o `Drawer`/`Sheet` en móvil) |
| `ConfirmDialog` | Diálogo de confirmación centrado, panel oscuro, título azul, descripción gris, botones "Cancelar" (outline) y confirmar (rojo). Defaults: "¿Estás seguro?", "Esta acción no se puede deshacer.", "Confirmar", "Cancelar" | Ajustes de liga, detalle temporada, equipo en liga (admin) | `AlertDialog` |
| `Modal`, `BottomSheetDrawer` | Modal centrado y sheet inferior con panel **claro** (inconsistentes con el tema oscuro); prácticamente sin uso | — | Sustituir por `Dialog` / `Drawer`; no reproducir el panel claro |
| `FullPageSpinner` | Pantalla completa con texto "Cargando..." | Guards de ruta | `Skeleton` o `Spinner` de página completa |
| `FAB` | Botón de acción flotante expandible | **Sin uso** | No migrar |
| `ProgressBar` / `LigaProgress` | Barra de progreso fina (progreso de la liga en % de jornadas) | TarjetaLiga | `Progress` |

### 11.2 Componentes de dominio (`src/shared/components` y features)

| Componente actual | Función | Equivalente shadcn propuesto |
|---|---|---|
| `TarjetaLiga` (+ `ChipEstadoLiga`, `PosicionUsuarioChip`, `LigaProgress`) | Tarjeta de liga con foto de fondo, logo, nombre, chip de estado, progreso y posición del usuario | `Card` + `Badge` + `Progress` |
| `TarjetaEquipo`, `TarjetaEquipoLiga`, `TarjetaEquipoLigaAdmin`, `TarjetaEquipoAdmin`, `TarjetaUsuarioAdmin`, `TarjetaTemporadaAdmin` | Tarjetas de lista clicables con datos y acciones (admin con menú contextual) | `Card` + `Badge` + `DropdownMenu` |
| `TarjetaEnfrentamiento` | Tarjeta de partido: equipos, fecha, lugar, resultado/estado | `Card` + `Badge` |
| `ChipEstadoLiga`, `PosicionUsuarioChip`, chips de estado de enfrentamiento/equipo | Pills de estado con color semántico | `Badge` con variantes por estado |
| `SelectorUsuario`, `SelectorEquipo`, `SelectorEquipoUsuario`, `SelectorTipoFutbolin`, `SelectorTemporada`, `SelectorEstadoEnfrentamiento` | Listas de selección dentro de modal (algunas con búsqueda) | `Command` + `Dialog` (command palette) o `RadioGroup` en `Dialog` |
| `EnfrentamientosPendientes` | Panel de admin en el menú con enfrentamientos por validar y botones aceptar/rechazar | `Card` list + `Button size="icon"` |
| `TopNav` + `HamburgerMenu` + `TopNavItem` | Header con logo, menú fullscreen móvil, enlaces inline desktop, badge contador | `Sheet` (side="right", full) o `NavigationMenu`; `Badge` para contador |
| `NavDetalleLiga` | Tabs icono con título sticky | `Tabs` |
| `AvisoPerfilSinNombre`, `NetworkStatusBanner` | Banners fijos de aviso | `Alert` (ámbar) / `Sonner`-toast persistente |
| `react-hot-toast` | Toasts 2 s arriba | `Sonner` |
| `FiltrosJornadas` | Filtro segmentado de jornadas | `Tabs` / `ToggleGroup` / `Select` |
| `AdaptativeFlexContainer` (Registro) | Contenedor que cambia de fila a columna | Utilidades de layout, sin componente |

### 11.3 Iconos: FontAwesome Solid → Lucide

Todos los iconos que usa la app hoy, dónde aparecen y el equivalente Lucide propuesto. El significado debe conservarse.

| FontAwesome | Significado / uso | Dónde | Lucide propuesto |
|---|---|---|---|
| `faPlus` | Crear / añadir (nueva liga, nuevo jugador, nueva temporada, menú contextual, "Crear equipo" en menú) | MainLayout, MiPerfilPage, CrearEquipoPage, CrearLigaPage, AdminTemporadasPage, ContextButton | `Plus` |
| `faXmark` | Cerrar / rechazar / eliminar de lista | Window, Modal, BottomSheetDrawer, ContextButton, BotonesAdmin, BotonesUsers, EnfrentamientosPendientes | `X` |
| `faXmarkCircle` | Resultado rechazado | ResultadoEnfrentamiento | `XCircle` (`CircleX`) |
| `faTrophy` | Competiciones / ligas; posición 1.ª (oro) en PosicionUsuarioChip; ligas de un equipo en tarjeta admin | MainLayout (menú "Competiciones"), CompeticionesPage, CtaLigasDisponibles, MiPerfilPage, MisCompeticiones, PosicionUsuarioChip, TarjetaEquipoAdmin | `Trophy` |
| `faCalendarDays` | Temporadas (menú), jornadas (tab), fecha del enfrentamiento | MainLayout, NavDetalleLiga, FechaYLugarEnfrentamiento, TarjetaEnfrentamiento, TarjetaTemporadaAdmin | `CalendarDays` |
| `faUser` | Mi perfil (menú), Equipos admin (menú), jugador | MainLayout, DetalleEquipoPage, SelectorUsuario, TarjetaEquipoAdmin | `User` |
| `faUsers` | Usuarios admin (menú), jugadores/equipo | MainLayout, MiPerfilPage, TarjetaEquipoLiga, TarjetaEquipoLigaAdmin | `Users` |
| `faUserPlus` | Crear cuenta (menú invitado) | MainLayout | `UserPlus` |
| `faRightToBracket` | Iniciar sesión (menú invitado) | MainLayout | `LogIn` |
| `faPeopleGroup` | Tab Equipos de la liga | NavDetalleLiga | `Users` o `UsersRound` |
| `faListOl` | Tab Clasificación | NavDetalleLiga | `ListOrdered` |
| `faInfoCircle` | Tab Información; mensaje info; estado informativo | NavDetalleLiga, Message, InfoEstadoEnfrentamiento, ResultadoEnfrentamiento | `Info` |
| `faGear` | Tab Ajustes (admin) | NavDetalleLiga | `Settings` |
| `faCheck` | Aceptar / confirmar / validar resultado | BotonesAdmin, BotonesUsers, EnfrentamientosPendientes | `Check` |
| `faCheckCircle` | Éxito / resultado confirmado | Message, InfoEstadoEnfrentamiento, ResultadoEnfrentamiento | `CheckCircle2` (`CircleCheck`) |
| `faExclamationCircle` | Error (Message) | Message | `AlertCircle` (`CircleAlert`) |
| `faTriangleExclamation` | Aviso perfil sin nombre | AvisoPerfilSinNombre | `TriangleAlert` |
| `faHand` | Enfrentamiento en estado "corroborar / confirmar resultado"; badge rojo "No aceptado" de equipo pendiente (vista admin) | InfoEstadoEnfrentamiento, TarjetaEquipoLigaAdmin | `Hand` |
| `faTrash` | Eliminar (liga, temporada, jugador del equipo, equipo de la liga) | AjustesLigaPage, AdminTemporadaDetallePage, CrearEquipoPage, TarjetaEquipoLigaAdmin | `Trash2` |
| `faSave` | Guardar cambios | AjustesLigaPage, EditarPerfilPage | `Save` |
| `faPen` | Editar perfil | MiPerfilPage | `Pencil` |
| `faPhone` | Teléfono (admin ve teléfono del usuario) | PerfilPublicoPage, TarjetaUsuarioAdmin | `Phone` |
| `faEnvelope` | Email | PerfilPublicoPage, TarjetaUsuarioAdmin | `Mail` |
| `faLocationDot` | Lugar del enfrentamiento | FechaYLugarEnfrentamiento, TarjetaEnfrentamiento | `MapPin` |
| `faEye` / `faEyeSlash` | Mostrar/ocultar contraseña; botón "Ver equipo" en tarjeta admin de equipo en liga | PasswordInput, TarjetaEquipoLigaAdmin | `Eye` / `EyeOff` |
| `faPlay` | Iniciar la liga | AjustesLigaPage | `Play` |
| `faFlagCheckered` | Finalizar la liga | AjustesLigaPage | `Flag` (o `FlagTriangleRight`) |
| `faMedal` | Posición 2.ª (plata) y 3.ª (bronce) del usuario en la liga | PosicionUsuarioChip | `Medal` |
| `faShieldHalved` | Posición del usuario a partir de la 4.ª (gris) | PosicionUsuarioChip | `ShieldHalf` |
| `faStar` | Botón "marcar temporada como actual" (deshabilitado si ya lo es) | AdminTemporadaDetallePage | `Star` |
| `faSync` | Botón "Actualizar" (refrescar datos) | DetalleLigaLayout (usado en el menú) | `RefreshCw` |
| `faEuro` | Badge rojo "pendiente de pago" del equipo en liga (vista admin) | TarjetaEquipoLigaAdmin | `Euro` |
| `faChevronDown` | Expandir/contraer tarjeta admin de equipo en liga (rota 180°) | TarjetaEquipoLigaAdmin | `ChevronDown` |

---

## 12. Catálogo de copys transversales (toasts, errores, validaciones)

Agrupados por ámbito para que ninguno se pierda. Cada toast dura 2 s (react-hot-toast, arriba centrado).

### 12.1 Autenticación, shell y pantallas públicas


#### Toasts (react-hot-toast, 2 s, top-center)

| Copy | Tipo | Acción que lo dispara |
|---|---|---|
| "Inicio de sesión correcto" | success | Login correcto (`/login`) |
| "Tu correo no está verificado" | error | Login cuya respuesta contiene "no verificado" → redirige a `/verify-email` |
| `{res.message}` | error | Login / Reset paso 2 / Verificar email con `success: false` (texto del servidor) |
| `{err.message}` | error | Excepción en login (mensaje del interceptor HTTP) |
| "Te enviamos un código de verificación a tu correo" | success | Registro correcto |
| "Error del servidor. Inténtalo de nuevo más tarde." | error | Registro: excepción sin `message` |
| `{error.message}` | error | Registro: excepción con mensaje |
| "Error inesperado en la respuesta del servidor" | error | `handleApiErrors` cuando la API devuelve un objeto de error no reconocido (registro) |
| `{error}` (string) | error | `handleApiErrors` cuando la API devuelve un error de texto (registro) |
| "Si el correo existe, recibirás un código en breve" | success | Reset paso 1 enviado |
| "Error del servidor" | error | Reset paso 1 o 2: excepción sin `message` |
| "Contraseña actualizada correctamente" | success | Reset paso 2 correcto → `/login` |
| "Falta el correo electrónico" | error | Verificar email sin email en el estado de navegación |
| "Correo verificado correctamente" | success | Verificación correcta → `/` |
| "Código inválido o expirado {error}" | error | Excepción al verificar email |
| "Perfil actualizado" | success | `useUpdateMe` (guardar perfil; se dispara desde Editar perfil) |
| "Error al actualizar el perfil" | error | `useUpdateMe` falla sin mensaje (si hay `error.message`, se muestra ese) |
| "Resultado confirmado" | success | Admin confirma resultado desde el menú móvil |
| "Error al confirmar el resultado" | error | Fallo al confirmar |
| "Resultado rechazado y reiniciado" | success | Admin rechaza resultado desde el menú móvil |
| "Error al rechazar el resultado" | error | Fallo al rechazar |

#### Mensajes de error del interceptor HTTP (`src/shared/api/http.ts`, llegan como `{err.message}` a los toasts)
- `{res.message}` del backend si existe; si no, "Error desconocido del servidor" (cuando el backend devuelve `error` sin `message`).
- "Error de red o servidor no disponible" (sin respuesta del backend y sin `error.message` de axios; si axios trae mensaje, se muestra ese, p. ej. "Network Error").

#### Mensajes de validación zod (bajo el campo, `text-red-500 text-xs`)
- "Introduce un correo válido" — email inválido (Login, Registro, Reset paso 1 y 2)
- "Introduce un nombre de usuario" — nickname vacío (Registro)
- "El nombre de usuario debe tener al menos 3 caracteres" — nickname corto (Registro)
- "Introduce una contraseña" — contraseña vacía (Registro)
- "La contraseña debe tener al menos 6 caracteres" — contraseña o confirmación cortas (Login, Registro, Reset paso 2)
- "Introduce un número de móvil" — móvil vacío (Registro)
- "El código debe tener 6 dígitos" — código de longitud distinta de 6 (Reset paso 2; también definido para verificar email aunque esa pantalla no lo aplica en cliente)
- "Las contraseñas no coinciden" — contraseñas distintas (Reset paso 2)

#### Otros textos de estado
- "Cargando..." — FullPageSpinner (guards), skeletons de landing, lista de Competiciones, Select por defecto
- "Sin resultados" / "Escribe para buscar" / "Escribe para buscar..." — Select por defecto
- "No hay ligas" — Competiciones vacío
- "Error al cargar {error}" — Competiciones error
- "Error al cargar las ligas: {mensaje}" — Landing error
- "🔌 Sin conexión a internet" / "✅ Conexión restablecida" — NetworkStatusBanner
- "Tu perfil no tiene nombre. Ponte un nombre para que tus compañeros te reconozcan." — AvisoPerfilSinNombre
- "¿Estás seguro?" / "Esta acción no se puede deshacer." / "Confirmar" / "Cancelar" — ConfirmDialog por defecto
- "Abrir menú" / "Cerrar menú" — aria-labels del FAB; "Botón abrir menú lateral" — aria-label de la hamburguesa
- "Pendientes de confirmar" / "Rechazar" / "Confirmar" / "Actualizar" — menú móvil

### 12.2 Perfil, equipos y enfrentamientos


Toasts y mensajes de los hooks de API leídos, con la acción que los dispara:

| Hook / origen | Tipo | Texto literal | Disparador |
|---|---|---|---|
| `useCrearEquipo` | toast.success | `Equipo "{nombre}" creado correctamente` | POST /equipos OK (Crear equipo) |
| `useCrearEquipo` | toast.error | "Error al crear el equipo" | POST /equipos falla |
| `useResponderInvitacion` | toast.success | "Invitación actualizada" | Aceptar/Rechazar invitación en TarjetaEquipo OK |
| `useResponderInvitacion` | toast.error | "Error al actualizar invitación" | PATCH /equipos/invitacion falla |
| `useUpdateMe` | toast.success | "Perfil actualizado" | Guardar cambios en Editar perfil OK |
| `useUpdateMe` | toast.error | "{error.message}" o "Error al actualizar el perfil" | PUT /users/me falla |
| `useProponerResultado` | toast.error | "Ups...{error}" | POST proponer falla |
| `useAceptarResultado` | — | (sin toast en el hook) | — |
| `useRechazarResultado` | — | (sin toast en el hook) | — |
| `useConfirmarResultadoAdmin` | — | (sin toast en el hook) | — |
| `useRechazarResultadoAdmin` | — | (sin toast en el hook) | — |
| BotonIntroducirResultado | toast.success | "Resultado propuesto" | Guardar en "Proponer resultado" OK |
| BotonIntroducirResultado | toast.error | "En todos los partidos, uno de los equipos debe llegar a {goles} goles" | Validación al guardar |
| BotonIntroducirResultado | toast.error | "Ningún equipo puede superar los {goles} goles por partido" | Validación al guardar |
| BotonesUser | toast.success | "Resultado aceptado" | "Aceptar resultado" OK |
| BotonesUser | toast.success | "Resultado rechazado" | "Rechazar" (jugador) OK |
| BotonesAdmin | toast.success | "Resultado confirmado" | "Confirmar resultado" OK |
| BotonesAdmin | toast.success | "Resultado confirmado" [sic, reutilizado] | "Rechazar y reiniciar" OK |
| EnfrentamientosPendientes | toast.success | "Resultado confirmado" | "Confirmar" en panel admin OK |
| EnfrentamientosPendientes | toast.error | "Error al confirmar el resultado" | "Confirmar" en panel admin falla |
| EnfrentamientosPendientes | toast.success | "Resultado rechazado y reiniciado" | "Rechazar" en panel admin OK |
| EnfrentamientosPendientes | toast.error | "Error al rechazar el resultado" | "Rechazar" en panel admin falla |
| MiPerfilPage | toast.success | "Sesión cerrada" | Botón "Salir" |
| EditarPerfilPage | toast.error | "El nombre de usuario debe tener al menos 3 caracteres" | Validación username |
| EditarPerfilPage | toast.error | "El nombre debe tener al menos 2 caracteres" | Validación nombre |
| EditarPerfilPage | toast.error | "Introduce un número de móvil" | Validación móvil |
| CrearEquipoPage | toast.error | "El nombre del equipo es obligatorio" | Validación al crear |
| CrearEquipoPage | toast.error | "Debe haber al menos 2 jugadores por equipo" | Validación al crear |
| CrearEquipoPage | toast.custom (texto crudo) | "No puedes eliminarte del equipo" | Intentar borrar el propio jugador (no admin) |
| CrearEquipoPage | window.alert | "Máximo 3 jugadores por equipo" | Añadir 4º jugador |
| CrearEquipoPage | window.alert | "Ese usuario ya está en el equipo" | Usuario registrado duplicado |
| CrearEquipoPage | window.alert | "Introduce un nombre válido" | Nombre manual vacío |
| CrearEquipoPage | window.alert | "Ese nombre ya está en el equipo" | Nombre manual duplicado |
| TarjetaLiga (abre SelectorEquipoUsuario) | toast.error | "Error al cargar liga" | Inscribirse sin liga cargada |
| InscribirEquipoExistenteForm (usa SelectorEquipo) | toast.error | "No se encontró la liga" / "No se encontró el equipo" / "El equipo ya está en la liga" | "Agregar" (admin) |
| `useWindow` | Error de desarrollo | "useWindow debe usarse dentro de <WindowProvider>" | Uso fuera del provider (no visible al usuario) |

Textos de estado (no toast) reutilizables detectados: "Cargando equipos...", "Cargando ligas...", "Cargando equipo...", "Cargando liga...", "Cargando perfil...", "Cargando...", "Ups... {error}", "Ups... Algo pasó", "Ups... error ligas=undefined", "Ups...Esta liga ya no existe", "Ups... no tienes ningún equipo", "Error al cargar equipos", "No tiene equipos", "No tienes equipos", "No estas inscrito a ninguna competición", "No inscrito a ninguna competición", "Ver competiciones", "Agrega jugadores", "Sin resultados", "Escribe para buscar...", "Escribe el nombre de tu compañero...", "Fecha no especificada", "Ubicación no especificada", "Pendientes de confirmar", "ADMIN", "Tú", "(Tú)", "(Suplente)", "(No registrado)", "Registrado", "Sin cuenta", "PENDIENTE".

### 12.3 Ligas y temporadas


**`src/shared/api/ligas/useLigas.ts`** (toasts react-hot-toast):
- Crear liga (`useCrearLiga`): éxito "Liga creada correctamente" · error "Error al crear la liga".
- Actualizar liga (`useActualizarLiga`, botón "Guardar cambios" en Ajustes): éxito "Liga actualizada" · error "Error al actualizar la liga".
- Eliminar liga (`useEliminarLiga`): éxito "Liga eliminada" · error "Error al eliminar la liga".
- Inscribir equipo (`useInscribirEquipo`, botones "Inscribirme" en layout/TarjetaLiga y "Agregar" en inscribir equipo existente): éxito "Equipo inscrito correctamente" · error "No se pudo inscribir el equipo".
- Aprobar inscripción (`useAprobarInscripcion`, botón "Aceptar" admin): éxito "Inscripción actualizada" · error "Error al actualizar la inscripción".
- Cambiar estado (`useCambiarEstadoLiga`, botones "Arrancar liga"/"Finalizar liga"/"Reanudar liga"): éxito "Estado de la liga actualizado" · error "Error al cambiar el estado de la liga".
- Eliminar equipo de liga (`useEliminarEquipoDeLiga`, botón "Eliminar de la liga"): éxito "Equipo eliminado correctamente" · error "Error al eliminar el equipo de la liga".
- Marcar pagado (`useMarcarPagado`, botón "Marcar pagado"): éxito "Equipo marcado como pagado" · error "Error al marcar como pagado".
- Las queries (`useLigas`, `useLiga`, `useLigaById`, `useGetEquiposLiga`, `useClasificacionLiga`) no emiten toasts.

**`src/shared/api/temporadas/useTemporadas.ts`:**
- Crear (`useCrearTemporada`): "Temporada creada correctamente" · "Error al crear la temporada".
- Actualizar (`useActualizarTemporada`): "Temporada actualizada" · "Error al actualizar la temporada".
- Marcar actual (`useMarcarTemporadaActual`): "Temporada marcada como actual" · "Error al marcar la temporada como actual".
- Eliminar (`useEliminarTemporada`): "Temporada eliminada" · "Error al eliminar la temporada".

**Toasts locales en pantallas de este ámbito:**
- "Error al cargar liga" — DetalleLigaLayout, EquiposLigaPage y TarjetaLiga al pulsar inscribir sin liga cargada.
- "Introduce un nombre válido" — Crear liga, Ajustes, TemporadaForm.
- "Introduce una ubicación válida" / "Esa ubicación ya está añadida" — Crear liga, Ajustes.
- "No se encontró la liga" / "No se encontró el equipo" / "El equipo ya está en la liga" — InscribirEquipoExistenteForm.
- "La fecha de fin debe ser posterior a la de inicio" — TemporadaForm.

**Hooks auxiliares leídos sin copys:** `useIsInscritoALiga` (devuelve si el usuario está en algún equipo de la liga), `useLigasDeUsuario` (filtra ligas del usuario), `useLayerZ` (z-index incremental para overlays, base 1000).

**Copys de componentes compartidos referenciados aquí (visibles en estas pantallas):** `SelectorEquipoUsuario`: "Cargando equipos...", "Error al cargar equipos", "Ups... no tienes ningún equipo", "Crear equipo", "Selecciona tu equipo para inscribirte", "Cancelar", "Inscribirme". `SelectorEquipo`: placeholder "Buscar equipo", opción "Cualquiera". `Window`: título por defecto "Ventana". `ConfirmDialog` por defecto: título "¿Estás seguro?", descripción "Esta acción no se puede deshacer.", confirmar "Confirmar", cancelar "Cancelar". Hook de enfrentamientos (`enfrentamientos/hooks.ts`): error "Ups..." + `{error}`.

---

## 13. Checklist de entrega para el rework

Marcar cada punto antes de dar por terminada una pantalla.

**Por pantalla (las 24 rutas de §3):**
- [ ] Todos los elementos numerados de "Elementos y copys" están presentes y en el mismo orden.
- [ ] Todos los copys son literales (comparar con este documento, incluidos [sic]).
- [ ] Estado de carga, vacío y error diseñados con su texto literal.
- [ ] Validaciones de formulario con cada mensaje literal.
- [ ] Toasts y diálogos de confirmación con su texto literal.
- [ ] Variantes por rol: invitado / usuario / admin (y jugador del equipo o enfrentamiento cuando aplique).
- [ ] Variantes por estado de dominio (liga: sin empezar / en curso / finalizada; equipo en liga: pendiente / aprobado / pendiente de pago; enfrentamiento: sin jugar / corroborar / confirmar / jugado; invitación: pendiente / aceptada / rechazada).
- [ ] Vista móvil (≈ 390px) y desktop (≥ 1024px) con el mismo comportamiento que hoy (menú hamburguesa vs enlaces inline; contenedores centrados con ancho máximo).
- [ ] Navegación saliente idéntica (cada botón, enlace y tarjeta lleva a la misma ruta o efecto).
- [ ] Assets colocados donde indica §10.

**Global:**
- [ ] Shell: header, menú móvil con todos los ítems por rol, badge de pendientes (admin), botón "Actualizar", logo futbolin.app.
- [ ] Banner "perfil sin nombre" y banner de conexión.
- [ ] Sistema de componentes shadcn cubre todas las variantes de §11.1 y §11.2.
- [ ] Todos los iconos de §11.3 tienen su equivalente Lucide con el mismo significado.
- [ ] Todos los copys transversales de §12 aparecen al menos una vez.
- [ ] No se reproduce el código muerto (FAB, Modal/BottomSheet claros, header duplicado) ni se inventan pantallas nuevas salvo, opcionalmente, una 404.

---

**Nota final — código que no debe reproducirse:** existen en el repositorio un header duplicado sin uso (`TopNavCompeticiones`), un botón flotante `FAB` sin uso, un `Modal` y un `BottomSheetDrawer` de panel claro casi sin uso, una variante `ButtonWhatsapp2` sin uso y un guard `RequireAuth` duplicado. No forman parte de la UI real y no hay que diseñarlos.

