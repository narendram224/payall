import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface UPIInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const UPIInput: React.FC<UPIInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter UPI ID (e.g., name@upi)',
  className,
}) => {
  const [error, setError] = useState<string>('');

  const validateUPI = (text: string) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!text) {
      setError('UPI ID is required');
    } else if (!upiRegex.test(text)) {
      setError('Invalid UPI ID format (e.g., name@upi)');
    } else {
      setError('');
    }
  };

  const handleChange = (text: string) => {
    onChange(text.toLowerCase());
    validateUPI(text.toLowerCase());
  };

  return (
    <View className={cn('space-y-2', className)}>
      <Text className="text-sm font-medium text-gray-700">UPI ID</Text>
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={handleChange}
        autoCapitalize="none"
        keyboardType="email-address"
        className={error ? 'border-red-500' : ''}
      />
      {error && <Text className="text-xs text-red-500">{error}</Text>}
    </View>
  );
};

export default UPIInput;
