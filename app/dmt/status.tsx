import React, { useEffect, useState } from 'react';
import { View, BackHandler } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated';

export default function StatusScreen() {
  const { report_id, amount, beneficiary_name, mobile_number } = useLocalSearchParams<{
    report_id: string;
    amount: string;
    beneficiary_name: string;
    mobile_number: string;
  }>();

  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['transaction_status', report_id],
    queryFn: async () => {
      const payload = new FormData();
      payload.append('report_id', report_id || '');

      const response = await apiClient.post('v1/dmt/status', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    // We could poll here using refetchInterval if status is pending
    // refetchInterval: (data) => data?.status === 'pending' ? 3000 : false,
    enabled: !!report_id,
  });

  // Prevent going back to transfer screen
  useEffect(() => {
    const onBackPress = () => {
      router.replace({ pathname: '/dmt/beneficiaries', params: { mobile_number } });
      return true; // prevent default
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [mobile_number, router]);

  const handleDone = () => {
    router.replace({ pathname: '/dmt/beneficiaries', params: { mobile_number } });
  };

  const status = data?.status?.toLowerCase() || 'pending';
  const isSuccess = status === 'success' || status === 'accepted';
  const isPending = status === 'pending' || isLoading;
  const isFailed = status === 'failed' || status === 'rejected' || error;

  return (
    <View className="flex-1 justify-center bg-background p-6">
      <View className="flex-1 items-center justify-center">
        {isPending && (
          <Animated.View entering={ZoomIn.duration(400)} className="items-center">
            <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-yellow-500/20">
              <Text className="text-4xl">⏳</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">Processing Transfer</Text>
            <Text className="mt-2 text-center text-muted-foreground">
              Please wait while we confirm your transaction...
            </Text>
          </Animated.View>
        )}

        {isSuccess && (
          <Animated.View entering={ZoomIn.duration(400)} className="items-center">
            <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-green-500/20">
              <Text className="text-4xl">✅</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">Transfer Successful</Text>
            <Text className="mt-2 text-center text-lg text-muted-foreground">
              ₹{amount} sent to {beneficiary_name}
            </Text>
            {report_id && (
              <View className="mt-6 rounded-lg border border-border bg-card px-4 py-2">
                <Text className="text-sm text-muted-foreground">Ref ID: {report_id}</Text>
              </View>
            )}
          </Animated.View>
        )}

        {isFailed && (
          <Animated.View entering={ZoomIn.duration(400)} className="items-center">
            <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-destructive/20">
              <Text className="text-4xl">❌</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">Transfer Failed</Text>
            <Text className="mt-2 text-center text-muted-foreground">
              {data?.message ||
                'We could not process your transaction. Any deducted amount will be refunded.'}
            </Text>
          </Animated.View>
        )}
      </View>

      <Animated.View entering={FadeInDown.delay(500).duration(400)}>
        <Button
          onPress={handleDone}
          disabled={isPending}
          variant={isFailed ? 'outline' : 'default'}
          className="h-14 rounded-xl">
          <Text className={isFailed ? 'font-semibold text-foreground' : 'font-semibold text-white'}>
            {isFailed ? 'Back to Beneficiaries' : 'Done'}
          </Text>
        </Button>
      </Animated.View>
    </View>
  );
}
