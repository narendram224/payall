import React from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { cn } from '@/lib/utils';
import { Provider } from '@/services/recharge/recharge.dto';

interface OperatorSelectorProps {
  operators: Provider[];
  selectedOperator: Provider | null;
  onSelectOperator: (operator: Provider) => void;
  className?: string;
}

const OperatorSelector: React.FC<OperatorSelectorProps> = ({
  operators,
  selectedOperator,
  onSelectOperator,
  className,
}) => {
  return (
    <View className={cn('w-full', className)}>
      <Text className="mb-3 text-lg font-semibold text-foreground">Select Operator</Text>
      {operators.length === 0 ? (
        <View className="items-center justify-center py-8">
          <ActivityIndicator size="small" />
          <Text className="mt-2 text-muted-foreground">Loading operators...</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-3">
          {operators.map((operator) => (
            <Pressable
              key={operator.id}
              onPress={() => onSelectOperator(operator)}
              className={cn(
                'min-w-[80px] flex-col items-center justify-center rounded-xl border-2 p-3',
                selectedOperator?.id === operator.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card'
              )}>
              <Image
                source={{ uri: operator.icon }}
                className="mb-2 h-12 w-12 rounded-full"
                resizeMode="cover"
                defaultSource={require('@/assets/icons/recharge/mobile.png')}
              />
              <Text
                className={cn(
                  'text-center text-xs',
                  selectedOperator?.id === operator.id
                    ? 'font-semibold text-primary'
                    : 'text-foreground'
                )}
                numberOfLines={2}>
                {operator.provider_name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default OperatorSelector;
