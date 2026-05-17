import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@/lib/utils';

interface Frequency {
  id: string;
  label: string;
  value: string;
  description: string;
}

interface FrequencySelectorProps {
  frequencies: Frequency[];
  selectedFrequency: Frequency | null;
  onSelectFrequency: (frequency: Frequency) => void;
  className?: string;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  frequencies,
  selectedFrequency,
  onSelectFrequency,
  className,
}) => {
  return (
    <View className={cn('w-full', className)}>
      <Text className="text-lg font-semibold mb-3 text-foreground">Select Frequency</Text>
      <View className="space-y-3">
        {frequencies.map((frequency) => (
          <Pressable
            key={frequency.id}
            onPress={() => onSelectFrequency(frequency)}
            className={cn(
              'flex-row items-center justify-between p-4 rounded-xl border-2',
              selectedFrequency?.id === frequency.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card'
            )}
          >
            <View className="flex-1">
              <Text
                className={cn(
                  'text-base font-semibold',
                  selectedFrequency?.id === frequency.id
                    ? 'text-primary'
                    : 'text-foreground'
                )}
              >
                {frequency.label}
              </Text>
              <Text className="text-sm text-muted-foreground mt-1">
                {frequency.description}
              </Text>
            </View>
            <View
              className={cn(
                'w-6 h-6 rounded-full border-2 items-center justify-center',
                selectedFrequency?.id === frequency.id
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              )}
            >
              {selectedFrequency?.id === frequency.id && (
                <View className="w-3 h-3 rounded-full bg-white" />
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default FrequencySelector;
