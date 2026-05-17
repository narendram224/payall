import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AadhaarInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const AadhaarInput: React.FC<AadhaarInputProps> = ({
  value,
  onChange,
  className,
}) => {
  const [error, setError] = useState<string>('');

  const formatAadhaar = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    // Limit to 12 digits
    const limited = cleaned.slice(0, 12);
    return limited;
  };

  const validateAadhaar = (text: string) => {
    if (text.length !== 12) {
      setError('Aadhaar number must be exactly 12 digits');
    } else if (!/^[2-9]/.test(text)) {
      setError('Aadhaar number must start with 2-9');
    } else {
      setError('');
    }
  };

  const handleChange = (text: string) => {
    const formatted = formatAadhaar(text);
    onChange(formatted);
    validateAadhaar(formatted);
  };

  // Format for display: XXXX XXXX XXXX
  const displayValue = value
    .replace(/\D/g, '')
    .replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');

  return (
    <View className={cn('space-y-2', className)}>
      <Text className="text-sm font-medium text-gray-700">Aadhaar Number</Text>
      <Input
        placeholder="Enter 12-digit Aadhaar number"
        value={displayValue}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={14} // 12 digits + 2 spaces
        className={error ? 'border-red-500' : ''}
      />
      {error && <Text className="text-xs text-red-500">{error}</Text>}
    </View>
  );
};

export default AadhaarInput;
