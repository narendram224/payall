// components/home/ExclusiveOffer.jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Gift, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ExclusiveOffer = () => {
  return (
    <TouchableOpacity activeOpacity={0.9}>


      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Gift size={24} color="white" />
          </View>
          <View>
            <Text className="text-lg font-bold text-white">Exclusive offer for you!</Text>
            <Text className="mt-1 text-sm text-white/90">Claim your cashback now</Text>
          </View>
        </View>
        <View className="rounded-full bg-white px-4 py-2 -mr-10 ">
          <Text className="font-semibold text-purple-600">Claim →</Text>
        </View>
      </View>



    </TouchableOpacity>
  );
};

export default ExclusiveOffer;
