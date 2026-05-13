import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import Animated, { useAnimatedStyle, interpolate, SharedValue } from 'react-native-reanimated';

interface Props {
  onBtnPress: () => void;
  animationController: React.RefObject<SharedValue<number>>;
}

/*
 * TODO:- find better solution for this animation so we don't have to use 'useNativeDriver: false' in 'IntroductionAnimationScreen.tsx' as width doesn't support it yet
 */
const NextButtonArrow: React.FC<Props> = ({ onBtnPress, animationController }) => {
  const animatedContainerStyle = useAnimatedStyle(() => {
    const progress = animationController.current?.value ?? 0;

    const opacity = interpolate(
      progress,
      [0, 0.2, 0.4, 0.6, 0.8],
      [0, 1, 1, 1, 1] // Visible only between these points
    );

    return {
      width: interpolate(progress, [0, 1], [58, 258]),
      borderRadius: interpolate(progress, [0, 1], [40, 8]),
      marginBottom: interpolate(progress, [0, 1], [38, 0]),
      opacity,
      // Removed display: none as it can interfere with Pressable layout
      zIndex: progress > 0.1 && progress < 0.85 ? 100 : -1,
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animationController.current.value,
        [0, 0.2, 0.4, 0.6, 0.8],
        [0, 1, 1, 1, 1]
      ),
    };
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.touchable, { opacity: pressed ? 0.6 : 1 }]}
      onPress={() => {
        const progress = animationController.current?.value ?? 0;
        if (progress >= 0.1 && progress <= 0.85) {
          onBtnPress();
        }
      }}>
      <Animated.View style={[styles.container, animatedContainerStyle]} pointerEvents="box-none">
        <Animated.View className="flex flex-row items-center gap-4">
          {animationController.current.value > 0.7 && (
            <Text className="text-xl font-semibold text-white">Get Started</Text>
          )}
          <Animated.View style={[animatedIconStyle]}>
            <ArrowRight color="white" />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 58,
    backgroundColor: 'rgb(21, 32, 54)',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    color: 'white',
  },
  signupText: {
    fontSize: 18,
    fontFamily: 'WorkSans-Medium',
    color: 'white',
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NextButtonArrow;
