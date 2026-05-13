import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { QrCode, Send, Building2, History } from 'lucide-react-native';

export const UpiMoneyTransferComponent = () => {
  const transferOptions = [
    {
      icon: QrCode,
      label: 'Scan any QR',
      color: 'bg-blue-500',
    },
    {
      icon: Send,
      label: 'Pay Anyone',
      color: 'bg-green-500',
    },
    {
      icon: Building2,
      label: 'Bank Transfer',
      color: 'bg-orange-500',
    },
    {
      icon: History,
      label: 'Balance & History',
      color: 'bg-purple-500',
    },
  ];

  return (
    <View className="bg-white mx-4 mt-6 p-4 rounded-xl shadow-sm">
      <Text className="text-gray-900 text-lg font-semibold mb-4">
        UPI Money Transfer
      </Text>
      
      <View className="flex-row justify-between">
        {transferOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            className="items-center flex-1"
            style={{ marginHorizontal: index === 0 || index === 3 ? 0 : 8 }}
          >
            <View className={`w-14 h-14 ${option.color} rounded-full items-center justify-center mb-2`}>
              <option.icon size={24} color="white" />
            </View>
            <Text className="text-gray-700 text-xs text-center leading-tight">
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
