import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { cn } from '@/lib/utils';

interface Circle {
  id: string;
  name: string;
  code: string;
}

interface CircleSelectorProps {
  circles: Circle[];
  selectedCircle: Circle | null;
  onSelectCircle: (circle: Circle) => void;
  className?: string;
}

const CircleSelector: React.FC<CircleSelectorProps> = ({
  circles,
  selectedCircle,
  onSelectCircle,
  className,
}) => {
  return (
    <View className={cn('w-full', className)}>
      <Text className="mb-3 text-lg font-semibold text-foreground">Select Circle</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3">
        {circles.map((circle) => (
          <Pressable
            key={circle.id}
            onPress={() => onSelectCircle(circle)}
            className={cn(
              'min-w-[100px] flex-col items-center justify-center rounded-xl border-2 p-3',
              selectedCircle?.id === circle.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card'
            )}>
            <Text
              className={cn(
                'text-center text-xs',
                selectedCircle?.id === circle.id ? 'font-semibold text-primary' : 'text-foreground'
              )}
              numberOfLines={2}>
              {circle.name}
            </Text>
            <Text
              className={cn(
                'text-center text-xs text-muted-foreground',
                selectedCircle?.id === circle.id ? 'text-primary' : ''
              )}>
              {circle.code}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default CircleSelector;
