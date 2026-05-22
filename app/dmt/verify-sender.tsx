import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { OTPInput } from '@/components/ui/otp-input';
import { useMutation } from '@tanstack/react-query';
import Axios from '@/services/axios.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { toast } from 'react-native-sonner';

export default function VerifySenderScreen() {
  const { mobile_number } = useLocalSearchParams<{ mobile_number: string }>();
  const router = useRouter();
  const [otp, setOtp] = useState('');

  const verifyMutation = useMutation({
    mutationFn: async (otpValue: string) => {
      const payload = new FormData();
      payload.append('mobile_number', mobile_number || '');
      payload.append('otp', otpValue);

      const response = await Axios.post('v2/dmt/add_sender_confirm', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Sender verified successfully!');
      // Navigate to beneficiary list after successful verification
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
            <Text className="text-3xl">📱</Text>
          </View>
          <Text className="mb-2 text-center text-2xl font-bold text-foreground">
            Verify Your Number
          </Text>
          <Text className="px-4 text-center leading-5 text-muted-foreground">
            We&apos;ve sent a 6-digit verification code to
          </Text>
          <Text className="mt-1 text-center font-semibold text-foreground">
            +91 {mobile_number}
          </Text>
        </View>

        <OTPInput length={6} value={otp} onChange={setOtp} className="mb-10" autoFocus />

        <Button
          onPress={handleVerify}
          disabled={verifyMutation.isPending || otp.length < 6}
          className="h-14 rounded-xl shadow-sm">
          <Text className="text-lg font-semibold text-white">
            {verifyMutation.isPending ? 'Verifying...' : 'Verify & Continue'}
          </Text>
        </Button>

        <View className="mt-8 flex-row items-center justify-center">
          <Text className="text-muted-foreground">Didn&apos;t receive the code? </Text>
          <Button
            variant="link"
            className="h-auto p-0"
            onPress={() => toast.success('OTP Resent!')}>
            <Text className="font-semibold text-primary">Resend OTP</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
