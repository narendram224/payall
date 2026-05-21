import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { router, useLocalSearchParams } from 'expo-router';
import apiClient from '@/api/client';
import { CheckCircle, AlertTriangle } from 'lucide-react-native';

export default function PPISender() {
  const reducedMotion = useReducedMotion();
  const { mobile_number } = useLocalSearchParams<{ mobile_number: string }>();
  const [loading, setLoading] = useState(true);
  const [senderInfo, setSenderInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const fd = new FormData();
        fd.append('mobile_number', mobile_number ?? '');
        const res: any = await apiClient.post('v1/ppi/verification', fd);
        setSenderInfo(res);
      } catch (e: any) {
        setError(e?.response?.data?.message ?? 'Verification failed');
      } finally { setLoading(false); }
    })();
  }, [mobile_number]);

  if (loading) return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#8b5cf6" />
      <Text className="mt-3 text-sm text-muted-foreground">Verifying sender…</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <LinearGradient colors={['#8b5cf6', '#6366f1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-4 pb-8 pt-6">
        <Text className="text-xl font-bold text-white">Sender Details</Text>
        <Text className="mt-0.5 text-sm text-white/70">+91 {mobile_number}</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {error ? (
          <Animated.View entering={reducedMotion ? undefined : FadeInDown.duration(300)} className="mt-8 items-center">
            <AlertTriangle size={48} color="#f59e0b" />
            <Text className="mt-3 text-base font-bold text-foreground">Verification Failed</Text>
            <Text className="mt-1 text-sm text-center text-muted-foreground">{error}</Text>
          </Animated.View>
        ) : (
          <Animated.View entering={reducedMotion ? undefined : FadeInDown.duration(300)}>
            <View className="mb-5 rounded-2xl border border-border bg-card p-5">
              <View className="mb-4 flex-row items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Text className="text-xl font-bold text-purple-600">
                    {(senderInfo?.name ?? mobile_number ?? 'U')?.charAt(0)?.toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text className="text-base font-bold text-foreground">{senderInfo?.name ?? 'Sender'}</Text>
                  <Text className="text-sm text-muted-foreground">+91 {mobile_number}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <CheckCircle size={16} color="#10b981" />
                <Text className="text-sm text-emerald-600 font-semibold">PPI Account Active</Text>
              </View>
              {senderInfo?.limit && (
                <View className="mt-3 rounded-xl bg-muted p-3">
                  <Text className="text-xs text-muted-foreground">Transfer Limit</Text>
                  <Text className="text-base font-bold text-foreground">₹{parseFloat(senderInfo.limit).toLocaleString('en-IN')}</Text>
                </View>
              )}
            </View>

            <Pressable onPress={() => router.push({ pathname: '/ppi/beneficiaries', params: { mobile_number } })}>
              <LinearGradient colors={['#8b5cf6', '#6366f1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="items-center rounded-2xl py-4">
                <Text className="text-base font-bold text-white">View Beneficiaries →</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
