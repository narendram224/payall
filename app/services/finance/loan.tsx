import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { CheckCircle2 } from 'lucide-react-native';

const AMOUNTS = [10000, 25000, 50000, 100000, 200000, 500000];
const PURPOSES = ['Medical', 'Education', 'Travel', 'Business', 'Wedding', 'Other'];
const EMPLOYMENT = ['Salaried', 'Self-Employed', 'Business'];

const formatAmt = (n: number) => (n >= 100000 ? `₹${n / 100000}L` : `₹${n / 1000}K`);

const LOAN_BENEFITS = [
  'Loan from ₹10,000 to ₹10,00,000',
  'Interest from 10.5% p.a.',
  '100% digital process',
  'Instant disbursal in 24 hours',
  'No collateral required',
];

export default function LoanScreen() {
  const reducedMotion = useReducedMotion();
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [employment, setEmployment] = useState('');
  const [salary, setSalary] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState<{
    approved: string;
    rate: string;
    tenure: string;
  } | null>(null);

  const checkEligibility = async () => {
    if (!amount || !purpose || !employment || !salary || !mobile) {
      toast.error('Fill all fields');
      return;
    }
    if (mobile.length !== 10) {
      toast.error('Enter valid mobile');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const p = parseFloat(amount);
    setEligibility({
      approved: `₹${Math.min(p, parseFloat(salary) * 12).toLocaleString('en-IN')}`,
      rate: '12.5% p.a.',
      tenure: '12–60 months',
    });
    setLoading(false);
  };

  const handleApply = () => {
    toast.success('Application submitted! Our team will contact you.');
    setEligibility(null);
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['#10b981', '#3b82f6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pb-6 pt-4">
        <Text className="text-xl font-bold text-white">💸 Instant Loan</Text>
        <Text className="mt-0.5 text-sm text-white/70">Quick personal loans, no paperwork</Text>
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
          <Text className="mb-3 text-base font-bold text-white">Instant Personal Loan</Text>
          {LOAN_BENEFITS.map((benefit, index) => (
            <Animated.View
              key={benefit}
              entering={reducedMotion ? undefined : FadeInDown.delay(index * 50).duration(300)}
              className="mb-2 flex-row items-center gap-2">
              <CheckCircle2 size={16} color="#10b981" strokeWidth={2.5} />
              <Text className="flex-1 text-sm text-white">{benefit}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Amount */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(0).duration(300)}
          className="mb-5">
          <Text className="mb-2 text-sm font-bold text-foreground">Loan Amount Required</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 mb-3 px-4">
            {AMOUNTS.map((a) => (
              <Pressable
                key={a}
                onPress={() => setAmount(String(a))}
                className={`mr-2 rounded-full border px-4 py-2 ${amount === String(a) ? 'border-emerald-500 bg-emerald-50' : 'border-border bg-card'}`}>
                <Text
                  className={`text-sm font-bold ${amount === String(a) ? 'text-emerald-600' : 'text-foreground'}`}>
                  {formatAmt(a)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Purpose */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(300)}
          className="mb-5">
          <Text className="mb-2 text-sm font-bold text-foreground">Loan Purpose</Text>
          <View className="flex-row flex-wrap gap-2">
            {PURPOSES.map((p) => (
              <Pressable
                key={p}
                onPress={() => setPurpose(p)}
                className={`rounded-full border px-4 py-2 ${purpose === p ? 'border-emerald-500 bg-emerald-50' : 'border-border bg-card'}`}>
                <Text
                  className={`text-sm font-bold ${purpose === p ? 'text-emerald-600' : 'text-foreground'}`}>
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Employment */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(160).duration(300)}
          className="mb-5">
          <Text className="mb-2 text-sm font-bold text-foreground">Employment Type</Text>
          <View className="flex-row gap-2">
            {EMPLOYMENT.map((e) => (
              <Pressable
                key={e}
                onPress={() => setEmployment(e)}
                className={`flex-1 items-center rounded-xl border py-3 ${employment === e ? 'border-emerald-500 bg-emerald-50' : 'border-border bg-card'}`}>
                <Text
                  className={`text-xs font-bold ${employment === e ? 'text-emerald-600' : 'text-foreground'}`}>
                  {e}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Salary & Mobile */}
        {[
          {
            label: 'Monthly Salary (₹)',
            val: salary,
            set: setSalary,
            key: 'numeric',
            ph: 'Enter monthly salary',
          },
          {
            label: 'Mobile Number',
            val: mobile,
            set: setMobile,
            key: 'numeric',
            ph: '10-digit mobile',
            max: 10,
          },
        ].map((f, i) => (
          <Animated.View
            key={f.label}
            entering={reducedMotion ? undefined : FadeInDown.delay(240 + i * 80).duration(300)}
            className="mb-5">
            <Text className="mb-2 text-sm font-bold text-foreground">{f.label}</Text>
            <TextInput
              placeholder={f.ph}
              placeholderTextColor="#9ca3af"
              value={f.val}
              onChangeText={f.set}
              keyboardType={f.key as any}
              maxLength={f.max}
              className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground"
            />
          </Animated.View>
        ))}

        {/* Eligibility Result */}
        {eligibility && (
          <Animated.View
            entering={reducedMotion ? undefined : FadeInDown.duration(300)}
            className="mb-5 overflow-hidden rounded-2xl">
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-4">
              <Text className="text-sm font-bold text-white/70">Pre-approved Amount</Text>
              <Text className="text-3xl font-bold text-white">{eligibility.approved}</Text>
              <View className="mt-3 flex-row gap-4">
                <View>
                  <Text className="text-xs text-white/70">Interest</Text>
                  <Text className="text-sm font-bold text-white">{eligibility.rate}</Text>
                </View>
                <View>
                  <Text className="text-xs text-white/70">Tenure</Text>
                  <Text className="text-sm font-bold text-white">{eligibility.tenure}</Text>
                </View>
              </View>
            </LinearGradient>
            <Pressable onPress={handleApply}>
              <View className="items-center bg-emerald-600 py-4">
                <Text className="text-base font-bold text-white">Apply Now →</Text>
              </View>
            </Pressable>
          </Animated.View>
        )}

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(400).duration(300)}>
          <Pressable onPress={checkEligibility} disabled={loading}>
            <LinearGradient
              colors={['#10b981', '#3b82f6']}
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
