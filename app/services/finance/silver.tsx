import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';

const SILVER_RATE = 78; // per gram

export default function SilverScreen() {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [inputMode, setInputMode] = useState<'amount' | 'weight'>('amount');
  const [value, setValue] = useState('');

  const grams = inputMode === 'amount' ? (value ? parseFloat(value) / SILVER_RATE : 0).toFixed(2) : value || '0';
  const amount = inputMode === 'weight' ? (value ? parseFloat(value) * SILVER_RATE : 0).toFixed(2) : value || '0';

  return (
    <View className="flex-1 bg-background">
      <LinearGradient colors={['#94a3b8', '#64748b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-4 pb-8 pt-4">
        <Text className="text-xl font-bold text-white">🥈 Digital Silver</Text>
        <Text className="mt-0.5 text-sm text-white/70">Pure Silver • Stored Securely</Text>
        <View className="mt-4 rounded-2xl bg-white/20 p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-medium text-white/70">Live Rate</Text>
              <Text className="text-2xl font-bold text-white">₹{SILVER_RATE}/gram</Text>
            </View>
            <View className="rounded-full bg-green-400/30 px-3 py-1">
              <Text className="text-xs font-bold text-white">+0.18% today</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(0).duration(300)} className="mb-5 flex-row gap-2 rounded-2xl bg-muted p-1">
          {(['buy', 'sell'] as const).map(m => (
            <Pressable key={m} onPress={() => setMode(m)} className={`flex-1 items-center rounded-xl py-3 ${mode === m ? 'bg-white' : ''}`}>
              <Text className={`text-sm font-bold ${mode === m ? 'text-slate-600' : 'text-muted-foreground'}`}>{m === 'buy' ? '🛒 Buy' : '💰 Sell'}</Text>
            </Pressable>
          ))}
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(300)} className="mb-4 flex-row gap-2">
          {(['amount', 'weight'] as const).map(im => (
            <Pressable key={im} onPress={() => { setInputMode(im); setValue(''); }} className={`rounded-full border px-4 py-2 ${inputMode === im ? 'border-slate-500 bg-slate-50' : 'border-border bg-card'}`}>
              <Text className={`text-sm font-bold ${inputMode === im ? 'text-slate-700' : 'text-foreground'}`}>{im === 'amount' ? 'By Amount (₹)' : 'By Weight (g)'}</Text>
            </Pressable>
          ))}
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(160).duration(300)} className="mb-4">
          <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
            <Text className="mr-2 text-lg font-bold text-slate-600">{inputMode === 'amount' ? '₹' : 'g'}</Text>
            <TextInput placeholder={inputMode === 'amount' ? 'Enter amount' : 'Enter grams'} placeholderTextColor="#94a3b8" value={value} onChangeText={setValue} keyboardType="decimal-pad" className="flex-1 text-base font-semibold text-slate-800" />
          </View>
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(240).duration(300)} className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-slate-600">You get</Text>
            <Text className="text-sm font-bold text-slate-800">{parseFloat(grams).toFixed(2)} grams</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-slate-600">You pay</Text>
            <Text className="text-sm font-bold text-slate-800">₹{parseFloat(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(320).duration(300)}>
          <Pressable onPress={() => toast.info('Silver investment coming soon!')}>
            <LinearGradient colors={['#94a3b8', '#64748b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="items-center rounded-2xl py-4">
              <Text className="text-base font-bold text-white">{mode === 'buy' ? '🛒 Invest in Silver' : '💰 Sell Silver'}</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
