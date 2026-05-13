import React, { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedReaction,
  withTiming,
} from 'react-native-reanimated';
import NextButtonArrow from '../NextButtonArrow';
import { scheduleOnRN } from 'react-native-worklets';

interface Props {
  onNextClick: () => void;
  animationController: React.RefObject<SharedValue<number>>;
}

interface DotIndicatorProps {
  index: number;
  selectedIndex: number;
}
const DotIndicator: React.FC<DotIndicatorProps> = ({ index, selectedIndex }) => {
  const activeIndex = useSharedValue(0);

  useAnimatedReaction(
    () => selectedIndex,
    (newSelectedIndex) => {
      activeIndex.value = withTiming(index === newSelectedIndex ? 1 : 0, { duration: 480 });
    },
    [selectedIndex, index]
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(activeIndex.value, [0, 1], ['#d3e0f5', '#135467']),
    };
  });

  return <Animated.View style={[styles.pageIndicator, animatedStyle]} />;
};

const CenterNextButton: React.FC<Props> = ({ onNextClick, animationController }) => {
  const opacity = useSharedValue(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isClickable, setIsClickable] = useState(false);

  const { bottom } = useSafeAreaInsets();
  const paddingBottom = 16 + bottom;

  const dots = useMemo(() => [0, 1, 2, 3], []);

  useAnimatedReaction(
    () => animationController.current.value,
    (value) => {
      if (value >= 0.7) {
        scheduleOnRN(setSelectedIndex, 3);
      } else if (value >= 0.5) {
        scheduleOnRN(setSelectedIndex, 2);
      } else if (value >= 0.3) {
        scheduleOnRN(setSelectedIndex, 1);
      } else if (value >= 0.1) {
        scheduleOnRN(setSelectedIndex, 0);
      }
      scheduleOnRN(setIsClickable, value >= 0.1);
    },
    []
  );

  const topViewAnimStyle = useAnimatedStyle(() => {
    const progress = animationController.current.value;
    const translateY = interpolate(
      progress,
      [0, 0.2, 0.4, 0.6, 0.8],
      [96 * 5, 0, 0, 0, 0] // 96 is total height of next button view
    );
    return {
      transform: [{ translateY }],
    };
  });

  const loginTextMoveAnimationStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animationController.current.value,
      [0, 0.2, 0.4, 0.6, 0.8],
      [30 * 5, 30 * 5, 30 * 5, 30 * 5, 0] // 96 is total height of next button view
    );
    return {
      transform: [{ translateY }],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    const progress = animationController.current.value;
    const isVisible = progress >= 0.2;
    opacity.value = withTiming(isVisible ? 1 : 0, { duration: 480 });

    return {
      paddingBottom,
    };
  });

  const dotsContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[styles.container, containerStyle, topViewAnimStyle]}
      pointerEvents={isClickable ? 'box-none' : 'none'}>
      <Animated.View style={[styles.dotsContainer, dotsContainerStyle]}>
        {dots.map((item) => (
          <DotIndicator key={item} index={item} {...{ selectedIndex, animationController }} />
        ))}
      </Animated.View>

      <NextButtonArrow {...{ animationController }} onBtnPress={onNextClick} />

      <Animated.View style={[styles.footerTextContainer, loginTextMoveAnimationStyle]}>
        <Text style={{ color: 'grey', fontFamily: 'WorkSans-Regular' }}>
          Already have an account?{' '}
        </Text>
        <Text className="font-bold text-primary/80">Login</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  pageIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 4,
  },
  footerTextContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
});

export default CenterNextButton;
