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
    <View className="mx-4 mt-6 rounded-xl bg-white p-4 shadow-sm">
      <Text className="mb-4 text-lg font-semibold text-gray-900">UPI Money Transfer</Text>

      <View className="flex-row justify-between">
        {transferOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            className="flex-1 items-center"
            style={{ marginHorizontal: index === 0 || index === 3 ? 0 : 8 }}>
            <View
              className={`h-14 w-14 ${option.color} mb-2 items-center justify-center rounded-full`}>
              <option.icon size={24} color="white" />
            </View>
            <Text className="text-center text-xs leading-tight text-gray-700">{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
