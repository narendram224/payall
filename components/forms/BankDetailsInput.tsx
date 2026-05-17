import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface BankDetailsInputProps {
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  ifscCode: string;
  setIfscCode: (value: string) => void;
  accountHolderName: string;
  setAccountHolderName: (value: string) => void;
  className?: string;
}

const BankDetailsInput: React.FC<BankDetailsInputProps> = ({
  accountNumber,
  setAccountNumber,
  ifscCode,
  setIfscCode,
  accountHolderName,
  setAccountHolderName,
  className,
}) => {
  const [errors, setErrors] = useState<{
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
  }>({});

  const validateAccountNumber = (value: string) => {
    if (value.length < 9) {
      setErrors((prev) => ({ ...prev, accountNumber: 'Account number must be at least 9 digits' }));
    } else {
      setErrors((prev) => ({ ...prev, accountNumber: undefined }));
    }
  };

  const validateIFSC = (value: string) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(value)) {
      setErrors((prev) => ({ ...prev, ifscCode: 'Invalid IFSC code' }));
    } else {
      setErrors((prev) => ({ ...prev, ifscCode: undefined }));
    }
  };

  const validateAccountHolderName = (value: string) => {
    if (value.length < 3) {
      setErrors((prev) => ({ ...prev, accountHolderName: 'Name must be at least 3 characters' }));
    } else {
      setErrors((prev) => ({ ...prev, accountHolderName: undefined }));
    }
  };

  return (
    <View className={cn('space-y-4', className)}>
      <View>
        <Text className="mb-2 text-sm font-medium text-gray-700">Account Number</Text>
        <Input
          placeholder="Enter account number"
          value={accountNumber}
          onChangeText={(text) => {
            setAccountNumber(text);
            validateAccountNumber(text);
          }}
          keyboardType="number-pad"
          className={errors.accountNumber ? 'border-red-500' : ''}
        />
        {errors.accountNumber && (
          <Text className="mt-1 text-xs text-red-500">{errors.accountNumber}</Text>
        )}
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium text-gray-700">IFSC Code</Text>
        <Input
          placeholder="Enter IFSC code (e.g., SBIN0001234)"
          value={ifscCode}
          onChangeText={(text) => {
            setIfscCode(text.toUpperCase());
            validateIFSC(text.toUpperCase());
          }}
          autoCapitalize="characters"
          className={errors.ifscCode ? 'border-red-500' : ''}
        />
        {errors.ifscCode && <Text className="mt-1 text-xs text-red-500">{errors.ifscCode}</Text>}
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium text-gray-700">Account Holder Name</Text>
        <Input
          placeholder="Enter account holder name"
          value={accountHolderName}
          onChangeText={(text) => {
            setAccountHolderName(text);
            validateAccountHolderName(text);
          }}
          className={errors.accountHolderName ? 'border-red-500' : ''}
        />
        {errors.accountHolderName && (
          <Text className="mt-1 text-xs text-red-500">{errors.accountHolderName}</Text>
        )}
      </View>
    </View>
  );
};

export default BankDetailsInput;
