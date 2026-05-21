import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

const BILL_CATEGORIES = [
  {
    id: 'electricity',
    title: 'Electricity',
    subtitle: 'Pay your power bill',
    route: '/services/billing/electricity',
    gradient: ['#f59e0b', '#f97316'] as [string, string],
    emoji: '⚡',
  },
  {
    id: 'water',
    title: 'Water',
    subtitle: 'Pay your water bill',
    route: '/services/billing/water',
    gradient: ['#3b82f6', '#06b6d4'] as [string, string],
    emoji: '💧',
  },
  {
    id: 'gas',
    title: 'Gas',
    subtitle: 'Piped gas bill',
    route: '/services/billing/gas',
    gradient: ['#8b5cf6', '#a855f7'] as [string, string],
    emoji: '🔥',
  },
  {
    id: 'broadband',
    title: 'Broadband',
    subtitle: 'Internet bill payment',
    route: '/services/billing/broadband',
    gradient: ['#06b6d4', '#3b82f6'] as [string, string],
    emoji: '📶',
  },
  {
    id: 'cable',
    title: 'Cable TV',
    subtitle: 'Cable subscription',
    route: '/services/billing/cable',
    gradient: ['#ec4899', '#f43f5e'] as [string, string],
    emoji: '📺',
  },
  {
    id: 'landline',
    title: 'Landline',
    subtitle: 'Landline & telephone',
    route: '/services/billing/landline',
    gradient: ['#14b8a6', '#06b6d4'] as [string, string],
    emoji: '☎️',
  },
  {
    id: 'lpg',
    title: 'LPG Gas',
    subtitle: 'Cylinder booking',
    route: '/services/billing/lpg',
    gradient: ['#f97316', '#ef4444'] as [string, string],
    emoji: '🫙',
  },
  {
    id: 'credit-card',
    title: 'Credit Card',
    subtitle: 'Card bill payment',
    route: '/services/billing/credit-card',
    gradient: ['#6366f1', '#8b5cf6'] as [string, string],
    emoji: '💳',
  },
];

export default function AllBills() {
  const reducedMotion = useReducedMotion();

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pb-6 pt-4"
      >
        <Text className="text-xl font-bold text-white">Bill Payments</Text>
        <Text className="mt-1 text-sm text-white/70">Pay all your bills in one place</Text>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-row flex-wrap gap-3">
          {BILL_CATEGORIES.map((cat, i) => (
            <Animated.View
              key={cat.id}
              entering={reducedMotion ? undefined : FadeInDown.delay(i * 60).duration(300)}
              style={{ width: '47%' }}
            >
              <Pressable
                onPress={() => router.push(cat.route as any)}
                className="overflow-hidden rounded-2xl"
              >
                <LinearGradient
                  colors={cat.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="p-4"
                >
                  <Text className="mb-2 text-3xl">{cat.emoji}</Text>
                  <Text className="text-base font-bold text-white">{cat.title}</Text>
                  <Text className="mt-0.5 text-xs text-white/70">{cat.subtitle}</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
