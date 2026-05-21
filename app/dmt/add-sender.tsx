import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import Axios from '@/services/axios.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { toast } from 'react-native-sonner';

export default function AddSenderScreen() {
  const { mobile_number } = useLocalSearchParams<{ mobile_number: string }>();
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    pin_code: '',
    address: '',
    state: '',
    dob: '',
    aadhaar_number: '',
  });

  const addSenderMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = new FormData();
      payload.append('mobile_number', mobile_number || '');
      payload.append('first_name', data.first_name);
      payload.append('last_name', data.last_name);
      payload.append('pin_code', data.pin_code);
      payload.append('address', data.address);
      payload.append('address2', data.address); // Duplicate as per postman example
      payload.append('state', data.state);
      payload.append('outlet_id', '2242'); // Static for now as per postman example
      payload.append('dob', data.dob);
      payload.append('aadhaar_number', data.aadhaar_number);

      const response = await Axios.post('v2/dmt/add_sender', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('OTP sent to verify your number');
      router.push({
        pathname: '/dmt/verify-sender',
        params: { mobile_number },
      });
    },
  });

  const handleSubmit = () => {
    if (!formData.first_name || !formData.last_name || !formData.pin_code) {
      toast.error('Please fill all required fields');
      return;
    }
    addSenderMutation.mutate(formData);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <View className="mb-6">
          <Text className="mb-2 text-2xl font-bold text-foreground">Register Sender</Text>
          <Text className="text-muted-foreground">
            Complete your profile to start sending money from {mobile_number}.
          </Text>
        </View>

        <View className="gap-4 space-y-4">
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="mb-1.5 text-sm font-medium text-foreground">First Name *</Text>
              <Input
                placeholder="John"
                value={formData.first_name}
                onChangeText={(t) => setFormData({ ...formData, first_name: t })}
                className="bg-card"
              />
            </View>
            <View className="flex-1">
              <Text className="mb-1.5 text-sm font-medium text-foreground">Last Name *</Text>
              <Input
                placeholder="Doe"
                value={formData.last_name}
                onChangeText={(t) => setFormData({ ...formData, last_name: t })}
                className="bg-card"
              />
            </View>
          </View>

          <View>
            <Text className="mb-1.5 text-sm font-medium text-foreground">Aadhaar Number *</Text>
            <Input
              placeholder="1234 5678 9012"
              keyboardType="number-pad"
              maxLength={12}
              value={formData.aadhaar_number}
              onChangeText={(t) => setFormData({ ...formData, aadhaar_number: t })}
              className="bg-card"
            />
          </View>

          <View>
            <Text className="mb-1.5 text-sm font-medium text-foreground">Date of Birth</Text>
            <Input
              placeholder="YYYY-MM-DD"
              value={formData.dob}
              onChangeText={(t) => setFormData({ ...formData, dob: t })}
              className="bg-card"
            />
          </View>

          <View>
            <Text className="mb-1.5 text-sm font-medium text-foreground">Address</Text>
            <Input
              placeholder="Full Address"
              value={formData.address}
              onChangeText={(t) => setFormData({ ...formData, address: t })}
              className="bg-card"
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="mb-1.5 text-sm font-medium text-foreground">State</Text>
              <Input
                placeholder="Delhi"
                value={formData.state}
                onChangeText={(t) => setFormData({ ...formData, state: t })}
                className="bg-card"
              />
            </View>
            <View className="flex-1">
              <Text className="mb-1.5 text-sm font-medium text-foreground">Pin Code *</Text>
              <Input
                placeholder="110096"
                keyboardType="number-pad"
                maxLength={6}
                value={formData.pin_code}
                onChangeText={(t) => setFormData({ ...formData, pin_code: t })}
                className="bg-card"
              />
            </View>
          </View>
        </View>

        <Button
          onPress={handleSubmit}
          disabled={addSenderMutation.isPending}
          className="mt-8 h-14 rounded-xl">
          <Text className="text-lg font-semibold text-white">
            {addSenderMutation.isPending ? 'Registering...' : 'Register & Send OTP'}
          </Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
