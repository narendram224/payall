import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Wallet, TrendingUp, Shield, Smartphone, ArrowRight } from 'lucide-react-native';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Secure Payments',
    description: 'Bank-level security for all your transactions',
    icon: <Shield size={80} color="#ffffff" />,
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 2,
    title: 'Smart Finance',
    description: 'Track expenses and manage your money wisely',
    icon: <TrendingUp size={80} color="#ffffff" />,
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    id: 3,
    title: 'Quick Transfers',
    description: 'Send money instantly to anyone, anywhere',
    icon: <Smartphone size={80} color="#ffffff" />,
    gradient: ['#4facfe', '#00f2fe'],
  },
  {
    id: 4,
    title: 'Digital Wallet',
    description: 'Your all-in-one payment solution',
    icon: <Wallet size={80} color="#ffffff" />,
    gradient: ['#43e97b', '#38f9d7'],
  },
];

export default function SplashScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;

  // Check if user has completed onboarding
  const checkOnboardingStatus = useCallback(async () => {
    try {
      const hasCompletedOnboarding = await getItemAsync('hasCompletedOnboarding');
      if (hasCompletedOnboarding === 'true') {
        router.replace('/(tabs)');
        return;
      }
    } catch (error) {
      console.log('Error checking onboarding status:', error);
    }
  }, [router]);

  // Mark onboarding as complete
  const completeOnboarding = useCallback(async () => {
    try {
      await setItemAsync('hasCompletedOnboarding', 'true');
    } catch (error) {
      console.log('Error saving onboarding status:', error);
    }
  }, []);

  // Simple storage helpers (temporary solution)
  const getItemAsync = async (key: string): Promise<string | null> => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  };

  const setItemAsync = async (key: string, value: string): Promise<void> => {
    try {
      return Promise.resolve(localStorage.setItem(key, value));
    } catch {
      return Promise.resolve();
    }
  };

  const animateIcon = useCallback(() => {
    Animated.sequence([
      Animated.timing(iconAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(iconAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      iconAnim.addListener(({ value }) => {
        if (value === 0) {
          animateIcon();
        }
      });
    });
  }, [iconAnim]);

  useEffect(() => {
    // Check if user has already completed onboarding
    checkOnboardingStatus();

    // Initial entrance animation
    const startAnimations = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        animateIcon();
      });
    };

    startAnimations();
  }, [fadeAnim, slideAnim, scaleAnim, animateIcon, checkOnboardingStatus]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      // Animate out current step
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep + 1);
        // Animate in next step
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      // Complete onboarding and navigate to dashboard
      completeOnboarding().then(() => {
        router.replace('/(tabs)');
      });
    }
  };

  const handleSkip = () => {
    router.push('/sign-in');
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <View className="flex-1">
      <LinearGradient
        colors={currentStepData.gradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1">
        <View className="flex-1 justify-between px-8 pb-12 pt-20">
          {/* Skip Button */}
          <View className="items-end">
            <TouchableOpacity onPress={handleSkip} className="opacity-70">
              <Text className="text-lg font-medium text-white">GUllu</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <Animated.View
            style={[
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
            className="flex-1 items-center justify-center">
            {/* Icon with animation */}

            {/* Title and Description */}
            <Text className="mb-4 text-center text-4xl font-bold text-white">
              {currentStepData.title}
            </Text>
            <Text className="text-center text-lg leading-relaxed text-white/90">
              {currentStepData.description}
            </Text>
          </Animated.View>

          {/* Bottom Section */}
          <View className="space-y-6">
            {/* Progress Dots */}
            <View className="flex-row justify-center space-x-2">
              {onboardingSteps.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 rounded-full ${
                    index === currentStep ? 'w-8 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </View>

            {/* Next Button */}
            <TouchableOpacity
              onPress={handleNext}
              className="flex-row items-center justify-center space-x-2 rounded-full bg-white/20 p-4 backdrop-blur-sm">
              <Text className="text-lg font-semibold text-white">
                {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <ArrowRight size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
