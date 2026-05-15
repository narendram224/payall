import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  duration?: number;
}

export function BottomSheet({ isOpen, onClose, children, duration = 300 }: BottomSheetProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      translateY.value = withTiming(0, { duration });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration }, (finished) => {
        if (finished) {
          runOnJS(setIsRendered)(false);
        }
      });
    }
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen ? 0.5 : 0, { duration }),
  }));

  if (!isRendered) return null;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 50, elevation: 50 }]} pointerEvents="box-none">
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'black' }, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      
      <Animated.View style={[styles.sheet, animatedStyle]} pointerEvents="box-none">
        <View className="bg-white rounded-t-3xl pt-3 pb-8 px-4 mt-auto shadow-2xl">
           <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
           {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  }
});
