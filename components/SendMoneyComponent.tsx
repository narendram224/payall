import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const SendMoneyComponent = () => {
  return (
    <View className="mx-4 mt-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-white">Send ₹10</Text>
          <Text className="mt-1 text-sm text-white/90">Get up to ₹10 Cashback</Text>
          <Text className="mt-2 text-xs text-white/80">
            Also ₹50 Recharge & Bill Payment Voucher
          </Text>
        </View>

        <TouchableOpacity className="rounded-lg bg-white px-4 py-2">
          <Text className="text-sm font-semibold text-blue-600">Claim Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
