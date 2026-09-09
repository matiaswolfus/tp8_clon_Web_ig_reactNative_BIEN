// Portado de tp_ig/src/Types/index.ts (TP web con Facu Peri), adaptado a RN:
// se le suma `location` a Post (localización simulada, la pide la consigna del TP mobile)
// y se saca AppView porque ahora la navegación la maneja expo-router, no un useState.

// ─── The Cat API ───────────────────────────────────────────
export interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

// ─── Post enriquecido (CatImage + metadata simulada) ───────
export interface Post {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  username: string;
  userAvatar: string;
  location: string;
  caption: string;
  likes: number;
  liked: boolean;
  date: string;
  comments: Comment[];
}

// ─── Comentario ────────────────────────────────────────────
export interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  date: string;
}

// ─── Usuario logueado ──────────────────────────────────────
export interface User {
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  followersCount: number;
  followingCount: number;
}
