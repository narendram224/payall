import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const [isChecking, setIsChecking] = useState(true);
  const [initialRoute, setInitialRoute] = useState<any>('/board');

  useEffect(() => {
    // Check authentication and onboarding status
    const checkAuthStatus = async () => {
      try {
        const [hasCompletedOnboarding, token] = await Promise.all([
          SecureStore.getItemAsync('hasCompletedOnboarding'),
          SecureStore.getItemAsync('access_token'),
        ]);

        if (token) {
          // User is authenticated, go to dashboard
          setInitialRoute('/(tabs)');
        } else if (hasCompletedOnboarding === 'true') {
          // User completed onboarding but not authenticated, go to sign-in
          setInitialRoute('/sign-in');
        } else {
          // New user, show onboarding
          setInitialRoute('/board');
        }
      } catch (error) {
        console.log('Error checking auth status:', error);
        // Default to splash on error
        setInitialRoute('/splash');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isChecking) {
    return null; // or show loading spinner
  }

  return <Redirect href={initialRoute} />;
}
