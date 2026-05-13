import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/sign-in');
    } else if (isAuthenticated && segments[0] === 'sign-in') {
      // Redirect to the tabs page if already authenticated and trying to sign in.
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);
}
