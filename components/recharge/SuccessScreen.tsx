import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SuccessScreenProps {
  orderId: string;
  amount: string;
  message: string;
  onDone: () => void;
  className?: string;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  orderId,
  amount,
  message,
  onDone,
  className,
}) => {
  return (
    <View className={cn('flex-1 items-center justify-center p-6', className)}>
      <LinearGradient
        colors={['#22c55e', '#16a34a']}
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
      >
        <Text className="text-white text-5xl font-bold">✓</Text>
      </LinearGradient>
      
      <Text className="text-2xl font-bold text-foreground mb-2">Recharge Successful!</Text>
      <Text className="text-muted-foreground text-center mb-6">{message}</Text>
      
      <View className="w-full bg-card border border-border rounded-xl p-4 mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-muted-foreground">Order ID</Text>
          <Text className="font-semibold text-foreground">{orderId}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-muted-foreground">Amount</Text>
          <Text className="font-bold text-xl text-primary">₹{amount}</Text>
        </View>
      </View>
      
      <Button onPress={onDone} className="w-full">
        <Text className="text-primary-foreground font-semibold">Done</Text>
      </Button>
    </View>
  );
};

export default SuccessScreen;
