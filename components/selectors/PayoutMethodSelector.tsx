import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@/lib/utils';

interface PayoutMethod {
  id: string;
  name: string;
  code: string;
  description: string;
  processingTime: string;
}

interface PayoutMethodSelectorProps {
  methods: PayoutMethod[];
  selectedMethod: PayoutMethod | null;
  onSelectMethod: (method: PayoutMethod) => void;
  className?: string;
}

const PayoutMethodSelector: React.FC<PayoutMethodSelectorProps> = ({
  methods,
  selectedMethod,
  onSelectMethod,
  className,
}) => {
  return (
    <View className={cn('w-full', className)}>
      <Text className="text-lg font-semibold mb-3 text-foreground">Select Payout Method</Text>
      <View className="space-y-3">
        {methods.map((method) => (
          <Pressable
            key={method.id}
            onPress={() => onSelectMethod(method)}
            className={cn(
              'flex-row items-center justify-between p-4 rounded-xl border-2',
              selectedMethod?.id === method.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card'
            )}
          >
            <View className="flex-1">
              <Text
                className={cn(
                  'text-base font-semibold',
                  selectedMethod?.id === method.id
                    ? 'text-primary'
                    : 'text-foreground'
                )}
              >
                {method.name}
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                {method.description}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Processing: {method.processingTime}
              </Text>
            </View>
            <View
              className={cn(
                'w-6 h-6 rounded-full border-2 items-center justify-center',
                selectedMethod?.id === method.id
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              )}
            >
              {selectedMethod?.id === method.id && (
                <View className="w-3 h-3 rounded-full bg-white" />
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default PayoutMethodSelector;
