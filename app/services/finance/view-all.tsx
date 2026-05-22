import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { router } from 'expo-router';

const SERVICES = [
  { id: 'dmt', emoji: '💸', title: 'DMT', desc: 'Domestic Money Transfer', route: '/dmt', gradient: ['#3b82f6', '#6366f1'] as [string,string] },
  { id: 'payout', emoji: '🏦', title: 'Payout', desc: 'UPI & Bank Transfer', route: '/services/finance/payout', gradient: ['#10b981', '#3b82f6'] as [string,string] },
  { id: 'loan', emoji: '💰', title: 'Instant Loan', desc: 'Quick personal loans', route: '/services/finance/loan', gradient: ['#f59e0b', '#f97316'] as [string,string] },
  { id: 'car-loan', emoji: '🚗', title: 'Car Loan', desc: 'Vehicle financing', route: '/services/finance/car-loan', gradient: ['#f97316', '#ef4444'] as [string,string] },
  { id: 'emi', emoji: '🧮', title: 'EMI Calculator', desc: 'Plan your repayment', route: '/services/finance/emi', gradient: ['#6366f1', '#8b5cf6'] as [string,string] },
  { id: 'gold', emoji: '🥇', title: 'Digital Gold', desc: 'Invest in 24K gold', route: '/services/finance/gold', gradient: ['#f59e0b', '#fbbf24'] as [string,string] },
  { id: 'silver', emoji: '🥈', title: 'Digital Silver', desc: 'Invest in silver', route: '/services/finance/silver', gradient: ['#94a3b8', '#64748b'] as [string,string] },
  { id: 'postpaid', emoji: '📱', title: 'Postpaid', desc: 'Mobile bill payment', route: '/services/finance/postpaid', gradient: ['#06b6d4', '#3b82f6'] as [string,string] },
  { id: 'credit-card', emoji: '💳', title: 'Credit Card', desc: 'Card bill payment', route: '/services/billing/credit-card', gradient: ['#a855f7', '#6366f1'] as [string,string] },
  { id: 'auto-collect', emoji: '🔄', title: 'Auto Collect', desc: 'Virtual account collect', route: '/services/finance/auto-collect', gradient: ['#14b8a6', '#06b6d4'] as [string,string] },
  { id: 'payment-gateway', emoji: '🔗', title: 'Payment Gateway', desc: 'Collect payments', route: '/services/finance/payment-gateway', gradient: ['#ec4899', '#f43f5e'] as [string,string] },
  { id: 'gift-card', emoji: '🎁', title: 'Gift Card', desc: 'Send gift vouchers', route: '/services/finance/gift-card', gradient: ['#f43f5e', '#f97316'] as [string,string] },
];

export default function ViewAllFinance() {
  const reducedMotion = useReducedMotion();

  return (
    <View style={{ flex: 1, backgroundColor: '#1c1c1c' }}>
      <LinearGradient colors={['#1e1b4b', '#312e81']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-4 pb-6 pt-4">
        <Text className="text-xl font-bold text-white">Finance Services</Text>
        <Text className="mt-1 text-sm text-white/70">All financial services in one place</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row flex-wrap gap-3">
          {SERVICES.map((s, i) => (
            <Animated.View key={s.id} entering={reducedMotion ? undefined : FadeInDown.delay(i * 50).duration(300)} style={{ width: '47%' }}>
              <Pressable onPress={() => router.push(s.route as any)} className="overflow-hidden rounded-2xl">
                <LinearGradient colors={s.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-4">
                  <Text className="mb-2 text-3xl">{s.emoji}</Text>
                  <Text className="text-base font-bold text-white">{s.title}</Text>
                  <Text className="mt-0.5 text-xs text-white/70">{s.desc}</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
