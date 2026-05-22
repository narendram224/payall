import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export function useProtectedRoute() {
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();
  const segments = useSegments();    
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inBoard = segments[0] === 'board';
    const inSignIn = segments[0] === 'sign-in';
    const isRoot = segments.length === 0 || segments[0] === 'index';
    console.log("Segments",segments);
    console.log("hasCompleted",hasCompletedOnboarding);
    console.log("isAuth",isAuthenticated);

    
    

    if (!isAuthenticated) {
      if (hasCompletedOnboarding) {
        // User is not authenticated but has completed onboarding, force them to sign-in
        if (inAuthGroup || inBoard || isRoot) {
          router.replace('/sign-in');
        }
      } else {
        // User is not authenticated and hasn't completed onboarding, force them to board
        if (!inBoard) {
          router.replace('/board');
        }
      }
    } else {
      // User is authenticated
      if (inBoard || inSignIn || isRoot) {
        // Redirect away from onboarding, sign-in, or root to the tabs
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, isLoading, segments, router]);
}
