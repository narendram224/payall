import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { router } from 'expo-router';
import OperatorSelector from '@/components/recharge/OperatorSelector';
import AmountInput from '@/components/recharge/AmountInput';
import TransactionSummary from '@/components/recharge/TransactionSummary';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import { rechargeService, Provider } from '@/services/recharge/recharge.service';

export default function PostpaidBill() {
  const reducedMotion = useReducedMotion();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selected, setSelected] = useState<Provider | null>(null);
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await rechargeService.getProviders();
        // service_id 3 = Mobile Postpaid
        setProviders(data.providers.filter((p: Provider) => p.service_id === 3));
      } catch {
        toast.error('Failed to load providers');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleProceed = () => {
    if (!selected) {
      toast.error('Select operator');
      return;
    }
    if (!mobile || mobile.length !== 10) {
      toast.error('Enter valid 10-digit mobile');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Enter valid amount');
      return;
    }
    setShowSummary(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const res = await rechargeService.recharge({
        number: mobile,
        provider_id: selected!.id,
        amount,
        client_id: `PP${Date.now()}`,
      });
      if (res.status_id === 1) {
        setResult(res);
        setShowSummary(false);
      } else toast.error(res.message ?? 'Payment failed');
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (result)
    return (
      <SuccessScreen
        orderId={result.order_id}
        amount={result.amount}
        message="Postpaid bill paid!"
        onDone={() => {
          setResult(null);
          setSelected(null);
          setMobile('');
          setAmount('');
          setShowSummary(false);
          router.back();
        }}
      />
    );

  if (loading && providers.length === 0)
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['#3b82f6', '#6366f1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pb-6 pt-4">
        <Text className="text-xl font-bold text-white">📱 Mobile Postpaid</Text>
        <Text className="mt-0.5 text-sm text-white/70">Pay your postpaid bill instantly</Text>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {!showSummary ? (
          <>
            <Animated.View
              entering={reducedMotion ? undefined : FadeInDown.delay(0).duration(300)}
              className="mb-4">
              <Text className="mb-2 text-sm font-bold text-foreground">Select Operator</Text>
              <OperatorSelector
                operators={providers}
                selectedOperator={selected}
                onSelectOperator={setSelected}
              />
            </Animated.View>

            <Animated.View
              entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(300)}
              className="mb-4">
              <Text className="mb-2 text-sm font-bold text-foreground">Mobile Number</Text>
              <View className="flex-row items-center overflow-hidden rounded-xl border border-border bg-card">
                <View className="border-r border-border bg-muted px-3 py-3.5">
                  <Text className="font-semibold text-foreground">+91</Text>
                </View>
                <TextInput
                  placeholder="10-digit mobile"
                  placeholderTextColor="#9ca3af"
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="numeric"
                  maxLength={10}
                  className="flex-1 px-3 py-3.5 text-sm text-foreground"
                />
              </View>
            </Animated.View>

            <Animated.View
              entering={reducedMotion ? undefined : FadeInDown.delay(160).duration(300)}
              className="mb-5">
              <AmountInput
                value={amount}
                onChangeText={setAmount}
                quickAmounts={[199, 299, 399, 499, 699, 999]}
              />
            </Animated.View>

            <Animated.View
              entering={reducedMotion ? undefined : FadeInDown.delay(240).duration(300)}>
              <Pressable onPress={handleProceed} disabled={loading}>
                <LinearGradient
                  colors={['#3b82f6', '#6366f1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="items-center rounded-2xl py-4">
                  <Text className="text-base font-bold text-white">Proceed to Pay</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          </>
        ) : (
          <Animated.View
            entering={reducedMotion ? undefined : FadeInDown.duration(300)}
            className="space-y-4">
            <View className="rounded-2xl border border-border bg-card p-4">
              <TransactionSummary
                operatorName={selected?.provider_name ?? ''}
                number={mobile}
                amount={amount}
              />
            </View>
            <View className="mt-2 flex-row gap-3">
              <Pressable
                onPress={() => setShowSummary(false)}
                className="flex-1 items-center rounded-2xl border border-border py-4">
                <Text className="font-semibold text-foreground">Back</Text>
              </Pressable>
              <Pressable disabled={loading} onPress={handleConfirm} className="flex-1">
                <LinearGradient
                  colors={['#3b82f6', '#6366f1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="items-center rounded-2xl py-4">
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-base font-bold text-white">Confirm Payment</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
