// Portado de los mocks que estaban repartidos en Feed.tsx, Stories.tsx, Profile.tsx
// y PostModal.tsx del TP web (con Facu Peri). Acá quedan centralizados en un solo lugar
// para que los use services/cat-api.ts al armar los Post.

import type { Comment } from '@/types';

// tp_ig/src/components/Feed/Feed.tsx -> usernames
export const USERNAMES = [
  '@gato_felix',
  '@michilandia',
  '@gatito_lindo',
  '@mr_whiskers',
  '@luna_cat',
  '@simba_real',
  '@nala_gatita',
  '@tom_cat',
  '@whiskers_pro',
  '@michi_rey',
];

// tp_ig/src/components/Feed/Feed.tsx -> captions
export const CAPTIONS = [
  '¡El sol de la tarde es mi favorito! 🌅',
  'Lunes de siesta obligatoria 😴',
  'Nadie me entiende como mi almohada 🐾',
  'El mundo sería mejor con más gatos 🌍',
  'Me desperté hermoso, como siempre ✨',
  'Ocupado siendo adorable 🐱',
  'No me molesten, estoy pensando 🤔',
  'Hoy tampoco tengo ganas de nada 😌',
  'La vida es corta, duerme más 💤',
  'Soy pequeño pero poderoso 💪',
];

// Nuevo: no existía en el TP web. La consigna del TP mobile pide
// "localización simulada" por post, así que se agrega acá.
export const LOCATIONS = [
  'Buenos Aires, Argentina',
  'Palermo, CABA',
  'Villa Crespo, CABA',
  'La Plata, Buenos Aires',
  'Recoleta, CABA',
  'San Telmo, CABA',
  'Belgrano, CABA',
  'Mar del Plata, Argentina',
  'Córdoba, Argentina',
  'Rosario, Argentina',
];

// tp_ig/src/components/Profile/Profile.tsx -> caption fija para los posts del perfil
export const PROFILE_CAPTION = 'Mi gato 🐱';

// tp_ig/src/components/PostModal/PostModal.tsx -> comentariosSimulados
export const INITIAL_COMMENTS: Comment[] = [
  { id: '1', username: '@gato_felix', avatar: 'https://i.pravatar.cc/150?img=11', text: '¡Qué hermoso! 😍', date: 'hace 2h' },
  { id: '2', username: '@michilandia', avatar: 'https://i.pravatar.cc/150?img=12', text: 'Me encanta esta foto 🐾', date: 'hace 3h' },
  { id: '3', username: '@luna_cat', avatar: 'https://i.pravatar.cc/150?img=13', text: 'Demasiado adorable 💕', date: 'hace 5h' },
  { id: '4', username: '@mr_whiskers', avatar: 'https://i.pravatar.cc/150?img=14', text: 'El mejor gato del mundo 🌍', date: 'hace 6h' },
];
