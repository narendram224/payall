import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { useRouter } from 'expo-router';
import { toast } from 'react-native-sonner';

export default function DMTVerificationScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const router = useRouter();

  const verifyMutation = useMutation({
    mutationFn: async (mobile: string) => {
      // According to API Plan:
      // Endpoint: POST {{url}}v2/dmt/verification
      // Payload: formdata { mobile_number, outlet_mobile_number }
      const formData = new FormData();
      formData.append('mobile_number', mobile);
      formData.append('outlet_mobile_number', mobile); // Setting outlet mobile same as sender mobile for now

      const response = await apiClient.post('v2/dmt/verification', formData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Verification Response:', data);
      // Determine if user exists based on API response structure
      // Example: Assuming API returns `status: true` and a specific message/code if the user does NOT exist
      // Here we assume the API handles it as: if the user needs to be added, it will return a specific state
      // We check if data says "Sender not found" or similar. Modify according to actual payload.
      if (data.status === false && data.message?.toLowerCase().includes('not found')) {
        toast.error('Sender not registered. Please register.');
        router.push({ pathname: '/dmt/add-sender', params: { mobile_number: mobileNumber } });
      } else {
        toast.success('Sender verified successfully');
        router.push({ pathname: '/dmt/beneficiaries', params: { mobile_number: mobileNumber } });
      }
    },
    onError: (error: any) => {
      // React Query cache from _layout handles general error toast, but we can customize
      const msg = error?.response?.data?.message || 'Verification failed';

      // If error explicitly means user is not registered:
      if (
        error?.response?.status === 404 ||
        msg.toLowerCase().includes('not found') ||
        msg.toLowerCase().includes('not registered')
      ) {
        toast.info('Sender not registered. Proceeding to registration.');
        router.push({ pathname: '/dmt/add-sender', params: { mobile_number: mobileNumber } });
        return;
      }
      toast.error(msg);
    },
  });

  const handleVerify = () => {
    if (mobileNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    verifyMutation.mutate(mobileNumber);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 pt-12">
          <View className="mb-8">
            <Text className="mb-2 text-3xl font-extrabold text-foreground">Money Transfer</Text>
            <Text className="text-base text-muted-foreground">
              Enter the sender&apos;s mobile number to start sending money instantly.
            </Text>
          </View>

          <View className="gap-4 space-y-4">
            <View>
              <Text className="mb-1.5 text-sm font-medium text-foreground">Mobile Number</Text>
              <Input
                placeholder="e.g. 9876543210"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                className="h-14 border-muted bg-card text-lg"
              />
            </View>

            <Button
              onPress={handleVerify}
              disabled={verifyMutation.isPending || mobileNumber.length < 10}
              className="mt-6 h-14 rounded-xl">
              <Text className="text-lg font-semibold text-white">
                {verifyMutation.isPending ? 'Verifying...' : 'Continue'}
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
