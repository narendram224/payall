import React, { useState } from 'react';
import { View, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { router, useLocalSearchParams } from 'expo-router';
import Axios from '@/services/axios.service';
import { ScrollView } from 'react-native';

export default function PPIAddBeneficiary() {
  const reducedMotion = useReducedMotion();
  const { mobile_number } = useLocalSearchParams<{ mobile_number: string }>();
  const [account, setAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!account || !ifsc || !name) {
      toast.error('Fill all fields');
      return;
    }
    if (ifsc.length !== 11) {
      toast.error('Enter valid 11-char IFSC');
      return;
    }
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('mobile_number', mobile_number ?? '');
      fd.append('account_number', account);
      fd.append('ifsc_code', ifsc.toUpperCase());
      fd.append('beneficiary_name', name);
      await Axios.post('v1/ppi/add_beneficiary', fd);
      setStep('otp');
      toast.success('OTP sent for confirmation');
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Failed to add beneficiary');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!otp) {
      toast.error('Enter OTP');
      return;
    }
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('mobile_number', mobile_number ?? '');
      fd.append('otp', otp);
      await Axios.post('v1/ppi/add_beneficiary_confirm', fd);
      toast.success('Beneficiary added!');
      router.back();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['#8b5cf6', '#6366f1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pb-6 pt-4">
        <Text className="text-xl font-bold text-white">Add Beneficiary</Text>
        <Text className="mt-0.5 text-sm text-white/70">PPI Transfer</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {step === 'form' ? (
          <>
            {[
              {
                label: 'Account Number',
                val: account,
                set: setAccount,
                key: 'numeric',
                max: 20,
                ph: 'Bank account number',
              },
              {
                label: 'IFSC Code',
                val: ifsc,
                set: (t: string) => setIfsc(t.toUpperCase()),
                key: 'default',
                max: 11,
                ph: 'e.g. SBIN0001234',
              },
              {
                label: 'Account Holder Name',
                val: name,
                set: setName,
                key: 'default',
                max: 50,
                ph: 'Full name',
              },
            ].map((f, i) => (
              <Animated.View
                key={f.label}
                entering={reducedMotion ? undefined : FadeInDown.delay(i * 80).duration(300)}
                className="mb-4">
                <Text className="mb-1.5 text-sm font-bold text-foreground">{f.label}</Text>
                <TextInput
                  placeholder={f.ph}
                  placeholderTextColor="#9ca3af"
                  value={f.val}
                  onChangeText={f.set}
                  keyboardType={f.key as any}
                  maxLength={f.max}
                  autoCapitalize={f.key === 'default' ? 'characters' : 'none'}
                  className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground"
                />
              </Animated.View>
            ))}
            <Animated.View
              entering={reducedMotion ? undefined : FadeInDown.delay(240).duration(300)}>
              <Pressable onPress={handleAdd} disabled={loading}>
                <LinearGradient
                  colors={['#8b5cf6', '#6366f1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="items-center rounded-2xl py-4">
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-base font-bold text-white">Add Beneficiary</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </>
        ) : (
          <Animated.View entering={reducedMotion ? undefined : FadeInDown.duration(300)}>
            <View className="mb-5 rounded-2xl bg-purple-50 p-4">
              <Text className="text-sm font-semibold text-purple-700">
                OTP sent to +91 {mobile_number}
              </Text>
            </View>
            <TextInput
              placeholder="Enter OTP"
              placeholderTextColor="#9ca3af"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
              className="mb-5 rounded-2xl border border-border bg-card px-4 py-4 text-center text-2xl font-bold tracking-widest text-foreground"
            />
            <Pressable onPress={handleConfirm} disabled={loading}>
              <LinearGradient
                colors={['#8b5cf6', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="items-center rounded-2xl py-4">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-base font-bold text-white">Confirm OTP</Text>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
