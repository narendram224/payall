import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface PaymentSummaryProps {
  serviceName: string;
  billerName: string;
  consumerNumber: string;
  amount: number;
  convenienceFee?: number;
  totalAmount?: number;
  className?: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  serviceName,
  billerName,
  consumerNumber,
  amount,
  convenienceFee = 0,
  totalAmount,
  className,
}) => {
  const finalTotal = totalAmount || amount + convenienceFee;

  return (
    <View className={cn('bg-white rounded-2xl p-4 shadow-sm', className)}>
      <Text className="text-lg font-bold text-gray-800 mb-4">Payment Summary</Text>
      
      <View className="space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Service</Text>
          <Text className="text-sm font-semibold text-gray-800">{serviceName}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Biller</Text>
          <Text className="text-sm font-semibold text-gray-800">{billerName}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Consumer Number</Text>
          <Text className="text-sm font-semibold text-gray-800">{consumerNumber}</Text>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Bill Amount</Text>
          <Text className="text-sm font-semibold text-gray-800">₹{amount.toFixed(2)}</Text>
        </View>
        
        {convenienceFee > 0 && (
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">Convenience Fee</Text>
            <Text className="text-sm font-semibold text-gray-800">₹{convenienceFee.toFixed(2)}</Text>
          </View>
        )}
        
        <View className="border-t border-gray-200 pt-3 mt-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-bold text-gray-800">Total Amount</Text>
            <Text className="text-xl font-bold text-primary">₹{finalTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PaymentSummary;
