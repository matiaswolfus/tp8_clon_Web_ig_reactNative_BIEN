// components/Stories.tsx
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchCatImages } from '../services/cat-api';
import { USERNAMES } from '../data/mock-content';
import { Colors } from '../constants/colors';
import type { CatImage } from '../types';

const STORIES_COUNT = 8;
const RING_SIZE = 68;
const RING_THICKNESS = 2.5;

interface Story {
  id: string;
  imageUrl: string;
  username: string;
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadStories = async () => {
      try {
        const images = await fetchCatImages(STORIES_COUNT);
        if (!isMounted) return;

        const mapped: Story[] = images.map((image: CatImage, index: number) => ({
          id: image.id,
          imageUrl: image.url,
          username: USERNAMES[index] ?? `@usuario_${index}`,
        }));

        setStories(mapped);
      } catch {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadStories();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  // Si falla la carga de historias, no rompemos el feed: se oculta el bloque.
  if (error || stories.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <StoryItem story={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

function StoryItem({ story }: { story: Story }) {
  return (
    <View style={styles.item}>
      <LinearGradient
        colors={[Colors.accent, '#f9ce34', Colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ring}
      >
        <View style={styles.ringInner}>
          <Image
            source={{ uri: story.imageUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={150}
          />
        </View>
      </LinearGradient>
      <Text style={styles.username} numberOfLines={1}>
        {story.username}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgPrimary,
    paddingVertical: 12,
  },
  centered: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
    gap: 14,
  },
  item: {
    width: RING_SIZE + 8,
    alignItems: 'center',
  },
  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    padding: RING_THICKNESS,
  },
  ringInner: {
    flex: 1,
    borderRadius: RING_SIZE / 2,
    backgroundColor: Colors.bgPrimary,
    padding: 2,
  },
  avatar: {
    flex: 1,
    borderRadius: RING_SIZE / 2,
    backgroundColor: Colors.bgCard,
  },
  username: {
    marginTop: 6,
    fontSize: 11,
    color: Colors.textSecondary,
    maxWidth: RING_SIZE + 8,
    textAlign: 'center',
  },
});