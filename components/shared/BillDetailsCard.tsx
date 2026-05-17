import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface BillDetailsCardProps {
  billerName: string;
  consumerNumber: string;
  consumerName?: string;
  amount: number;
  dueDate?: string;
  billDate?: string;
  className?: string;
}

const BillDetailsCard: React.FC<BillDetailsCardProps> = ({
  billerName,
  consumerNumber,
  consumerName,
  amount,
  dueDate,
  billDate,
  className,
}) => {
  return (
    <View className={cn('bg-white rounded-2xl p-4 shadow-sm', className)}>
      <Text className="text-lg font-bold text-gray-800 mb-4">Bill Details</Text>
      
      <View className="space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Biller</Text>
          <Text className="text-sm font-semibold text-gray-800">{billerName}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Consumer Number</Text>
          <Text className="text-sm font-semibold text-gray-800">{consumerNumber}</Text>
        </View>
        
        {consumerName && (
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">Consumer Name</Text>
            <Text className="text-sm font-semibold text-gray-800">{consumerName}</Text>
          </View>
        )}
        
        {billDate && (
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">Bill Date</Text>
            <Text className="text-sm font-semibold text-gray-800">{billDate}</Text>
          </View>
        )}
        
        {dueDate && (
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">Due Date</Text>
            <Text className="text-sm font-semibold text-gray-800">{dueDate}</Text>
          </View>
        )}
        
        <View className="border-t border-gray-200 pt-3 mt-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-semibold text-gray-800">Amount</Text>
            <Text className="text-xl font-bold text-primary">₹{amount.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BillDetailsCard;
