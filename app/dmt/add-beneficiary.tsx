import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { toast } from 'react-native-sonner';

export default function AddBeneficiaryScreen() {
  const { mobile_number } = useLocalSearchParams<{ mobile_number: string }>();
  const router = useRouter();

  const [formData, setFormData] = useState({
    beneficiary_name: '',
    bank_account_number: '',
    ifsc: '',
    bank_id: '1', // Hardcoded for UI sake until bank list selection is implemented
  });

  const addBeneficiaryMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = new FormData();
      payload.append('mobile_number', mobile_number || '');
      payload.append('bank_account_number', data.bank_account_number);
      payload.append('beneficiary_name', data.beneficiary_name);
      payload.append('ifsc', data.ifsc);
      payload.append('bank_id', data.bank_id);

      const response = await apiClient.post('v2/dmt/add_beneficiary', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Beneficiary addition initiated.');
      // Proceed to OTP confirmation
      router.push({
        pathname: '/dmt/verify-beneficiary',
        params: {
          mobile_number,
          dmtbeneficiary_id: data?.data?.dmtbeneficiary_id || data?.dmtbeneficiary_id || '',
        },
      });
    },
  });

  const handleSubmit = () => {
    if (!formData.beneficiary_name || !formData.bank_account_number || !formData.ifsc) {
      toast.error('Please fill all required fields');
      return;
    }
    addBeneficiaryMutation.mutate(formData);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        <View className="mb-6">
          <Text className="mb-2 text-2xl font-bold text-foreground">Add Beneficiary</Text>
          <Text className="text-muted-foreground">
            Enter the recipient's bank details. Ensure the details match their bank records.
          </Text>
        </View>

        <View className="gap-4 space-y-4">
          <View>
            <Text className="mb-1.5 text-sm font-medium text-foreground">Beneficiary Name *</Text>
            <Input
              placeholder="Full Name as per bank"
              value={formData.beneficiary_name}
              onChangeText={(t) => setFormData({ ...formData, beneficiary_name: t })}
              className="bg-card"
            />
          </View>

          <View>
            <Text className="mb-1.5 text-sm font-medium text-foreground">
              Bank Account Number *
            </Text>
            <Input
              placeholder="e.g. 1234567890"
              keyboardType="number-pad"
              value={formData.bank_account_number}
              onChangeText={(t) => setFormData({ ...formData, bank_account_number: t })}
              className="bg-card"
            />
          </View>

          <View>
            <Text className="mb-1.5 text-sm font-medium text-foreground">IFSC Code *</Text>
            <Input
              placeholder="e.g. SBIN0001234"
              autoCapitalize="characters"
              value={formData.ifsc}
              onChangeText={(t) => setFormData({ ...formData, ifsc: t.toUpperCase() })}
              className="bg-card"
            />
          </View>
        </View>

        <Button
          onPress={handleSubmit}
          disabled={addBeneficiaryMutation.isPending}
          className="mt-8 h-14 rounded-xl">
          <Text className="text-lg font-semibold text-white">
            {addBeneficiaryMutation.isPending ? 'Adding...' : 'Add Beneficiary'}
          </Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
