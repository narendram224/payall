import React from 'react';
import { View, ActivityIndicator, Text, Modal } from 'react-native';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Processing...',
  className,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View className={cn('flex-1 items-center justify-center bg-black/50', className)}>
        <View className="min-w-[200px] items-center rounded-2xl bg-white p-6">
          <ActivityIndicator size="large" color="#00B9F2" />
          <Text className="mt-4 text-base font-semibold text-gray-800">{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingOverlay;
