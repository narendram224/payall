import React from 'react';
import { StyleSheet, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface Props {
  onBackClick: () => void;
  onSkipClick: () => void;
  animationController: React.RefObject<import('react-native-reanimated').SharedValue<number>>;
}

const TopBackSkipView: React.FC<Props> = ({ onBackClick, onSkipClick, animationController }) => {
  const { top } = useSafeAreaInsets();
  const marginTop = Platform.OS === 'ios' ? top : StatusBar.currentHeight;

  const containerStyle = useAnimatedStyle(() => {
    const progress = animationController.current.value;
    const translateY = interpolate(
      progress,
      [0, 0.2, 0.4, 0.6, 0.8],
      [-(58 + (marginTop ?? 0)), 0, 0, 0, 0]
    );
    return {
      marginTop,
      transform: [{ translateY }],
      display: progress < 0.1 ? 'none' : 'flex',
    };
  });

  const skipStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationController.current.value,
      [0, 0.2, 0.4, 0.6, 0.8],
      [0, 0, 0, 0, 80]
    );
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[styles.buttonContainer, containerStyle]}>
      <Button style={[styles.animatedButton]} variant="ghost" onPress={() => onBackClick()}>
        <ChevronLeft size={24} color="#132137" />
      </Button>

      <Animated.View style={skipStyle}>
        <Button
          variant="ghost"
          style={[styles.skipBtn, styles.animatedButton]}
          onPress={() => onSkipClick()}>
          <Text variant="small">Skip</Text>
        </Button>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  backBtn: {
    width: 60,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 33, 55, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  skipBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 0,
    borderColor: 'rgba(19, 33, 55, 0.3)',
  },
  animatedButton: {
    overflow: 'hidden',
  },
  skipText: {
    color: 'rgba(19, 33, 55, 0.8)',
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default TopBackSkipView;
