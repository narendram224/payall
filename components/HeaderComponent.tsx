import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Search, Bell, User } from 'lucide-react-native';

export const HeaderComponent = () => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <View className="bg-blue-600 px-4 pb-4 pt-12">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white">Refer & win</Text>
          <Text className="text-sm text-white/80">Get ₹100 cashback</Text>
        </View>

        <View className="flex-row space-x-3">
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Search size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="relative h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Bell size={20} color="white" />
            <View className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
