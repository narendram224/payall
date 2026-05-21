import React from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  useReducedMotion,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck, X } from 'lucide-react-native';

interface PaymentConfirmSheetProps {
  visible: boolean;
  billerName: string;
  consumerNumber: string;
  amount: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PaymentConfirmSheet: React.FC<PaymentConfirmSheetProps> = ({
  visible,
  billerName,
  consumerNumber,
  amount,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const reducedMotion = useReducedMotion();
  if (!visible) return null;

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(200)}
      exiting={reducedMotion ? undefined : FadeOut.duration(200)}
      className="absolute inset-0 z-50 items-center justify-end"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <Pressable className="absolute inset-0" onPress={onCancel} />

      <Animated.View
        entering={reducedMotion ? undefined : SlideInDown.springify().damping(18).stiffness(200)}
        className="w-full rounded-t-3xl bg-card px-6 pb-10 pt-6"
      >
        {/* Handle */}
        <View className="mb-6 self-center h-1 w-10 rounded-full bg-muted" />

        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-foreground">Confirm Payment</Text>
          <Pressable onPress={onCancel} className="h-8 w-8 items-center justify-center rounded-full bg-muted">
            <X size={16} color="#6b7280" />
          </Pressable>
        </View>

        {/* Summary */}
        <View className="mb-6 rounded-2xl bg-muted/50 p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm text-muted-foreground">Biller</Text>
            <Text className="text-sm font-semibold text-foreground">{billerName}</Text>
          </View>
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm text-muted-foreground">Consumer No.</Text>
            <Text className="text-sm font-semibold text-foreground">{consumerNumber}</Text>
          </View>
          <View className="h-px bg-border my-1" />
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-foreground">Total Amount</Text>
            <Text className="text-xl font-bold text-primary">
              ₹{parseFloat(amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Security badge */}
        <View className="mb-5 flex-row items-center justify-center gap-2">
          <ShieldCheck size={14} color="#22c55e" />
          <Text className="text-xs text-muted-foreground">Secured by Pay2All. 256-bit encryption.</Text>
        </View>

        {/* CTA */}
        <Pressable onPress={onConfirm} disabled={isLoading}>
          <LinearGradient
            colors={isLoading ? ['#94a3b8', '#94a3b8'] : ['#3b82f6', '#6366f1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="items-center justify-center rounded-2xl py-4"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-bold text-white">
                Pay ₹{parseFloat(amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Text>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

export default PaymentConfirmSheet;
