// Portado de tp_ig/src/components/Profile/Profile.tsx (TP web con Facu Peri):
// mismo fetch independiente a TheCatAPI para la grilla de posts propios, pero
// la grilla pasa de un CSS grid de 3 columnas a un FlatList numColumns={3}
// (requisito del TP mobile) y el username/avatar por post se pisan con los del
// usuario logueado (en el web no importaba porque la grilla no distingue autor).
// Los posts se registran en PostsContext (addPosts) para que al tocar un item
// app/post/[id].tsx los encuentre por :id, igual que a los del feed.

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { MAX_CONTENT_WIDTH } from '@/constants/layout';
import { usePosts } from '@/context/posts-context';
import { PROFILE_CAPTION } from '@/data/mock-content';
import { loggedUser } from '@/data/user';
import { buildPost, fetchCatImages } from '@/services/cat-api';
import type { Post } from '@/types';

const PROFILE_POSTS_COUNT = 6;
const GRID_GAP = 2;
const COLUMN_COUNT = 3;

export default function ProfileScreen() {
  const router = useRouter();
  const { addPosts } = usePosts();
  const [profilePosts, setProfilePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfilePosts() {
      try {
        const images = await fetchCatImages(PROFILE_POSTS_COUNT);
        if (cancelled) return;

        const built = images.map((image, index) => ({
          ...buildPost(image, index, { caption: PROFILE_CAPTION, likesMin: 50, likesMax: 3050 }),
          username: loggedUser.username,
          userAvatar: loggedUser.avatar,
        }));

        setProfilePosts(built);
        addPosts(built);
      } catch {
        if (!cancelled) setError('No se pudieron cargar tus publicaciones.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfilePosts();
    return () => {
      cancelled = true;
    };
  }, [addPosts]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        style={styles.list}
        data={profilePosts}
        keyExtractor={(post) => post.id}
        numColumns={COLUMN_COUNT}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/post/${item.id}`)}
            style={styles.gridItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.gridImage} contentFit="cover" />
          </Pressable>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Image source={{ uri: loggedUser.avatar }} style={styles.avatar} />
              <View style={styles.stats}>
                <Stat label="Publicaciones" value={profilePosts.length} />
                <Stat label="Seguidores" value={loggedUser.followersCount} />
                <Stat label="Seguidos" value={loggedUser.followingCount} />
              </View>
            </View>

            <Text style={styles.fullName}>{loggedUser.fullName}</Text>
            <Text style={styles.username}>@{loggedUser.username}</Text>
            <Text style={styles.bio}>{loggedUser.bio}</Text>

            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar perfil</Text>
            </TouchableOpacity>

            {loading && (
              <ActivityIndicator color={Colors.accent} style={styles.loadingIndicator} />
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value.toLocaleString('es-AR')}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  listContent: {
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  fullName: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 14,
  },
  username: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 1,
  },
  bio: {
    color: Colors.textPrimary,
    fontSize: 13,
    marginTop: 8,
  },
  editButton: {
    marginTop: 14,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  editButtonText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  loadingIndicator: {
    marginTop: 16,
  },
  errorText: {
    color: Colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  list: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  // gap solo entre columnas (no en los bordes) y cada celda con flex 1/3 +
  // aspectRatio 1: tres cuadrados simétricos que ocupan exacto el ancho, sin
  // calcular píxeles con useWindowDimensions ni pasar estilos inline.
  gridRow: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  gridItem: {
    flex: 1 / COLUMN_COUNT,
    aspectRatio: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.bgCard,
  },
});
