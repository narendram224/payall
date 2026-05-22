import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { CheckCircle2 } from 'lucide-react-native';

type Mode = 'buy' | 'sell';
type InputMode = 'weight' | 'amount';
const GOLD_RATE = 6420; // per gram 24K

const GOLD_BENEFITS = [
  'Start from just ₹1',
  '99.9% pure 24K gold',
  'Secure vault storage by Augmont',
  'Convert to physical gold anytime',
  'Real-time gold price tracking',
];

export default function GoldScreen() {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>('buy');
  const [inputMode, setInputMode] = useState<InputMode>('amount');
  const [value, setValue] = useState('');

  const grams =
    inputMode === 'amount'
      ? value
        ? (parseFloat(value) / GOLD_RATE).toFixed(4)
        : '0'
      : value || '0';
  const amount =
    inputMode === 'weight'
      ? value
        ? (parseFloat(value) * GOLD_RATE).toFixed(2)
        : '0'
      : value || '0';

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['#f59e0b', '#fbbf24']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pb-8 pt-4">
        <Text className="text-xl font-bold text-white">🥇 Digital Gold</Text>
        <Text className="mt-0.5 text-sm text-white/70">24K Pure Gold • Stored Securely</Text>
        <View className="mt-4 rounded-2xl bg-white/20 p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-medium text-white/70">Live Rate (24K)</Text>
              <Text className="text-2xl font-bold text-white">
                ₹{GOLD_RATE.toLocaleString('en-IN')}/g
              </Text>
            </View>
            <View className="rounded-full bg-green-400/30 px-3 py-1">
              <Text className="text-xs font-bold text-white">+0.42% today</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Benefits Section */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(0).duration(300)}
          className="mb-6 rounded-2xl p-4"
          style={{ backgroundColor: '#1e1b4b' }}>
          <Text className="mb-3 text-base font-bold text-white">Digital Gold Investment</Text>
          {GOLD_BENEFITS.map((benefit, index) => (
            <Animated.View
              key={benefit}
              entering={reducedMotion ? undefined : FadeInDown.delay(index * 50).duration(300)}
              className="mb-2 flex-row items-center gap-2">
              <CheckCircle2 size={16} color="#10b981" strokeWidth={2.5} />
              <Text className="flex-1 text-sm text-white">{benefit}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Buy/Sell Toggle */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(0).duration(300)}
          className="mb-5 flex-row gap-2 rounded-2xl bg-muted p-1">
          {(['buy', 'sell'] as Mode[]).map((m) => (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              className={`flex-1 items-center rounded-xl py-3 ${mode === m ? 'bg-white shadow-sm' : ''}`}>
              <Text
                className={`text-sm font-bold ${mode === m ? 'text-amber-600' : 'text-muted-foreground'}`}>
                {m === 'buy' ? '🛒 Buy' : '💰 Sell'}
              </Text>
            </Pressable>
          ))}
        </Animated.View>

        {/* Input Mode Toggle */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(300)}
          className="mb-4 flex-row gap-2">
          {(['amount', 'weight'] as InputMode[]).map((im) => (
            <Pressable
              key={im}
              onPress={() => {
                setInputMode(im);
                setValue('');
              }}
              className={`rounded-full border px-4 py-2 ${inputMode === im ? 'border-amber-500 bg-amber-50' : 'border-border bg-card'}`}>
              <Text
                className={`text-sm font-bold ${inputMode === im ? 'text-amber-600' : 'text-foreground'}`}>
                {im === 'amount' ? 'By Amount (₹)' : 'By Weight (g)'}
              </Text>
            </Pressable>
          ))}
        </Animated.View>

        {/* Input */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(160).duration(300)}
          className="mb-4">
          <View className="flex-row items-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
            <Text className="mr-2 text-lg font-bold text-amber-600">
              {inputMode === 'amount' ? '₹' : 'g'}
            </Text>
            <TextInput
              placeholder={inputMode === 'amount' ? 'Enter amount' : 'Enter grams'}
              placeholderTextColor="#d97706"
              value={value}
              onChangeText={setValue}
              keyboardType="decimal-pad"
              className="flex-1 text-base font-semibold text-amber-800"
            />
          </View>
        </Animated.View>

        {/* Calculation Display */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(240).duration(300)}
          className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm text-amber-700">You get</Text>
            <Text className="text-sm font-bold text-amber-800">
              {parseFloat(grams).toFixed(4)} grams
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-amber-700">You pay</Text>
            <Text className="text-sm font-bold text-amber-800">
              ₹{parseFloat(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </Text>
          </View>
        </Animated.View>

        {/* Info */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(320).duration(300)}
          className="mb-5">
          <View className="flex-row gap-3">
            {['Invest from ₹1', '24K Pure', 'Secure Vault'].map((i) => (
              <View
                key={i}
                className="flex-1 items-center rounded-xl border border-border bg-card p-3">
                <Text className="text-center text-xs font-semibold text-foreground">{i}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(400).duration(300)}>
          <Pressable onPress={() => toast.info('Gold investment coming soon!')}>
            <LinearGradient
              colors={['#f59e0b', '#fbbf24']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="items-center rounded-2xl py-4">
              <Text className="text-base font-bold text-white">
                {mode === 'buy' ? '🛒 Invest in Gold' : '💰 Sell Gold'}
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
