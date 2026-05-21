import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';

interface BillerCardProps {
  billerID: string;
  billerName: string;
  icon?: string;
  index?: number;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BillerCard: React.FC<BillerCardProps> = ({ billerID, billerName, icon, index = 0, onPress }) => {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  const enteringAnim = reducedMotion
    ? undefined
    : FadeInDown.delay(index * 50).duration(300);

  return (
    <Animated.View entering={enteringAnim}>
      <AnimatedPressable
        style={animatedStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        className="mb-3 flex-row items-center rounded-2xl border border-border bg-card px-4 py-3.5 shadow-sm"
      >
        <View className="mr-3 h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-muted">
          {icon ? (
            <Image
              source={{ uri: icon }}
              style={{ width: 40, height: 40 }}
              contentFit="contain"
              transition={200}
            />
          ) : (
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Text className="text-sm font-bold text-primary">
                {billerName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">{billerName}</Text>
          <Text className="mt-0.5 text-xs text-muted-foreground">{billerID}</Text>
        </View>
        <ChevronRight size={18} color="#94a3b8" />
      </AnimatedPressable>
    </Animated.View>
  );
};

export default BillerCard;
