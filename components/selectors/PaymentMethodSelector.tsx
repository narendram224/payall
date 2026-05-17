import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { cn } from '@/lib/utils';

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'netbanking' | 'card' | 'upi' | 'wallet';
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  className?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selectedMethod,
  onSelectMethod,
  className,
}) => {
  return (
    <View className={cn('w-full', className)}>
      <Text className="mb-3 text-lg font-semibold text-foreground">Select Payment Method</Text>
      <View className="grid grid-cols-2 gap-3">
        {methods.map((method) => (
          <Pressable
            key={method.id}
            onPress={() => onSelectMethod(method)}
            className={cn(
              'flex-col items-center justify-center rounded-xl border-2 p-4',
              selectedMethod?.id === method.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card'
            )}>
            {method.icon ? (
              <Image
                source={{ uri: method.icon }}
                className="mb-2 h-12 w-12"
                resizeMode="contain"
              />
            ) : (
              <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <Text className="text-2xl">💳</Text>
              </View>
            )}
            <Text
              className={cn(
                'text-center text-xs',
                selectedMethod?.id === method.id ? 'font-semibold text-primary' : 'text-foreground'
              )}
              numberOfLines={2}>
              {method.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default PaymentMethodSelector;
