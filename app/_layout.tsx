import { Stack } from "expo-router";
import './globals.css';
import AuthProvider from "../providers/AuthProvider";
import QueryProvider from "../providers/QueryProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="matches/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="tournaments/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="profiles/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="editProfile" options={{ headerShown: false }} />
        </Stack>
      </QueryProvider>
    </AuthProvider>
  );
}
