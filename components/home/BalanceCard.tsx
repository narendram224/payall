import React, { useState } from 'react';
import { View, TouchableOpacity, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Wallet, ArrowUpRight, ArrowDownLeft, Eye, EyeOff } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  useReducedMotion,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useUser } from '@/hooks/useUser';

const BalanceCard = () => {
  const reducedMotion = useReducedMotion();
  const { user, walletBalance, isLoading } = useUser();
  const [hidden, setHidden] = useState(false);
  const opacity = useSharedValue(1);

  const toggleHide = () => {
    opacity.value = withTiming(hidden ? 1 : 0, { duration: 200 });
    setHidden(!hidden);
  };

  const balanceStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const displayBalance = walletBalance
    ? `₹${parseFloat(walletBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    : '₹0.00';

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(400)}
      className="rounded-2xl bg-white p-5 shadow-sm"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 }}
    >
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Wallet size={22} color="#00B9F2" />
          <Text className="font-semibold text-gray-600">
            {isLoading ? 'Loading…' : (user?.name ?? 'Pay2All Wallet')}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleHide} className="p-1">
          {hidden
            ? <EyeOff size={18} color="#9ca3af" />
            : <Eye size={18} color="#9ca3af" />
          }
        </TouchableOpacity>
      </View>

      {/* Balance */}
      <Animated.View style={balanceStyle}>
        {isLoading ? (
          <View className="mb-2 h-9 w-32 rounded-lg bg-gray-100" />
        ) : (
          <Text className="mb-1 text-3xl font-bold text-gray-800">
            {hidden ? '₹ ••••••' : displayBalance}
          </Text>
        )}
      </Animated.View>

      <Text className="text-sm text-gray-500">
        {user?.mobile ? `UPI: ${user.mobile}@pay2all` : 'Pay2All Wallet Balance'}
      </Text>

      {/* Actions */}
      <View className="mt-5 flex-row justify-between border-t border-gray-100 pt-4">
        <Pressable onPress={() => router.push('/dmt')} className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <ArrowUpRight size={20} color="#00B9F2" />
          </View>
          <Text className="font-medium text-gray-700">Send</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/services/finance/payout' as any)} className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <ArrowDownLeft size={20} color="#00B9F2" />
          </View>
          <Text className="font-medium text-gray-700">Payout</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/services/billing/all' as any)} className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <Text className="text-lg font-bold text-blue-500">₹</Text>
          </View>
          <Text className="font-medium text-gray-700">Pay Bills</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default BalanceCard;
