import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import Stories from '@/components/Stories';
import { Colors } from '@/constants/colors';
import { MAX_CONTENT_WIDTH } from '@/constants/layout';
import { usePosts } from '@/context/posts-context';

export default function FeedScreen() {
  const { posts, loading, error, toggleLike } = usePosts();
  const router = useRouter();

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Header />
        <ActivityIndicator color={Colors.accent} size="large" style={styles.centeredIndicator} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Header />
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header />
      <FlatList
        style={styles.list}
        data={posts}
        keyExtractor={(post) => post.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            DiMegusta={item.liked}
            cantidadLikes={item.likes}
            alTocarLike={() => toggleLike(item.id)}
            alClickear={() => router.push(`/post/${item.id}`)}
          />
        )}
        ListHeaderComponent={Stories}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  list: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  centeredIndicator: {
    flex: 1,
  },
  errorText: {
    flex: 1,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 24,
  },
});
