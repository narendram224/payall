import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ImageURISource } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Onboarding from '@/components/onboarding/Onboarding';
import { useAuth } from '@/hooks/useAuth';

const onboardingPages: { text: string; image: ImageURISource }[] = [
  {
    text: 'Trusted by millions of people, part of one part',
    image: require('../assets/onboarding/trust.png'),
  },
  {
    text: 'Spend money abroad, and track your expense',
    image: require('../assets/onboarding/spend.png'),
  },
  {
    text: 'Receive Money From Anywhere In The World',
    image: require('../assets/onboarding/receive.png'),
  },
];

export default function OnboardingScreen() {
  const { setOnboardingComplete } = useAuth();
  const handleGetStarted = async () => {
    try {
      // Mark onboarding as completed
      await setOnboardingComplete();
      // Navigate to sign-in screen
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      // Still navigate even if saving fails
      router.replace('/sign-in');
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <Onboarding pages={onboardingPages} onGetStarted={handleGetStarted} />
    </>
  );
}
