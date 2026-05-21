import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { router, useLocalSearchParams } from 'expo-router';
import Axios from '@/services/axios.service';
import { Plus, Send } from 'lucide-react-native';

interface Beneficiary {
  id: number | string;
  name: string;
  account_number: string;
  ifsc: string;
  bank_name?: string;
  mobile_number?: string;
}

export default function PPIBeneficiaries() {
  const reducedMotion = useReducedMotion();
  const { mobile_number } = useLocalSearchParams<{ mobile_number: string }>();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res: any = await Axios.get('v2/dmt/beneficiary', { params: { mobile_number } });
        setBeneficiaries(Array.isArray(res) ? res : (res?.data ?? []));
      } catch {
        setBeneficiaries([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [mobile_number]);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['#8b5cf6', '#6366f1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pb-6 pt-4">
        <Text className="text-xl font-bold text-white">Beneficiaries</Text>
        <Text className="mt-0.5 text-sm text-white/70">+91 {mobile_number}</Text>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {beneficiaries.length === 0 ? (
          <View className="mt-16 items-center">
            <Text className="text-5xl">🏦</Text>
            <Text className="mt-3 text-base font-bold text-foreground">No beneficiaries yet</Text>
            <Text className="mt-1 text-center text-sm text-muted-foreground">
              Add a beneficiary to start transferring money
            </Text>
          </View>
        ) : (
          beneficiaries.map((b, i) => (
            <Animated.View
              key={b.id ?? i}
              entering={reducedMotion ? undefined : FadeInDown.delay(i * 60).duration(300)}
              className="mb-3 flex-row items-center rounded-2xl border border-border bg-card px-4 py-4">
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-purple-100">
                <Text className="text-base font-bold text-purple-600">
                  {b.name?.charAt(0)?.toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-foreground">{b.name}</Text>
                <Text className="text-xs text-muted-foreground">
                  {b.bank_name ?? 'Bank'} • ••••{b.account_number?.slice(-4)}
                </Text>
              </View>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/ppi/transfer',
                    params: {
                      mobile_number,
                      beneficiary_id: String(b.id),
                      beneficiary_name: b.name,
                      account_number: b.account_number,
                    },
                  })
                }
                className="flex-row items-center gap-1.5 rounded-full bg-purple-100 px-3 py-2">
                <Send size={13} color="#8b5cf6" />
                <Text className="text-xs font-bold text-purple-700">Send</Text>
              </Pressable>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => router.push({ pathname: '/ppi/add-beneficiary', params: { mobile_number } })}
        className="absolute bottom-8 right-5">
        <LinearGradient
          colors={['#8b5cf6', '#6366f1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="h-14 w-14 items-center justify-center rounded-full shadow-lg">
          <Plus size={24} color="white" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}
