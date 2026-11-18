import { loadSession, useAuth } from "@/store/authStore";
import { loadFavorites } from "@/store/favoritesStore";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { ready, token } = useAuth();

  // Primero recuperamos la sesión guardada
  useEffect(() => {
    loadSession().catch(() => {});
  }, []);

  // Solo cargamos favoritos si existe una sesión
  useEffect(() => {
    if (ready && token) {
      loadFavorites().catch(() => {});
    }
  }, [ready, token]);

  // Mientras comprobamos si existe una sesión guardada
  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F4F6F8",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#166534" />
      </View>
    );
  }

  return (
    <>
      <Stack>
        {/* Inicio */}
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />

        {/* Login */}
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />

        {/* Aplicación principal */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Detalle de planta */}
        <Stack.Screen
          name="plant/[id]"
          options={{ headerShown: false }}
        />

        {/* Chat */}
        <Stack.Screen
          name="chat"
          options={{ headerShown: false }}
        />
      </Stack>

      <StatusBar style="dark" />
    </>
  );
}