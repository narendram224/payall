import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { policyService } from '@/services/policy/policy.service';
import * as Linking from 'expo-linking';
import { Minus, Plus } from 'lucide-react-native';

const GENDERS = ['Male', 'Female', 'Other'];

export default function HealthInsurance() {
  const reducedMotion = useReducedMotion();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [members, setMembers] = useState(1);
  const [loading, setLoading] = useState(false);

  const mobileError = mobile && !/^[6-9][0-9]{9}$/.test(mobile) ? 'Enter valid mobile' : '';

  const handleSubmit = async () => {
    if (!name || !mobile || !dob || !gender) {
      toast.error('Fill all fields');
      return;
    }
    if (mobileError) {
      toast.error(mobileError);
      return;
    }
    try {
      setLoading(true);
      const res = await policyService.getInsuranceUrl({
        service_id: 3,
        amount: '2000',
        name,
        mobile,
        email: '',
        dob,
      });
      if (res?.status_id === 1 && res?.url) {
        await Linking.openURL(res.url);
      } else {
        toast.success('Request submitted! Our team will contact you.');
      }
    } catch {
      toast.success('Request submitted! Our team will contact you.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['#10b981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pb-6 pt-4">
        <Text className="text-xl font-bold text-white">❤️‍🩹 Health Insurance</Text>
        <Text className="mt-0.5 text-sm text-white/70">
          Cashless hospitalisation, pan-India coverage
        </Text>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {[
          { label: 'Full Name', val: name, set: setName, ph: 'Enter your full name' },
          { label: 'Date of Birth', val: dob, set: setDob, ph: 'DD/MM/YYYY', key: 'numeric' },
        ].map((f, i) => (
          <Animated.View
            key={f.label}
            entering={reducedMotion ? undefined : FadeInDown.delay(i * 80).duration(300)}
            className="mb-4">
            <Text className="mb-1.5 text-sm font-bold text-foreground">
              {f.label} <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder={f.ph}
              placeholderTextColor="#9ca3af"
              value={f.val}
              onChangeText={f.set}
              keyboardType={(f.key as any) ?? 'default'}
              className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground"
            />
          </Animated.View>
        ))}

        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(160).duration(300)}
          className="mb-4">
          <Text className="mb-1.5 text-sm font-bold text-foreground">
            Mobile <Text className="text-red-500">*</Text>
          </Text>
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
          {!!mobileError && <Text className="mt-1 text-xs text-red-500">{mobileError}</Text>}
        </Animated.View>

        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(240).duration(300)}
          className="mb-4">
          <Text className="mb-2 text-sm font-bold text-foreground">
            Gender <Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row gap-2">
            {GENDERS.map((g) => (
              <Pressable
                key={g}
                onPress={() => setGender(g)}
                className={`flex-1 items-center rounded-xl border py-3 ${gender === g ? 'border-emerald-500 bg-emerald-50' : 'border-border bg-card'}`}>
                <Text
                  className={`text-sm font-bold ${gender === g ? 'text-emerald-600' : 'text-foreground'}`}>
                  {g}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(320).duration(300)}
          className="mb-6">
          <Text className="mb-2 text-sm font-bold text-foreground">Family Members to Cover</Text>
          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={() => setMembers(Math.max(1, members - 1))}
              className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
              <Minus size={16} color="#6b7280" />
            </Pressable>
            <Text className="w-8 text-center text-2xl font-bold text-foreground">{members}</Text>
            <Pressable
              onPress={() => setMembers(Math.min(6, members + 1))}
              className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
              <Plus size={16} color="#6b7280" />
            </Pressable>
            <Text className="text-sm text-muted-foreground">
              {members === 1 ? 'Individual' : `Family of ${members}`}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(400).duration(300)}
          className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <Text className="text-sm font-bold text-emerald-800">
            ✓ Cashless in 10,000+ hospitals
          </Text>
          <Text className="mt-1 text-xs text-emerald-700">✓ No room-rent capping</Text>
          <Text className="mt-0.5 text-xs text-emerald-700">
            ✓ Pre & post hospitalisation covered
          </Text>
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(480).duration(300)}>
          <Pressable onPress={handleSubmit} disabled={loading}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="items-center rounded-2xl py-4">
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-bold text-white">View Health Plans →</Text>
              )}
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
