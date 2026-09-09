// Context API simple (sin Zustand, no hace falta para este alcance) que reemplaza
// el useState de posts que en el TP web vivía en App.tsx/Feed.tsx. Se llena una sola
// vez desde el layout raíz y de acá leen tanto el feed como app/post/[id].tsx, así
// el like y los comentarios quedan sincronizados entre lista y detalle sin tener que
// pasar el Post completo por params de navegación (expo-router solo pasa el :id).

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { buildPost, fetchCatImages } from '@/services/cat-api';
import type { Comment, Post } from '@/types';

const FEED_SIZE = 10;

interface PostsContextValue {
  posts: Post[];
  loading: boolean;
  error: string | null;
  getPost: (id: string) => Post | undefined;
  toggleLike: (id: string) => void;
  addComment: (id: string, comment: Comment) => void;
  addPosts: (newPosts: Post[]) => void;
}

const PostsContext = createContext<PostsContextValue | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      try {
        const images = await fetchCatImages(FEED_SIZE);
        if (cancelled) return;
        setPosts(images.map((image, index) => buildPost(image, index)));
      } catch {
        if (!cancelled) setError('No se pudieron cargar los posts.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  const getPost = useCallback((id: string) => posts.find((post) => post.id === id), [posts]);

  const toggleLike = useCallback((id: string) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  }, []);

  const addComment = useCallback((id: string, comment: Comment) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === id ? { ...post, comments: [...post.comments, comment] } : post
      )
    );
  }, []);

  // Usado por app/profile.tsx: su fetch a TheCatAPI es independiente del feed,
  // pero los posts resultantes se suman acá para que app/post/[id].tsx (que solo
  // conoce el :id de la ruta) pueda encontrarlos con getPost, igual que a los del feed.
  const addPosts = useCallback((newPosts: Post[]) => {
    setPosts((current) => {
      const existingIds = new Set(current.map((post) => post.id));
      const toAdd = newPosts.filter((post) => !existingIds.has(post.id));
      return toAdd.length ? [...current, ...toAdd] : current;
    });
  }, []);

  const value = useMemo<PostsContextValue>(
    () => ({ posts, loading, error, getPost, toggleLike, addComment, addPosts }),
    [posts, loading, error, getPost, toggleLike, addComment, addPosts]
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts debe usarse dentro de un PostsProvider');
  }
  return context;
}
