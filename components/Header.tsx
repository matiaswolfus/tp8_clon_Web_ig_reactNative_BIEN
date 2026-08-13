// Portado de tp_ig/src/components/header/Header.tsx (TP web con Facu Peri).
// En el original todo entra en una sola fila (logo, buscador de 280px fijo,
// nav con iconos y botón "New Post" con texto) porque en desktop sobra ancho.
// En un celular no entra todo junto, así que acá se arma en dos filas: arriba
// logo + iconos de acción, abajo el buscador ocupando todo el ancho. Los
// <svg> inline del original se reemplazan por @expo/vector-icons
// (Feather/Ionicons), que ya se usa en el resto del proyecto (ver PostCard.tsx).
// El botón "New Post" con texto se achica a un ícono "+" dentro de un círculo
// con borde accent, porque el texto completo no entra al lado de los demás iconos.

import { Feather, Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/colors';

export function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.fila}>
        {/* Logo */}
        <View style={styles.logo}>
          <Ionicons name="logo-instagram" size={26} color={Colors.textPrimary} />
          <Text style={styles.logoTexto}>Instagram</Text>
        </View>

        {/* Navegación (botones decorativos, sin funcionalidad todavía) */}
        <View style={styles.nav}>
          <Feather name="settings" size={20} color={Colors.textSecondary} />
          <Feather name="camera" size={20} color={Colors.textSecondary} />
          <Feather name="send" size={20} color={Colors.textSecondary} />
          <View style={styles.nuevaPublicacion}>
            <Feather name="plus" size={16} color={Colors.accent} />
          </View>
        </View>
      </View>

      {/* Buscador */}
      <View style={styles.buscador}>
        <Feather name="search" size={14} color={Colors.textSecondary} />
        <TextInput
          placeholder="Username, hashtag and story search"
          placeholderTextColor={Colors.textSecondary}
          style={styles.buscadorInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoTexto: {
    fontSize: 22,
    fontWeight: '700',
    fontStyle: 'italic',
    color: Colors.textPrimary,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  nuevaPublicacion: {
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderRadius: 14,
    padding: 4,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 6,
  },
  buscadorInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
    padding: 0,
  },
});
