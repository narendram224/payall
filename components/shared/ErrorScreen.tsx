import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred while processing your request. Please try again.',
  onRetry,
  showRetry = true,
  className,
}) => {
  return (
    <View className={cn('flex-1 items-center justify-center bg-gray-50 p-6', className)}>
      <View className="items-center">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <Text className="text-4xl">⚠️</Text>
        </View>

        <Text className="mb-2 text-center text-xl font-bold text-gray-800">{title}</Text>
        <Text className="mb-6 text-center text-base text-gray-600">{message}</Text>

        {showRetry && onRetry && (
          <Button onPress={onRetry} className="w-full">
            <Text className="font-semibold text-primary-foreground">Retry</Text>
          </Button>
        )}
      </View>
    </View>
  );
};

export default ErrorScreen;
