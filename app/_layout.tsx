// Navegación por Stack (pantallas apiladas, con botón de "volver" automático)
// en vez de la barra de tabs de abajo que usaba antes expo-router con Tabs.
// Como ya no hay tab bar para ir de Home a Perfil, se agrega un botón en el
// header de Home (el ícono de usuario) que navega a /profile con router.push.

import { Feather } from '@expo/vector-icons';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable } from 'react-native';
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
              headerStyle: { backgroundColor: Colors.bgPrimary },
              headerTintColor: Colors.textPrimary,
            }}>
            <Stack.Screen
              name="index"
              options={{
                title: 'Home',
                // Botón para ir al perfil, ocupa el lugar que antes tenía el tab de Perfil.
                headerRight: () => (
                  <Pressable onPress={() => router.push('/profile')} hitSlop={8}>
                    <Feather name="user" size={22} color={Colors.textPrimary} />
                  </Pressable>
                ),
              }}
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
