import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface TransactionSummaryProps {
  transactionType: string;
  recipientName?: string;
  accountNumber?: string;
  bankName?: string;
  amount: number;
  transactionDate?: string;
  className?: string;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  transactionType,
  recipientName,
  accountNumber,
  bankName,
  amount,
  transactionDate,
  className,
}) => {
  return (
    <View className={cn('bg-white rounded-2xl p-4 shadow-sm', className)}>
      <Text className="text-lg font-bold text-gray-800 mb-4">Transaction Summary</Text>
      
      <View className="space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Transaction Type</Text>
          <Text className="text-sm font-semibold text-gray-800">{transactionType}</Text>
        </View>
        
        {recipientName && (
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">Recipient Name</Text>
            <Text className="text-sm font-semibold text-gray-800">{recipientName}</Text>
          </View>
        )}
        
        {accountNumber && (
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">Account Number</Text>
            <Text className="text-sm font-semibold text-gray-800">{accountNumber}</Text>
          </View>
        )}
        
        {bankName && (
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">Bank</Text>
            <Text className="text-sm font-semibold text-gray-800">{bankName}</Text>
          </View>
        )}
        
        {transactionDate && (
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">Transaction Date</Text>
            <Text className="text-sm font-semibold text-gray-800">{transactionDate}</Text>
          </View>
        )}
        
        <View className="border-t border-gray-200 pt-3 mt-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-bold text-gray-800">Amount</Text>
            <Text className="text-xl font-bold text-primary">₹{amount.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TransactionSummary;
