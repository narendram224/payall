import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, value, onChange, className }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>(new Array(length).fill(null));

  useEffect(() => {
    setOtp(value.split('').concat(new Array(length - value.length).fill('')));
  }, [value, length]);

  const handleChange = (index: number, text: string) => {
    if (text.length > 1) {
      text = text.charAt(text.length - 1);
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    const otpValue = newOtp.join('');
    onChange(otpValue);

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className={cn('flex-row justify-center gap-3')}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
            return ref;
          }}
          className="h-12 w-12 rounded-lg border-2 border-gray-300 bg-white text-center text-xl font-semibold"
          keyboardType="number-pad"
          maxLength={1}
          value={otp[index]}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

export default OTPInput;
