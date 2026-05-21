import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { creditCardService } from '@/api/creditCard';
import PaymentConfirmSheet from '@/components/bbps/PaymentConfirmSheet';
import SuccessScreen from '@/components/recharge/SuccessScreen';
import { router } from 'expo-router';

const NETWORKS = [
  { id: '1', name: 'Visa', emoji: '💳' },
  { id: '2', name: 'Mastercard', emoji: '💳' },
  { id: '3', name: 'Amex', emoji: '💳' },
  { id: '4', name: 'RuPay', emoji: '💳' },
];
const QUICK = [500, 1000, 2000, 5000, 10000];

export default function CreditCardBill() {
  const reducedMotion = useReducedMotion();
  const [network, setNetwork] = useState<{ id: string; name: string; emoji: string } | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const handlePay = async () => {
    try {
      setLoading(true);
      const res = await creditCardService.payCreditCard({
        number: cardNumber.replace(/\s/g, ''),
        provider_id: network!.id,
        amount,
        client_id: `CC${Date.now()}`,
      });
      if (res?.status_id === 1) {
        setResult(res);
        setConfirmVisible(false);
      } else {
        toast.error(res?.message ?? 'Payment failed');
        setConfirmVisible(false);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Payment failed');
      setConfirmVisible(false);
    } finally { setLoading(false); }
  };

  if (result) {
    return <SuccessScreen orderId={result.order_id} amount={result.amount} message="Credit card bill paid!" onDone={() => { setResult(null); setCardNumber(''); setAmount(''); setNetwork(null); router.back(); }} />;
  }

  return (
    <View className="flex-1 bg-background">
      <LinearGradient colors={['#6366f1', '#a855f7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-4 pb-6 pt-4">
        <Text className="text-xl font-bold text-white">💳 Credit Card Bill</Text>
        <Text className="mt-0.5 text-sm text-white/70">Pay any credit card bill instantly</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Card Network */}
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(0).duration(300)} className="mb-5">
          <Text className="mb-2 text-sm font-bold text-foreground">Card Network</Text>
          <View className="flex-row gap-2">
            {NETWORKS.map(n => (
              <Pressable key={n.id} onPress={() => setNetwork(n)} className={`flex-1 items-center rounded-xl border py-3 ${network?.id === n.id ? 'border-indigo-500 bg-indigo-50' : 'border-border bg-card'}`}>
                <Text className="text-xl">{n.emoji}</Text>
                <Text className={`mt-1 text-xs font-bold ${network?.id === n.id ? 'text-indigo-600' : 'text-foreground'}`}>{n.name}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Card Number */}
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(300)} className="mb-5">
          <Text className="mb-1.5 text-sm font-bold text-foreground">Card Number</Text>
          <TextInput
            placeholder="XXXX XXXX XXXX XXXX"
            placeholderTextColor="#9ca3af"
            value={cardNumber}
            onChangeText={t => setCardNumber(formatCard(t))}
            keyboardType="numeric"
            maxLength={19}
            className="rounded-xl border border-border bg-card px-4 py-3.5 text-base font-semibold tracking-widest text-foreground"
          />
        </Animated.View>

        {/* Amount */}
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(160).duration(300)} className="mb-4">
          <Text className="mb-1.5 text-sm font-bold text-foreground">Payment Amount</Text>
          <View className="flex-row items-center rounded-xl border border-border bg-card px-4 py-3.5">
            <Text className="mr-2 text-lg font-bold text-muted-foreground">₹</Text>
            <TextInput placeholder="Enter amount" placeholderTextColor="#9ca3af" value={amount} onChangeText={setAmount} keyboardType="numeric" className="flex-1 text-base font-semibold text-foreground" />
          </View>
        </Animated.View>

        {/* Quick Amounts */}
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(240).duration(300)} className="mb-6 flex-row flex-wrap gap-2">
          {QUICK.map(a => (
            <Pressable key={a} onPress={() => setAmount(String(a))} className={`rounded-full border px-4 py-2 ${amount === String(a) ? 'border-indigo-500 bg-indigo-50' : 'border-border bg-card'}`}>
              <Text className={`text-sm font-bold ${amount === String(a) ? 'text-indigo-600' : 'text-foreground'}`}>₹{a.toLocaleString('en-IN')}</Text>
            </Pressable>
          ))}
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(320).duration(300)}>
          <Pressable onPress={() => {
            if (!network) { toast.error('Select card network'); return; }
            if (!cardNumber || cardNumber.replace(/\s/g, '').length < 12) { toast.error('Enter valid card number'); return; }
            if (!amount || parseFloat(amount) <= 0) { toast.error('Enter valid amount'); return; }
            setConfirmVisible(true);
          }}>
            <LinearGradient colors={['#6366f1', '#a855f7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="items-center rounded-2xl py-4">
              <Text className="text-base font-bold text-white">Pay Bill</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>

      <PaymentConfirmSheet
        visible={confirmVisible}
        billerName={`${network?.name ?? ''} Credit Card`}
        consumerNumber={`••••${cardNumber.replace(/\s/g, '').slice(-4)}`}
        amount={amount}
        onConfirm={handlePay}
        onCancel={() => setConfirmVisible(false)}
        isLoading={loading}
      />
    </View>
  );
}
