// Portado de tp_ig/src/components/PostCard/PostCard.tsx (TP web con Facu Peri):
// misma estructura JSX/StyleSheet, pero acá es un componente CONTROLADO — el
// estado de like vive en PostsContext (así queda sincronizado entre el feed y
// app/post/[id].tsx), no en un useState local como en el original.
// El botón de like va en su propio Pressable anidado, así el sistema de
// gestos de RN lo captura sin que dispare el onPress de la card (no hace
// falta un stopPropagation manual como en el DOM).

import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/colors';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
  liked: boolean;
  likesCount: number;
  onToggleLike: () => void;
  onPress: () => void;
}

export function PostCard({ post, liked, likesCount, onToggleLike, onPress }: PostCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.location}>{post.location}</Text>
        </View>
      </View>

      <Image source={{ uri: post.imageUrl }} style={styles.image} contentFit="cover" />

      <View style={styles.actions}>
        <Pressable hitSlop={8} onPress={onToggleLike} style={styles.actionButton}>
          {liked ? (
            <Ionicons name="heart" size={26} color={Colors.accent} />
          ) : (
            <Feather name="heart" size={24} color={Colors.textPrimary} />
          )}
        </Pressable>
        <Pressable hitSlop={8} onPress={onPress} style={styles.actionButton}>
          <Feather name="message-circle" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Pressable hitSlop={8} style={styles.actionButton}>
          <Feather name="send" size={24} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <Text style={styles.likes}>{likesCount.toLocaleString('es-AR')} Me gusta</Text>

      <Text style={styles.caption}>
        <Text style={styles.username}>{post.username} </Text>
        {post.caption}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
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
    aspectRatio: 1,
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
  },
});
