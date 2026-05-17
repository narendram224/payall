import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Pressable, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import Animated, {
  useAnimatedStyle,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  className,
  autoFocus = false,
}: OTPInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [autoFocus]);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const cells = Array.from({ length }).map((_, index) => {
    const char = value[index];
    const isCurrentCell =
      index === value.length || (index === length - 1 && value.length === length);
    const isActive = isFocused && isCurrentCell;

    return (
      <View
        key={index}
        className={cn(
          'h-14 w-12 items-center justify-center rounded-xl border-2 bg-card',
          isActive ? 'border-primary shadow-sm' : char ? 'border-border' : 'border-border/50'
        )}>
        <Text className="text-2xl font-bold text-foreground">{char || ''}</Text>
      </View>
    );
  });

  return (
    <Pressable
      onPress={handlePress}
      className={cn('relative flex-row justify-center gap-3', className)}>
      {cells}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          if (text.length <= length && /^\d*$/.test(text)) {
            onChange(text);
          }
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={length}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="absolute h-full w-full opacity-0"
        caretHidden
        autoComplete="sms-otp"
      />
    </Pressable>
  );
}
