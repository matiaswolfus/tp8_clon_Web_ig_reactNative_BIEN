import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { Colors } from '@/constants/colors';
import { PostsProvider } from '@/context/posts-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PostsProvider>
        <ThemeProvider value={DarkTheme}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: Colors.bgPrimary },
              headerTintColor: Colors.textPrimary,
            }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="post/[id]"
              options={{ presentation: 'modal', title: 'Publicación' }}
            />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </PostsProvider>
    </SafeAreaProvider>
  );
}
