// Fila individual de comentario, usada dentro de la FlatList de comentarios
// en app/post/[id].tsx. No tiene equivalente propio en el TP web: ahí los
// comentarios se pintaban inline dentro de PostModal.tsx (.map con un <div>),
// pero acá se separa en su propio componente porque FlatList necesita un
// renderItem, no un .map directo dentro del JSX.

import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import type { Comment } from '@/types';

interface PropiedadesComentario {
  comentario: Comment;
}

export function CommentItem({ comentario }: PropiedadesComentario) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: comentario.avatar }} style={styles.avatar} />
      <View style={styles.body}>
        <Text style={styles.text}>
          <Text style={styles.username}>{comentario.username} </Text>
          {comentario.text}
        </Text>
        <Text style={styles.date}>{comentario.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  body: {
    flex: 1,
  },
  text: {
    color: Colors.textPrimary,
    fontSize: 13,
  },
  username: {
    fontWeight: '600',
  },
  date: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
});
