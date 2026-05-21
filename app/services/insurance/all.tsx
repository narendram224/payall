import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { router } from 'expo-router';
import { ShieldCheck, Clock, BadgePercent } from 'lucide-react-native';

const PLANS = [
  { id: 'bike', emoji: '🏍️', title: 'Bike Insurance', desc: 'Two-wheeler protection', route: '/services/insurance/bike', gradient: ['#f59e0b', '#f97316'] as [string,string] },
  { id: 'car', emoji: '🚗', title: 'Car Insurance', desc: 'Four-wheeler coverage', route: '/services/insurance/car', gradient: ['#3b82f6', '#6366f1'] as [string,string] },
  { id: 'health', emoji: '❤️‍🩹', title: 'Health Insurance', desc: 'Medical protection', route: '/services/insurance/health', gradient: ['#10b981', '#059669'] as [string,string] },
  { id: 'life', emoji: '🛡️', title: 'Life Insurance', desc: 'Family security', route: '/services/insurance/life', gradient: ['#ec4899', '#f43f5e'] as [string,string] },
];

const BENEFITS = [
  { icon: <ShieldCheck size={20} color="#10b981" />, title: 'Instant Policy', desc: 'Get policy in minutes' },
  { icon: <BadgePercent size={20} color="#3b82f6" />, title: 'Best Rates', desc: 'Compare 20+ insurers' },
  { icon: <Clock size={20} color="#f59e0b" />, title: '24/7 Support', desc: 'Always here for you' },
];

export default function InsuranceHub() {
  const reducedMotion = useReducedMotion();
  return (
    <View className="flex-1 bg-background">
      <LinearGradient colors={['#10b981', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-4 pb-8 pt-4">
        <Text className="text-xl font-bold text-white">Insurance</Text>
        <Text className="mt-0.5 text-sm text-white/70">Protect what matters most</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mb-6 flex-row flex-wrap gap-3">
          {PLANS.map((p, i) => (
            <Animated.View key={p.id} entering={reducedMotion ? undefined : FadeInDown.delay(i * 80).duration(300)} style={{ width: '47%' }}>
              <Pressable onPress={() => router.push(p.route as any)} className="overflow-hidden rounded-2xl">
                <LinearGradient colors={p.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-5">
                  <Text className="mb-3 text-4xl">{p.emoji}</Text>
                  <Text className="text-base font-bold text-white">{p.title}</Text>
                  <Text className="mt-0.5 text-xs text-white/70">{p.desc}</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(400).duration(300)} className="rounded-2xl border border-border bg-card p-5">
          <Text className="mb-4 text-base font-bold text-foreground">Why Buy with Pay2All?</Text>
          {BENEFITS.map((b, i) => (
            <View key={i} className="mb-3 flex-row items-start gap-3 last:mb-0">
              <View className="mt-0.5 h-8 w-8 items-center justify-center rounded-xl bg-muted">{b.icon}</View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-foreground">{b.title}</Text>
                <Text className="text-xs text-muted-foreground">{b.desc}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
