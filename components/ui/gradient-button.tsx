import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './text';
import { ActivityIndicator, Pressable } from 'react-native';
import { cn } from '@/lib/utils';

export interface GradientButtonProps extends React.ComponentProps<typeof Pressable> {
  text: string;
  colors?: readonly [string, string, ...string[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  gradientClassName?: string;
  textClassName?: string;
  loading?: boolean;
}

const GradientButton = React.forwardRef<React.ElementRef<typeof Pressable>, GradientButtonProps>(
  (
    {
      text,
      colors = ['#210CAE', '#4DC9E6'],
      start = { x: 0.15, y: 0.15 },
      end = { x: 0.85, y: 0.85 },
      className,
      gradientClassName,
      textClassName,
      disabled,
      loading = false,
      ...props
    },
    ref
  ) => {
    return (
      <Pressable
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'overflow-hidden rounded-xl',
          (disabled || loading) && 'opacity-50',
          className
        )}
        {...props}>
        <LinearGradient
          colors={colors}
          start={start}
          end={end}
          className={cn('items-center justify-center p-4', gradientClassName)}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text variant="white" className={textClassName}>
              {text}
            </Text>
          )}
        </LinearGradient>
      </Pressable>
    );
  }
);

GradientButton.displayName = 'GradientButton';

export { GradientButton };
