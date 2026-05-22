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
      <Text className="mb-2 mt-4 px-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        Enter Amount
      </Text>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter amount"
        keyboardType="numeric"
        className="h-14 text-center text-xl font-bold"
      />
      {quickAmounts.length > 0 && (
        <View className="mt-4 flex-row flex-wrap gap-2">
          {quickAmounts.map((amount) => (
            <Pressable
              key={amount}
              onPress={() => onChangeText(amount.toString())}
              className={cn(
                'min-w-[70px] items-center justify-center rounded-lg border-2 px-4 py-2',
                value === amount.toString()
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card'
              )}>
              <Text
                className={cn(
                  'text-sm font-semibold',
                  value === amount.toString() ? 'text-primary' : 'text-slate-600'
                )}>
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
