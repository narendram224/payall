// components/home/BalanceCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

const BalanceCard = () => {
  return (
    <View
      className="rounded-2xl bg-white p-5 shadow-lg"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}>
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Wallet size={24} color="#00B9F2" />
          <Text className="ml-2 font-medium text-gray-600">Paytm Wallet</Text>
        </View>
        <TouchableOpacity>
          <Text className="text-paytm-blue text-sm font-medium">Add Money</Text>
        </TouchableOpacity>
      </View>

      <Text className="mb-2 text-3xl font-bold text-gray-800">₹ 1,250</Text>
      <Text className="text-sm text-gray-500">UPI ID: rahul@paytm</Text>

      <View className="mt-5 flex-row justify-between border-t border-gray-100 pt-4">
        <TouchableOpacity className="flex-row items-center">
          <View className="bg-paytm-blue/10 mr-2 h-10 w-10 items-center justify-center rounded-full">
            <ArrowUpRight size={20} color="#00B9F2" />
          </View>
          <Text className="font-medium text-gray-700">Send</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <View className="bg-paytm-blue/10 mr-2 h-10 w-10 items-center justify-center rounded-full">
            <ArrowDownLeft size={20} color="#00B9F2" />
          </View>
          <Text className="font-medium text-gray-700">Request</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <View className="bg-paytm-blue/10 mr-2 h-10 w-10 items-center justify-center rounded-full">
            <Text className="text-paytm-blue text-lg font-bold">₹</Text>
          </View>
          <Text className="font-medium text-gray-700">Balance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BalanceCard;
