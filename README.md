"# Clon Móvil de Instagram con React Native y Expo"

Trabajo práctico que migra la lógica del [TP web anterior](https://github.com/matiaswolfus/Clon-web-de-Instagram) (React + Vite) a React Native con Expo, replicando la interfaz de la app móvil de Instagram y consumiendo imágenes de gatos desde **The Cat API** para simular el feed.

## Autores

- Matías Wolfus
- Facundo Peri

## Diseño de referencia

⚠️ **Pendiente**: la consigna pide adjuntar el link a un diseño de Figma de la app **móvil** de Instagram (o capturas equivalentes). El TP web anterior usaba [este Figma](https://www.figma.com/design/TTNE1wmchdicfaywK2yrtx/İnstagram-Modern-Web-Design--Community-), pero es un diseño *web*, no mobile — no aplica 1:1 acá. La referencia visual real usada para maquetar fue la app oficial de Instagram para celulares (memoria/capturas propias). Antes de entregar, reemplazar este bloque por el link de Figma mobile o las capturas que se vayan a adjuntar.

## Cómo ejecutar el proyecto

```bash
git clone https://github.com/matiaswolfus/tp8_clon_Web_ig_reactNative_BIEN
cd tp8_clon_Web_ig_reactNative_BIEN
npm install
npx expo start
```

Desde la terminal que abre `expo start` se puede:
- Escanear el QR con la app **Expo Go** (Android/iOS) para correrlo en un celular real.
- Apretar `a` / `i` para abrirlo en un emulador Android / simulador iOS.
- Apretar `w` para abrirlo en el navegador (usa `react-native-web`; sirve para previsualizar rápido, pero el target real de este TP es mobile).

Hace falta una API key de [TheCatAPI](https://thecatapi.com/) en `EXPO_PUBLIC_CAT_API_KEY` (ver `.env.example`).

## Árbol de `app/` (rutas de expo-router)

```
app/
├── _layout.tsx        # Stack raíz: registra las 3 rutas, tema oscuro, StatusBar y el PostsProvider
├── index.tsx           # Home ("/"): feed principal
├── profile.tsx          # Perfil ("/profile"): datos del usuario + grilla 3 columnas
└── post/
    └── [id].tsx          # Detalle ("/post/:id"), presentado como modal
```

Expo Router usa el sistema de archivos como router: cada archivo dentro de `app/` es una pantalla, y `[id].tsx` es una ruta dinámica que recibe el parámetro por `useLocalSearchParams`. No hay bottom tabs: la navegación es un `Stack` (`@react-navigation/native` por debajo), y el acceso a `/profile` se resuelve con el ícono de usuario del header propio de Home (`components/Header.tsx`, que hace `router.push('/profile')`; el header nativo del Stack está oculto en esa pantalla) en vez de una tab bar — decisión tomada porque la consigna solo exige un Stack Navigator o una presentación modal para el detalle, no específicamente tabs.

## Componentes y su responsabilidad

**`app/_layout.tsx`**: raíz de navegación. Define el `Stack` con las 3 pantallas, fuerza tema oscuro (`DarkTheme` + `userInterfaceStyle: "dark"` en `app.json`), configura la `StatusBar` en modo claro y envuelve todo en `PostsProvider` para que el estado de posts esté disponible en cualquier pantalla.

**`app/index.tsx` (Home)**: pantalla del feed. Lee `posts`/`loading`/`error` de `PostsContext` (no hace fetch propio) y los renderiza con `FlatList` — nunca `.map()`, por la restricción de rendimiento de la consigna. `ListHeaderComponent` es `Stories`, así las historias quedan arriba del feed sin usar otro scroll. Al tocar un post navega a `/post/:id` con `router.push`.

**`app/post/[id].tsx` (Detalle)**: se abre como modal (`presentation: 'modal'` en `_layout.tsx`) al tocar un post desde el Home o el Perfil. Lee el `:id` de la ruta con `useLocalSearchParams`, busca el post en `PostsContext` (`getPost`) y renderiza imagen en alta definición, likes interactivos, lista de comentarios (`FlatList`, con la cabecera del post como `ListHeaderComponent`) y un input para publicar un comentario nuevo.

**`app/profile.tsx` (Perfil)**: hace su **propio fetch** a TheCatAPI (independiente del feed, como pide la consigna), trae 6 imágenes y las convierte en posts con el username/avatar del usuario logueado. Los muestra en una grilla con `FlatList numColumns={3}` (no CSS grid, es RN): cada celda tiene `flex: 1/3` y `aspectRatio: 1`, y `columnWrapperStyle` pone el `gap` solo entre columnas, así quedan tres cuadrados simétricos sin desbordar y sin estilos inline. Cada post del perfil se registra también en `PostsContext` (`addPosts`) para que, al tocarlo, `/post/:id` lo pueda encontrar igual que a los del feed. Incluye avatar, nombre, bio, stats (publicaciones/seguidores/seguidos) y un botón "Editar perfil" sin funcionalidad real (visual, como pide la consigna).

**`components/Header.tsx`**: barra superior propia del Home (logo, íconos y buscador). No recibe props; el ícono de usuario es un `Pressable` que navega a `/profile`.

**`components/PostCard.tsx`**: item de una publicación del feed. Recibe `post`, `DiMegusta` (si el usuario le dio like), `cantidadLikes`, y dos callbacks (`alTocarLike`, `alClickear`) — es un componente **controlado**: no maneja su propio estado de like, así queda sincronizado entre el feed y el detalle a través de `PostsContext`.

**`components/CommentItem.tsx`**: fila de un comentario, usada como `renderItem` de la `FlatList` de comentarios en el detalle. Recibe `comentario: Comment` por props.

**`components/Stories.tsx`**: fila horizontal de historias (`FlatList horizontal`) con anillo de gradiente (`expo-linear-gradient`). Hace su propio fetch a TheCatAPI (8 imágenes) en un `useEffect` al montarse, independiente del feed y del perfil.

## Estado: qué vive dónde y con qué hook

**Global (`context/posts-context.tsx`, `PostsProvider`, montado en `_layout.tsx`)**:
- `posts: Post[]` — todos los posts conocidos (los 10 del feed + los que va sumando el perfil). Se carga una vez con `useEffect` + `useState` al montar el provider.
- `loading` / `error` — estado del fetch inicial del feed.
- `toggleLike(id)` — togglea like y ajusta el contador; lo usan tanto `PostCard` (feed) como el detalle, por eso vive acá y no en cada componente.
- `addComment(id, comment)` — agrega un comentario a un post.
- `addPosts(newPosts)` — mergea posts nuevos (sin duplicar por `id`); lo usa `app/profile.tsx` para que sus 6 posts propios sean encontrables desde el detalle.
- Expuesto vía `usePosts()`, un hook custom sobre `useContext`.

**Local por pantalla**:
- `app/profile.tsx`: `profilePosts` (los 6 posts del perfil, separados de los del feed para poder pintarlos en la grilla sin depender del orden dentro de `posts`), `loading`, `error` — cargados con `useEffect` en el mount de la pantalla.
- `app/post/[id].tsx`: `commentText` (`useState`) para el input controlado de comentario nuevo.
- `components/Stories.tsx`: `stories`, `loading`, `error` (`useState` + `useEffect`) — fetch propio, no toca el contexto.

**Hooks usados**: `useState` y `useEffect` (fetch al montar en `Stories`, `PostsProvider` y `profile.tsx`), `useContext` (vía `usePosts`), `useCallback`/`useMemo` (en `PostsContext`, para no recrear funciones/objeto de valor en cada render), y los hooks de `expo-router` (`useRouter`, `useLocalSearchParams`).

## Consumo de la API

**The Cat API** vía **Axios**, centralizado en `services/cat-api.ts` (`fetchCatImages(limit)`), con la key en `EXPO_PUBLIC_CAT_API_KEY`. `buildPost(image, index, options)` arma un `Post` completo a partir de una imagen + metadata simulada (username, avatar, ubicación, caption, likes). Se usa con distintos límites según la pantalla: 8 en `Stories`, 10 en el feed (`PostsProvider`), 6 en `profile.tsx`.

## Notas de diseño / decisiones tomadas

- **Ancho de contenido capado (`constants/layout.ts`, `MAX_CONTENT_WIDTH`)**: en un celular real esto no hace nada (nunca se llega a ese ancho). Solo evita que la UI se estire horizontalmente al previsualizar con Expo Web en una ventana de escritorio ancha.
- **Tema fijo oscuro**: no hay variante light, igual que en el TP web (`constants/colors.ts`).
- Los íconos de app/splash/adaptive-icon (`assets/images/`) se generaron para este proyecto (gradiente + glifo de cámara), reemplazando los defaults del template de Expo.
