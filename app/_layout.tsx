import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useUserStore } from "@/store/userStore";
import { trpc, trpcClient } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// This component handles the initial routing based on onboarding status
function InitialLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { preferences } = useUserStore();
  
  useEffect(() => {
    // Only run this effect when the segments are available
    if (segments.length > 0) {
      const inAuthGroup = segments[0] === "(tabs)";
      
      // If onboarding is not completed and user is trying to access the main app
      if (!preferences.onboardingCompleted && inAuthGroup) {
        // Use router.replace instead of navigate to replace the current route
        router.replace("/onboarding");
      }
    }
  }, [segments, preferences.onboardingCompleted]);
  
  return <RootLayoutNav />;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <InitialLayout />
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="recipe/[id]" options={{ headerShown: true, title: "" }} />
      <Stack.Screen name="scan" options={{ presentation: "modal", headerShown: false }} />
      <Stack.Screen name="ingredients" options={{ presentation: "modal", headerShown: true, title: "Ingredients" }} />
      <Stack.Screen name="shopping-list" options={{ headerShown: true, title: "Shopping List" }} />
    </Stack>
  );
}