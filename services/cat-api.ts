// Portado de la llamada a TheCatAPI que estaba duplicada en Feed.tsx, Stories.tsx
// y Profile.tsx del TP web (con Facu Peri): misma URL, mismo query param `api_key`.
// Acá queda centralizada, y la API key sale de una env var (EXPO_PUBLIC_CAT_API_KEY)
// en vez de estar hardcodeada en el código como en el TP web.

import axios from 'axios';

import { CAPTIONS, LOCATIONS, USERNAMES } from '@/data/mock-content';
import type { CatImage, Post } from '@/types';

const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search';
const CAT_API_KEY = process.env.EXPO_PUBLIC_CAT_API_KEY;

export async function fetchCatImages(limit: number): Promise<CatImage[]> {
  const { data } = await axios.get<CatImage[]>(CAT_API_URL, {
    params: { limit, api_key: CAT_API_KEY },
  });
  return data;
}

interface BuildPostOptions {
  caption?: string;
  likesMin?: number;
  likesMax?: number;
}

// Reemplaza el .map() que en el web estaba repetido en Feed.tsx (likes 100-5100,
// caption rotando) y en Profile.tsx (likes 50-3050, caption fija "Mi gato 🐱").
export function buildPost(image: CatImage, index: number, options: BuildPostOptions = {}): Post {
  const { caption, likesMin = 100, likesMax = 5100 } = options;

  return {
    id: image.id,
    imageUrl: image.url,
    width: image.width,
    height: image.height,
    username: USERNAMES[index % USERNAMES.length],
    userAvatar: `https://i.pravatar.cc/150?img=${index + 1}`,
    location: LOCATIONS[index % LOCATIONS.length],
    caption: caption ?? CAPTIONS[index % CAPTIONS.length],
    likes: Math.floor(Math.random() * (likesMax - likesMin)) + likesMin,
    liked: false,
    date: '2024-06-10',
    comments: [],
  };
}
