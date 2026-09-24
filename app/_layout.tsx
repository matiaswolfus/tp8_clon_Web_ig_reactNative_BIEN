// Navegación por Stack (pantallas apiladas, con botón de "volver" automático)
// en vez de la barra de tabs de abajo que usaba antes expo-router con Tabs.
// Como ya no hay tab bar para ir de Home a Perfil, el ícono de usuario dentro
// de components/Header.tsx navega a /profile con router.push.

import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { Colors } from '@/constants/colors';
import { PostsProvider } from '@/context/posts-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PostsProvider>
        <ThemeProvider value={DarkTheme}>
          <Stack
            screenOptions={{
              headerStyle: styles.header,
              headerTintColor: Colors.textPrimary,
            }}>
            <Stack.Screen
              name="index"
              // Home usa su propio header (components/Header.tsx) en vez del nativo del
              // Stack, así que se oculta acá para no duplicar la barra superior.
              options={{ headerShown: false }}
            />
            <Stack.Screen name="profile" options={{ title: 'Perfil' }} />
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

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.bgPrimary,
  },
});
