import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { OTPInput } from '@/components/ui/otp-input';
import { useMutation } from '@tanstack/react-query';
import Axios from '@/services/axios.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { toast } from 'react-native-sonner';

export default function VerifyBeneficiaryScreen() {
  const { mobile_number, dmtbeneficiary_id } = useLocalSearchParams<{
    mobile_number: string;
    dmtbeneficiary_id: string;
  }>();
  const router = useRouter();
  const [otp, setOtp] = useState('');

  const verifyMutation = useMutation({
    mutationFn: async (otpValue: string) => {
      const payload = new FormData();
      payload.append('mobile_number', mobile_number || '');
      payload.append('dmtbeneficiary_id', dmtbeneficiary_id || '');
      payload.append('otp', otpValue);

      const response = await Axios.post('v2/dmt/add_beneficiary_confirm', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Beneficiary activated successfully!');
      // Navigate back to beneficiary list and it will refetch automatically if we used query invalidation,
      // but simpler to just replace route.
      router.replace({
        pathname: '/dmt/beneficiaries',
        params: { mobile_number },
      });
    },
  });

  const handleVerify = () => {
    if (otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    verifyMutation.mutate(otp);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View className="mb-8 mt-10 items-center">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Text className="text-3xl">🛡️</Text>
          </View>
          <Text className="mb-2 text-center text-2xl font-bold text-foreground">
            Verify Beneficiary
          </Text>
          <Text className="px-4 text-center leading-5 text-muted-foreground">
            Enter the OTP sent to your registered mobile number to confirm the new beneficiary.
          </Text>
        </View>

        <OTPInput length={6} value={otp} onChange={setOtp} className="mb-10" autoFocus />

        <Button
          onPress={handleVerify}
          disabled={verifyMutation.isPending || otp.length < 6}
          className="h-14 rounded-xl shadow-sm">
          <Text className="text-lg font-semibold text-white">
            {verifyMutation.isPending ? 'Verifying...' : 'Activate Beneficiary'}
          </Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
