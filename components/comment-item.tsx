import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import type { Comment } from '@/types';

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: comment.avatar }} style={styles.avatar} />
      <View style={styles.body}>
        <Text style={styles.text}>
          <Text style={styles.username}>{comment.username} </Text>
          {comment.text}
        </Text>
        <Text style={styles.date}>{comment.date}</Text>
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
