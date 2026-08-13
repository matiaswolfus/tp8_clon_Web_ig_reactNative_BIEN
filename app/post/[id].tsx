// Portado de tp_ig/src/components/PostModal/PostModal.tsx (TP web con Facu Peri),
// convertido de modal por estado a ruta de expo-router (presentation: 'modal'
// configurado en app/_layout.tsx). El like y los comentarios salen de
// PostsContext en vez de useState local, así quedan sincronizados con el feed
// y persisten si volvés a entrar al mismo post.

import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommentItem } from '@/components/CommentItem';
import { Colors } from '@/constants/colors';
import { usePosts } from '@/context/posts-context';
import { loggedUser } from '@/data/user';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, getPost, toggleLike, addComment } = usePosts();
  const [commentText, setCommentText] = useState('');

  const post = getPost(id);

  if (loading && !post) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator color={Colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.notFoundText}>No encontramos esta publicación.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { liked, likes: likesCount } = post;

  const handleSubmitComment = () => {
    const text = commentText.trim();
    if (!text) return;

    addComment(post.id, {
      id: Date.now().toString(),
      username: loggedUser.username,
      avatar: loggedUser.avatar,
      text,
      date: 'ahora',
    });
    setCommentText('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={post.comments}
          keyExtractor={(comment) => comment.id}
          renderItem={({ item }) => <CommentItem comentario={item} />}
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
                <View>
                  <Text style={styles.username}>{post.username}</Text>
                  <Text style={styles.location}>{post.location}</Text>
                </View>
              </View>

              <Image
                source={{ uri: post.imageUrl }}
                style={[styles.image, { aspectRatio: post.width / post.height }]}
                contentFit="cover"
              />

              <View style={styles.actions}>
                <Pressable
                  hitSlop={8}
                  onPress={() => toggleLike(post.id)}
                  style={styles.actionButton}>
                  {liked ? (
                    <Ionicons name="heart" size={26} color={Colors.accent} />
                  ) : (
                    <Feather name="heart" size={24} color={Colors.textPrimary} />
                  )}
                </Pressable>
              </View>

              <Text style={styles.likes}>{likesCount.toLocaleString('es-AR')} Me gusta</Text>

              <Text style={styles.caption}>
                <Text style={styles.username}>{post.username} </Text>
                {post.caption}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.commentInputRow}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Agregá un comentario..."
            placeholderTextColor={Colors.textSecondary}
            style={styles.commentInput}
          />
          <TouchableOpacity onPress={handleSubmitComment} disabled={!commentText.trim()}>
            <Text style={[styles.publishText, !commentText.trim() && styles.publishTextDisabled]}>
              Publicar
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  notFoundText: {
    color: Colors.textPrimary,
    fontSize: 15,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.bgCard,
  },
  backButtonText: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  username: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  location: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  image: {
    width: '100%',
    backgroundColor: Colors.bgCard,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  actionButton: {
    padding: 2,
  },
  likes: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 12,
    marginTop: 6,
  },
  caption: {
    color: Colors.textPrimary,
    fontSize: 13,
    paddingHorizontal: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 12,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  commentInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  publishText: {
    color: Colors.accent,
    fontWeight: '600',
    fontSize: 13,
  },
  publishTextDisabled: {
    opacity: 0.4,
  },
});
