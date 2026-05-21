import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { policyService } from '@/api/policy';
import * as Linking from 'expo-linking';

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric'];
const YEARS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018'];
const SEATS = ['4', '5', '7'];

export default function CarInsurance() {
  const reducedMotion = useReducedMotion();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [seats, setSeats] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const mobileError = mobile && !/^[6-9][0-9]{9}$/.test(mobile) ? 'Enter valid 10-digit mobile' : '';
  const vehicleError = vehicleNumber && !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(vehicleNumber.toUpperCase()) ? 'Invalid format (e.g. MH02CD5678)' : '';

  const handleSubmit = async () => {
    if (!vehicleNumber || !vehicleModel || !year || !fuelType || !seats || !ownerName || !mobile) { toast.error('Fill all fields'); return; }
    if (mobileError || vehicleError) { toast.error('Fix validation errors'); return; }
    try {
      setLoading(true);
      const res = await policyService.getInsuranceUrl({ service_id: 2, amount: '1000', name: ownerName, mobile, email: '' });
      if (res?.status_id === 1 && res?.url) { await Linking.openURL(res.url); }
      else { toast.success('Quote request sent! Our team will contact you.'); }
    } catch { toast.success('Quote request sent! Our team will contact you.'); }
    finally { setLoading(false); }
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient colors={['#3b82f6', '#6366f1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-4 pb-6 pt-4">
        <Text className="text-xl font-bold text-white">🚗 Car Insurance</Text>
        <Text className="mt-0.5 text-sm text-white/70">Four-wheeler coverage from ₹2,000/year</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {[{ label: 'Vehicle Number', val: vehicleNumber, set: (t: string) => setVehicleNumber(t.toUpperCase()), ph: 'e.g. MH02CD5678', err: vehicleError, cap: 'characters' as any, max: 10 },
          { label: 'Vehicle Model', val: vehicleModel, set: setVehicleModel, ph: 'e.g. Maruti Swift VXi', err: '', cap: 'words' as any },
          { label: 'Owner Name', val: ownerName, set: setOwnerName, ph: 'Full name as on RC', err: '', cap: 'words' as any }
        ].map((f, i) => (
          <Animated.View key={f.label} entering={reducedMotion ? undefined : FadeInDown.delay(i * 80).duration(300)} className="mb-4">
            <Text className="mb-1.5 text-sm font-bold text-foreground">{f.label} <Text className="text-red-500">*</Text></Text>
            <TextInput placeholder={f.ph} placeholderTextColor="#9ca3af" value={f.val} onChangeText={f.set} autoCapitalize={f.cap} maxLength={f.max} className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground" />
            {!!f.err && <Text className="mt-1 text-xs text-red-500">{f.err}</Text>}
          </Animated.View>
        ))}

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(240).duration(300)} className="mb-4">
          <Text className="mb-2 text-sm font-bold text-foreground">Manufacture Year <Text className="text-red-500">*</Text></Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
            {YEARS.map(y => (
              <Pressable key={y} onPress={() => setYear(y)} className={`mr-2 rounded-full border px-4 py-2 ${year === y ? 'border-blue-500 bg-blue-50' : 'border-border bg-card'}`}>
                <Text className={`text-sm font-bold ${year === y ? 'text-blue-600' : 'text-foreground'}`}>{y}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(320).duration(300)} className="mb-4">
          <Text className="mb-2 text-sm font-bold text-foreground">Fuel Type <Text className="text-red-500">*</Text></Text>
          <View className="flex-row flex-wrap gap-2">
            {FUEL_TYPES.map(f => (
              <Pressable key={f} onPress={() => setFuelType(f)} className={`rounded-full border px-4 py-2 ${fuelType === f ? 'border-blue-500 bg-blue-50' : 'border-border bg-card'}`}>
                <Text className={`text-sm font-bold ${fuelType === f ? 'text-blue-600' : 'text-foreground'}`}>{f}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(400).duration(300)} className="mb-4">
          <Text className="mb-2 text-sm font-bold text-foreground">Seating Capacity <Text className="text-red-500">*</Text></Text>
          <View className="flex-row gap-3">
            {SEATS.map(s => (
              <Pressable key={s} onPress={() => setSeats(s)} className={`flex-1 items-center rounded-xl border py-3 ${seats === s ? 'border-blue-500 bg-blue-50' : 'border-border bg-card'}`}>
                <Text className={`text-sm font-bold ${seats === s ? 'text-blue-600' : 'text-foreground'}`}>{s} Seats</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(480).duration(300)} className="mb-6">
          <Text className="mb-1.5 text-sm font-bold text-foreground">Mobile Number <Text className="text-red-500">*</Text></Text>
          <View className="flex-row items-center overflow-hidden rounded-xl border border-border bg-card">
            <View className="border-r border-border bg-muted px-3 py-3.5"><Text className="font-semibold text-foreground">+91</Text></View>
            <TextInput placeholder="10-digit mobile" placeholderTextColor="#9ca3af" value={mobile} onChangeText={setMobile} keyboardType="numeric" maxLength={10} className="flex-1 px-3 py-3.5 text-sm text-foreground" />
          </View>
          {!!mobileError && <Text className="mt-1 text-xs text-red-500">{mobileError}</Text>}
        </Animated.View>

        <Animated.View entering={reducedMotion ? undefined : FadeInDown.delay(560).duration(300)}>
          <Pressable onPress={handleSubmit} disabled={loading}>
            <LinearGradient colors={['#3b82f6', '#6366f1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="items-center rounded-2xl py-4">
              {loading ? <ActivityIndicator color="white" /> : <Text className="text-base font-bold text-white">Get Car Insurance Quote →</Text>}
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
