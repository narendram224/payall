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
    <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-gray-900 text-lg font-semibold">
          Recharge & Bills
        </Text>
        <TouchableOpacity>
          <Text className="text-blue-600 text-sm font-medium">
            View More
          </Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-row justify-between">
        {billOptions.map((option, index) => (
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
