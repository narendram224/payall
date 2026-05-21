import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  quickAmounts?: number[];
  className?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChangeText,
  quickAmounts = [10, 20, 50, 100, 200, 500],
  className,
}) => {
  return (
    <View className={cn('w-full', className)}>
      <Text className="text-lg font-semibold mb-3 text-foreground">Enter Amount</Text>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter amount"
        keyboardType="numeric"
        className="text-xl font-bold text-center h-14"
      />
      {quickAmounts.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-4">
          {quickAmounts.map((amount) => (
            <Pressable
              key={amount}
              onPress={() => onChangeText(amount.toString())}
              className={cn(
                'px-4 py-2 rounded-lg border-2 min-w-[70px] items-center justify-center',
                value === amount.toString()
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-semibold',
                  value === amount.toString() ? 'text-primary' : 'text-foreground'
                )}
              >
                ₹{amount}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default AmountInput;
