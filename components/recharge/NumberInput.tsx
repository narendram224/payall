import React from 'react';
import { View, Text } from 'react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  placeholder: string;
  maxLength?: number;
  keyboardType?: 'numeric' | 'phone-pad';
  className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChangeText,
  label,
  placeholder,
  maxLength = 10,
  keyboardType = 'numeric',
  className,
}) => {
  return (
    <View className={cn('w-full', className)}>
      <Text className="text-lg font-semibold mb-3 text-foreground">{label}</Text>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        className="text-lg"
      />
    </View>
  );
};

export default NumberInput;
