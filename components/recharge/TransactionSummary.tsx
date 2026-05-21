import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface TransactionSummaryProps {
  operatorName: string;
  number: string;
  amount: string;
  className?: string;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  operatorName,
  number,
  amount,
  className,
}) => {
  return (
    <View className={cn('w-full bg-card border border-border rounded-xl p-4', className)}>
      <Text className="text-lg font-semibold mb-4 text-foreground">Transaction Summary</Text>
      
      <View className="space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-muted-foreground">Operator</Text>
          <Text className="font-semibold text-foreground">{operatorName}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-muted-foreground">Number</Text>
          <Text className="font-semibold text-foreground">{number}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-muted-foreground">Amount</Text>
          <Text className="font-bold text-xl text-primary">₹{amount}</Text>
        </View>
      </View>
      
      <View className="border-t border-border mt-4 pt-4">
        <Text className="text-xs text-muted-foreground text-center">
          By proceeding, you agree to the terms and conditions
        </Text>
      </View>
    </View>
  );
};

export default TransactionSummary;
