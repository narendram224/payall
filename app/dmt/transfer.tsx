import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useMutation } from '@tanstack/react-query';
import Axios from '@/services/axios.service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { toast } from 'react-native-sonner';

export default function TransferScreen() {
  const { mobile_number, dmtbeneficiary_id, beneficiary_name, bank_account_number, bank_name } =
    useLocalSearchParams<{
      mobile_number: string;
      dmtbeneficiary_id: string;
      beneficiary_name: string;
      bank_account_number: string;
      bank_name: string;
    }>();

  const router = useRouter();
  const [amount, setAmount] = useState('');

  const transferMutation = useMutation({
    mutationFn: async (transferAmount: string) => {
      const payload = new FormData();
      payload.append('dmtbeneficiary_id', dmtbeneficiary_id || '');
      payload.append('mobile_number', mobile_number || '');
      payload.append('amount', transferAmount);
      payload.append('client_id', `DMT${Date.now()}`); // Unique idempotent ID
      payload.append('provider_id', '1'); // Assuming 1 for primary provider
      payload.append('lat', '0.0');
      payload.append('long', '0.0');
      payload.append('channel_id', '2'); // IMPS

      const response = await Axios.post('v2/dmt/transfer', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Pass the report_id to the status screen to poll/verify
      const reportId = data?.data?.report_id || data?.report_id || '';

      router.replace({
        pathname: '/dmt/status',
        params: {
          report_id: reportId,
          amount,
          beneficiary_name,
          mobile_number,
        },
      });
    },
  });

  const handleTransfer = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    transferMutation.mutate(amount);
  };

  const initials = beneficiary_name ? beneficiary_name.substring(0, 2).toUpperCase() : 'BN';
  const maskedAccount =
    bank_account_number?.length >= 4
      ? `•••• ${bank_account_number.slice(-4)}`
      : bank_account_number;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        {/* Recipient Info */}
        <View className="mb-12 mt-6 items-center">
          <Avatar alt={beneficiary_name || 'Recipient'} className="mb-4 h-20 w-20 bg-primary/10">
            <AvatarFallback>
              <Text className="text-2xl font-bold text-primary">{initials}</Text>
            </AvatarFallback>
          </Avatar>
          <Text className="text-xl font-bold text-foreground">Paying {beneficiary_name}</Text>
          <Text className="mt-1 text-muted-foreground">
            {bank_name} • {maskedAccount}
          </Text>
        </View>

        {/* Amount Input */}
        <View className="mb-12 flex-1 items-center justify-center">
          <View className="flex-row items-center justify-center">
            <Text className="mr-2 text-4xl font-semibold text-foreground">₹</Text>
            <Input
              value={amount}
              onChangeText={(text) => {
                // Allow only numbers and optionally one decimal
                if (/^\d*\.?\d*$/.test(text)) {
                  setAmount(text);
                }
              }}
              placeholder="0"
              keyboardType="decimal-pad"
              autoFocus
              className="min-w-[150px] border-0 bg-transparent px-0 text-center text-6xl font-bold"
              style={{ fontSize: 60, height: 80 }}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Confirm Button */}
        <Button
          onPress={handleTransfer}
          disabled={transferMutation.isPending || !amount || parseFloat(amount) <= 0}
          className="h-16 rounded-2xl shadow-lg shadow-primary/30">
          <Text className="text-xl font-semibold text-white">
            {transferMutation.isPending ? 'Processing...' : `Send ₹${amount || '0'}`}
          </Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
