import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { cn } from '@/lib/utils';

interface GiftCard {
  id: string;
  name: string;
  brand: string;
  icon: string;
  minAmount: number;
  maxAmount: number;
}

interface GiftCardSelectorProps {
  cards: GiftCard[];
  selectedCard: GiftCard | null;
  onSelectCard: (card: GiftCard) => void;
  className?: string;
}

const GiftCardSelector: React.FC<GiftCardSelectorProps> = ({
  cards,
  selectedCard,
  onSelectCard,
  className,
}) => {
  return (
    <View className={cn('w-full', className)}>
      <Text className="text-lg font-semibold mb-3 text-foreground">Select Gift Card</Text>
      <View className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <Pressable
            key={card.id}
            onPress={() => onSelectCard(card)}
            className={cn(
              'flex-col items-center justify-center p-4 rounded-xl border-2',
              selectedCard?.id === card.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card'
            )}
          >
            {card.icon ? (
              <Image
                source={{ uri: card.icon }}
                className="w-16 h-10 mb-2"
                resizeMode="contain"
              />
            ) : (
              <View className="w-16 h-10 bg-gray-200 rounded mb-2 items-center justify-center">
                <Text className="text-xl">🎁</Text>
              </View>
            )}
            <Text
              className={cn(
                'text-xs text-center font-semibold',
                selectedCard?.id === card.id
                  ? 'text-primary'
                  : 'text-foreground'
              )}
              numberOfLines={2}
            >
              {card.brand}
            </Text>
            <Text
              className={cn(
                'text-xs text-center text-muted-foreground mt-1',
                selectedCard?.id === card.id
                  ? 'text-primary'
                  : ''
              )}
            >
              ₹{card.minAmount} - ₹{card.maxAmount}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default GiftCardSelector;
