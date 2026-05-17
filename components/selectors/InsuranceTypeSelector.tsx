import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { cn } from '@/lib/utils';

interface InsuranceType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface InsuranceTypeSelectorProps {
  types: InsuranceType[];
  selectedType: InsuranceType | null;
  onSelectType: (type: InsuranceType) => void;
  className?: string;
}

const InsuranceTypeSelector: React.FC<InsuranceTypeSelectorProps> = ({
  types,
  selectedType,
  onSelectType,
  className,
}) => {
  return (
    <View className={cn('w-full', className)}>
      <Text className="text-lg font-semibold mb-3 text-foreground">Select Insurance Type</Text>
      <View className="grid grid-cols-2 gap-3">
        {types.map((type) => (
          <Pressable
            key={type.id}
            onPress={() => onSelectType(type)}
            className={cn(
              'flex-col items-center justify-center p-4 rounded-xl border-2',
              selectedType?.id === type.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card'
            )}
          >
            {type.icon ? (
              <Image
                source={{ uri: type.icon }}
                className="w-12 h-12 mb-2"
                resizeMode="contain"
              />
            ) : (
              <View className="w-12 h-12 bg-gray-200 rounded-full mb-2 items-center justify-center">
                <Text className="text-2xl">🛡️</Text>
              </View>
            )}
            <Text
              className={cn(
                'text-xs text-center font-semibold',
                selectedType?.id === type.id
                  ? 'text-primary'
                  : 'text-foreground'
              )}
              numberOfLines={2}
            >
              {type.name}
            </Text>
            <Text
              className={cn(
                'text-xs text-center text-muted-foreground mt-1',
                selectedType?.id === type.id
                  ? 'text-primary'
                  : ''
              )}
              numberOfLines={2}
            >
              {type.description}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default InsuranceTypeSelector;
