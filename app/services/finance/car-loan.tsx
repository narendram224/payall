import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { CheckCircle2 } from 'lucide-react-native';

const LOAN_AMOUNTS = [100000, 300000, 500000, 700000, 1000000];
const VEHICLE_TYPES = ['New', 'Used'];
const EMPLOYMENT_TYPES = ['Salaried', 'Self-Employed', 'Business'];

const CAR_LOAN_BENEFITS = [
  'Up to 90% of car value financed',
  'Interest from 7.5% p.a.',
  'Tenure up to 7 years',
  'Quick approval in 48 hours',
  'New & used car loans available',
];

export default function CarLoanScreen() {
  const reducedMotion = useReducedMotion();
  const [loanAmount, setLoanAmount] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [income, setIncome] = useState('');
  const [employment, setEmployment] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const formatLakh = (n: number) => (n >= 100000 ? `₹${n / 100000}L` : `₹${n / 1000}K`);

  const handleSubmit = async () => {
    if (!loanAmount || !vehicleType || !income || !employment || !mobile) {
      toast.error('Please fill all fields');
      return;
    }
    if (mobile.length !== 10) {
      toast.error('Enter valid 10-digit mobile');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success('Our team will contact you shortly!');
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['#f59e0b', '#f97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pb-6 pt-4">
        <Text className="text-xl font-bold text-white">🚗 Car Loan</Text>
        <Text className="mt-0.5 text-sm text-white/70">Quick approval, competitive rates</Text>
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
          <Text className="mb-3 text-base font-bold text-white">Car Loan Made Easy</Text>
          {CAR_LOAN_BENEFITS.map((benefit, index) => (
            <Animated.View
              key={benefit}
              entering={reducedMotion ? undefined : FadeInDown.delay(index * 50).duration(300)}
              className="mb-2 flex-row items-center gap-2">
              <CheckCircle2 size={16} color="#10b981" strokeWidth={2.5} />
              <Text className="flex-1 text-sm text-white">{benefit}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Loan Amount */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(0).duration(300)}
          className="mb-5">
          <Text className="mb-2 text-sm font-bold text-foreground">Loan Amount Required</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 mb-3 px-4">
            {LOAN_AMOUNTS.map((a) => (
              <Pressable
                key={a}
                onPress={() => setLoanAmount(String(a))}
                className={`mr-2 rounded-full border px-4 py-2 ${loanAmount === String(a) ? 'border-amber-500 bg-amber-50' : 'border-border bg-card'}`}>
                <Text
                  className={`text-sm font-bold ${loanAmount === String(a) ? 'text-amber-600' : 'text-foreground'}`}>
                  {formatLakh(a)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <TextInput
            placeholder="Or enter custom amount"
            placeholderTextColor="#9ca3af"
            value={loanAmount}
            onChangeText={setLoanAmount}
            keyboardType="numeric"
            className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground"
          />
        </Animated.View>

        {/* Vehicle Type */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(300)}
          className="mb-5">
          <Text className="mb-2 text-sm font-bold text-foreground">Vehicle Type</Text>
          <View className="flex-row gap-3">
            {VEHICLE_TYPES.map((v) => (
              <Pressable
                key={v}
                onPress={() => setVehicleType(v)}
                className={`flex-1 items-center rounded-xl border py-3 ${vehicleType === v ? 'border-amber-500 bg-amber-50' : 'border-border bg-card'}`}>
                <Text
                  className={`text-sm font-bold ${vehicleType === v ? 'text-amber-600' : 'text-foreground'}`}>
                  {v}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Monthly Income */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(160).duration(300)}
          className="mb-5">
          <Text className="mb-2 text-sm font-bold text-foreground">Monthly Income (₹)</Text>
          <TextInput
            placeholder="Enter monthly income"
            placeholderTextColor="#9ca3af"
            value={income}
            onChangeText={setIncome}
            keyboardType="numeric"
            className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground"
          />
        </Animated.View>

        {/* Employment Type */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(240).duration(300)}
          className="mb-5">
          <Text className="mb-2 text-sm font-bold text-foreground">Employment Type</Text>
          <View className="flex-row flex-wrap gap-2">
            {EMPLOYMENT_TYPES.map((e) => (
              <Pressable
                key={e}
                onPress={() => setEmployment(e)}
                className={`rounded-full border px-4 py-2 ${employment === e ? 'border-amber-500 bg-amber-50' : 'border-border bg-card'}`}>
                <Text
                  className={`text-sm font-bold ${employment === e ? 'text-amber-600' : 'text-foreground'}`}>
                  {e}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Mobile */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(320).duration(300)}
          className="mb-5">
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

        {/* Info Card */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(400).duration(300)}
          className="mb-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <Text className="mb-1 text-sm font-bold text-amber-800">Loan Highlights</Text>
          <Text className="text-xs text-amber-700">✓ Loans from ₹50,000 to ₹25 Lakhs</Text>
          <Text className="mt-0.5 text-xs text-amber-700">✓ Tenure: 12–84 months</Text>
          <Text className="mt-0.5 text-xs text-amber-700">✓ Rates from 8.5% p.a.</Text>
          <Text className="mt-0.5 text-xs text-amber-700">✓ Approval in 24 hours</Text>
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(480).duration(300)}>
          <Pressable onPress={handleSubmit} disabled={loading}>
            <LinearGradient
              colors={['#f59e0b', '#f97316']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="items-center rounded-2xl py-4">
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-bold text-white">Check Eligibility</Text>
              )}
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
