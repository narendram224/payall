import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const SendMoneyComponent = () => {
  return (
    <View className="bg-gradient-to-r from-blue-500 to-blue-600 mx-4 mt-4 p-4 rounded-xl">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-white text-2xl font-bold">Send ₹10</Text>
          <Text className="text-white/90 text-sm mt-1">
            Get up to ₹10 Cashback
          </Text>
          <Text className="text-white/80 text-xs mt-2">
            Also ₹50 Recharge & Bill Payment Voucher
          </Text>
        </View>
        
        <TouchableOpacity className="bg-white px-4 py-2 rounded-lg">
          <Text className="text-blue-600 font-semibold text-sm">Claim Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
