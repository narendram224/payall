import React, { useState, useMemo } from 'react';
import { View, ScrollView, Pressable, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

const TENURES = [12, 24, 36, 48, 60, 84];

export default function EMICalculator() {
  const reducedMotion = useReducedMotion();
  const [principal, setPrincipal] = useState('500000');
  const [rate, setRate] = useState('10.5');
  const [tenure, setTenure] = useState(36);

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 12 / 100;
    const n = tenure;
    if (P <= 0 || r <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalAmount: 0 };
    const e = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = e * n;
    return { emi: e, totalInterest: total - P, totalAmount: total };
  }, [principal, rate, tenure]);

  const principalPct = totalAmount > 0 ? Math.round((parseFloat(principal) / totalAmount) * 100) : 0;

  const fmt = (n: number) =>
    `₹${Math.round(n).toLocaleString('en-IN')}`;

  return (
    <View className="flex-1 bg-background">
      <LinearGradient colors={['#6366f1', '#8b5cf6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-4 pb-6 pt-4">
        <Text className="text-xl font-bold text-white">🧮 EMI Calculator</Text>
        <Text className="mt-0.5 text-sm text-white/70">Plan your loan repayment</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Loan Amount */}
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(0).duration(300)} className="mb-5">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-sm font-bold text-foreground">Loan Amount</Text>
            <Text className="text-base font-bold text-primary">{fmt(parseFloat(principal) || 0)}</Text>
          </View>
          <TextInput value={principal} onChangeText={setPrincipal} keyboardType="numeric" placeholder="Enter loan amount" placeholderTextColor="#9ca3af" className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground" />
        </Animated.View>

        {/* Interest Rate */}
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(300)} className="mb-5">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-sm font-bold text-foreground">Interest Rate (p.a.)</Text>
            <Text className="text-base font-bold text-primary">{rate}%</Text>
          </View>
          <TextInput value={rate} onChangeText={setRate} keyboardType="decimal-pad" placeholder="e.g. 10.5" placeholderTextColor="#9ca3af" className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground" />
        </Animated.View>

        {/* Tenure */}
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(160).duration(300)} className="mb-6">
          <Text className="mb-2 text-sm font-bold text-foreground">Tenure</Text>
          <View className="flex-row flex-wrap gap-2">
            {TENURES.map(t => (
              <Pressable key={t} onPress={() => setTenure(t)} className={`rounded-full border px-4 py-2 ${tenure === t ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
                <Text className={`text-sm font-bold ${tenure === t ? 'text-primary' : 'text-foreground'}`}>{t} mo</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Result Card */}
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(240).duration(350)} className="mb-5 overflow-hidden rounded-3xl">
          <LinearGradient colors={['#6366f1', '#8b5cf6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="items-center py-6">
            <Text className="text-sm font-medium text-white/70">Monthly EMI</Text>
            <Text className="mt-1 text-5xl font-bold text-white">{fmt(emi)}</Text>
          </LinearGradient>
          <View className="bg-card px-5 py-4">
            <View className="mb-3 flex-row justify-between">
              <Text className="text-sm text-muted-foreground">Principal</Text>
              <Text className="text-sm font-bold text-foreground">{fmt(parseFloat(principal) || 0)}</Text>
            </View>
            <View className="mb-3 flex-row justify-between">
              <Text className="text-sm text-muted-foreground">Total Interest</Text>
              <Text className="text-sm font-bold text-orange-500">{fmt(totalInterest)}</Text>
            </View>
            <View className="mb-4 flex-row justify-between">
              <Text className="text-sm font-bold text-foreground">Total Amount</Text>
              <Text className="text-sm font-bold text-primary">{fmt(totalAmount)}</Text>
            </View>
            {/* Principal vs Interest Bar */}
            <View className="overflow-hidden rounded-full h-3 bg-orange-100">
              <View className="h-full bg-primary rounded-full" style={{ width: `${principalPct}%` }} />
            </View>
            <View className="mt-2 flex-row justify-between">
              <View className="flex-row items-center gap-1.5">
                <View className="h-2.5 w-2.5 rounded-full bg-primary" />
                <Text className="text-xs text-muted-foreground">Principal {principalPct}%</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                <Text className="text-xs text-muted-foreground">Interest {100 - principalPct}%</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
