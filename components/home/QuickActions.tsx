// components/home/QuickActions.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { QrCode, TrendingUp, CreditCard, Gift } from 'lucide-react-native';

const actions = [
  { icon: QrCode, label: 'Scan QR', color: '#00B9F2', bgColor: '#E0F5FF' },
  { icon: TrendingUp, label: 'Pay Anyone', color: '#10B981', bgColor: '#D1FAE5' },
  { icon: CreditCard, label: 'Bank Transfer', color: '#8B5CF6', bgColor: '#EDE9FE' },
  { icon: Gift, label: 'Cashback', color: '#F97316', bgColor: '#FFEDD5' },
];

const QuickActions = () => {
  return (
    <View className="px-4">
      <View className="rounded-2xl bg-white p-4">
        <View className="mb-3 flex-row justify-between">
          <Text className="text-sm font-semibold text-gray-800">Refer & win</Text>
          <Text className="text-paytm-blue font-bold">Upto ₹200 →</Text>
        </View>

        <View className="mb-4 flex-row items-center justify-between rounded-xl bg-yellow-50 p-3">
          <View>
            <Text className="text-sm text-gray-700">Send ₹10</Text>
            <Text className="text-xs text-gray-500">Get up to ₹10 Cashback</Text>
            <Text className="text-xs text-gray-500">Also ₹50 Recharge & Bill Payment Voucher</Text>
          </View>
          <TouchableOpacity className="rounded-lg bg-yellow-500 px-4 py-2">
            <Text className="font-semibold text-white">Send →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
          {actions.map((action, index) => (
            <TouchableOpacity key={index} className="mr-6 items-center">
              <View
                className="h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: action.bgColor }}>
                <action.icon size={28} color={action.color} />
              </View>
              <Text className="mt-2 text-xs text-gray-600">{action.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default QuickActions;
