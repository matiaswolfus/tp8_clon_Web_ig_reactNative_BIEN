Ya hecho
✅ Estructura de carpetas + dependencias (axios, expo-linear-gradient) instaladas, boilerplate del template borrado
✅ types/index.ts, data/user.ts, data/mock-content.ts — capa de datos portada del TP web
✅ services/cat-api.ts, constants/colors.ts — API de TheCatAPI + paleta oscura
✅ components/PostCard.tsx — item del feed, con alClickear como prop (navegación la maneja la pantalla, no el componente)
Falta (en este orden)
components/Stories.tsx — círculos con gradiente (expo-linear-gradient), horizontal FlatList
components/Header.tsx — barra superior fija
components/CommentItem.tsx — fila de comentario para el detalle
Navegación y pantallas: app/_layout.tsx (Stack, sin tabs), app/index.tsx (Home), app/profile.tsx, app/post/[id].tsx (modal de detalle)
Assets de sistema: app.json (colores de splash/icono), .env + .env.example + .gitignore (API key de TheCatAPI)
README.md técnico (árbol de app/, componentes/props, hooks, instrucciones)
Verificación final: npx tsc --noEmit, npx expo lint, correr la app y probar el flujo Home → Detalle → Perfil a mano
Dónde está todo
Plan completo con contexto y decisiones de diseño: C:\Users\49194355\.claude\plans\federated-spinning-hamming.md
Este todo list queda guardado en la sesión — cuando vuelvas, decime "seguimos con el plan" y arrancamos por stories.tsx.
