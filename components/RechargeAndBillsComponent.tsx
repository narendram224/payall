import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Smartphone, CreditCard, Zap, FileText } from 'lucide-react-native';

export const RechargeAndBillsComponent = () => {
  const billOptions = [
    {
      icon: Smartphone,
      label: 'Mobile Recharge',
      color: 'bg-blue-500',
    },
    {
      icon: CreditCard,
      label: 'FASTag Recharge',
      color: 'bg-purple-500',
    },
    {
      icon: Zap,
      label: 'Electricity Bill',
      color: 'bg-yellow-500',
    },
    {
      icon: FileText,
      label: 'Loan EMI Payment',
      color: 'bg-green-500',
    },
  ];

  return (
    <View className="mx-4 mt-4 rounded-xl bg-white p-4 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900">Recharge & Bills</Text>
        <TouchableOpacity>
          <Text className="text-sm font-medium text-blue-600">View More</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between">
        {billOptions.map((option, index) => (
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
