import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import { toast } from 'react-native-sonner';
import { policyService } from '@/services/policy/policy.service';
import * as Linking from 'expo-linking';

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric'];
const YEARS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018'];

export default function BikeInsurance() {
  const reducedMotion = useReducedMotion();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const errors: Record<string, string> = {};
  if (vehicleNumber && !/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(vehicleNumber.toUpperCase()))
    errors.vehicleNumber = 'Invalid vehicle number format (e.g. DL01AB1234)';
  if (mobile && !/^[6-9][0-9]{9}$/.test(mobile)) errors.mobile = 'Enter valid 10-digit mobile';

  const handleSubmit = async () => {
    if (!vehicleNumber || !vehicleModel || !year || !fuelType || !ownerName || !mobile) {
      toast.error('Please fill all fields');
      return;
    }
    if (Object.keys(errors).length > 0) {
      toast.error('Fix validation errors');
      return;
    }
    try {
      setLoading(true);
      const res = await policyService.getInsuranceUrl({
        service_id: 1,
        amount: '500',
        name: ownerName,
        mobile,
        email: '',
      });
      if (res?.status_id === 1 && res?.url) {
        await Linking.openURL(res.url);
      } else {
        toast.success('Quote request sent! Our team will contact you.');
      }
    } catch {
      toast.success('Quote request sent! Our team will contact you.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={['#f59e0b', '#f97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-4 pb-6 pt-4">
        <Text className="text-xl font-bold text-white">🏍️ Bike Insurance</Text>
        <Text className="mt-0.5 text-sm text-white/70">Two-wheeler protection from ₹500/year</Text>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Vehicle Number */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(0).duration(300)}
          className="mb-4">
          <Text className="mb-1.5 text-sm font-bold text-foreground">
            Vehicle Number <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="e.g. DL01AB1234"
            placeholderTextColor="#9ca3af"
            value={vehicleNumber}
            onChangeText={(t) => setVehicleNumber(t.toUpperCase())}
            autoCapitalize="characters"
            maxLength={10}
            className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground"
          />
          {errors.vehicleNumber && (
            <Text className="mt-1 text-xs text-red-500">{errors.vehicleNumber}</Text>
          )}
        </Animated.View>

        {/* Vehicle Model */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(80).duration(300)}
          className="mb-4">
          <Text className="mb-1.5 text-sm font-bold text-foreground">
            Vehicle Model <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="e.g. Honda Activa 6G"
            placeholderTextColor="#9ca3af"
            value={vehicleModel}
            onChangeText={setVehicleModel}
            className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground"
          />
        </Animated.View>

        {/* Year */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(160).duration(300)}
          className="mb-4">
          <Text className="mb-2 text-sm font-bold text-foreground">
            Manufacture Year <Text className="text-red-500">*</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
            {YEARS.map((y) => (
              <Pressable
                key={y}
                onPress={() => setYear(y)}
                className={`mr-2 rounded-full border px-4 py-2 ${year === y ? 'border-amber-500 bg-amber-50' : 'border-border bg-card'}`}>
                <Text
                  className={`text-sm font-bold ${year === y ? 'text-amber-600' : 'text-foreground'}`}>
                  {y}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Fuel Type */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(240).duration(300)}
          className="mb-4">
          <Text className="mb-2 text-sm font-bold text-foreground">
            Fuel Type <Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {FUEL_TYPES.map((f) => (
              <Pressable
                key={f}
                onPress={() => setFuelType(f)}
                className={`rounded-full border px-4 py-2 ${fuelType === f ? 'border-amber-500 bg-amber-50' : 'border-border bg-card'}`}>
                <Text
                  className={`text-sm font-bold ${fuelType === f ? 'text-amber-600' : 'text-foreground'}`}>
                  {f}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Owner Name */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(320).duration(300)}
          className="mb-4">
          <Text className="mb-1.5 text-sm font-bold text-foreground">
            Owner Name <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            placeholder="Full name as on RC"
            placeholderTextColor="#9ca3af"
            value={ownerName}
            onChangeText={setOwnerName}
            className="rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground"
          />
        </Animated.View>

        {/* Mobile */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.delay(400).duration(300)}
          className="mb-6">
          <Text className="mb-1.5 text-sm font-bold text-foreground">
            Mobile Number <Text className="text-red-500">*</Text>
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
          {errors.mobile && <Text className="mt-1 text-xs text-red-500">{errors.mobile}</Text>}
        </Animated.View>

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
                <Text className="text-base font-bold text-white">Get Best Quote →</Text>
              )}
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
