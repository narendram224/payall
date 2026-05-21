import '../global.css';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../context/ThemeContext';
import { PortalHost } from '@rn-primitives/portal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { Toaster, toast } from 'react-native-sonner';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      // FIX: Only show toast on the absolute final failure attempt
      if (query.state.status === 'error') {
        const errorMessage =
          error.response?.data?.message || error.message || 'An unexpected error occurred';
        console.log('[QUERY ERROR]', errorMessage);
        // Using setTimeout safely ensures the layout engine catches the toast registration event

        console.log('[Erro]', error);
        console.log('[QUERY]', query);

        setTimeout(() => {
          toast.error(errorMessage);
        }, 0);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || 'An unexpected error occurred';
      console.log('[MUTATION ERROR]', errorMessage);
      console.log('[MUTATION ERROR DATA]', error.response);
      setTimeout(() => {
        toast.error(errorMessage);
      }, 0);
    },
  }),
});

function RootLayoutNav() {
  useProtectedRoute();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="board" options={{ headerShown: false }} />
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ppi" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <SafeAreaProvider>
            <StatusBar style="auto" />
            <RootLayoutNav />
            <PortalHost />
            <Toaster />
          </SafeAreaProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
