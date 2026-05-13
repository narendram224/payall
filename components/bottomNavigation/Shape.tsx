import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPath = Animated.createAnimatedComponent(Path);

const BAR_HEIGHT = 70;
const CURVE_WIDTH = 100; // Adjust for a wider/narrower dip
const CURVE_HEIGHT = 38; // Depth of the curve

export function Shape({ translateX }: { translateX: any }) {
  const { theme } = useTheme();
  const animatedProps = useAnimatedProps(() => {
    const x = translateX.value;

    // Path Logic:
    // 1. Move to (0,0) - Top Left
    // 2. Line to the start of the curve
    // 3. Curve down and back up (The "Dip")
    // 4. Line to top right, then bottom right, then bottom left, and close.
    const d = `
      M0,0
      L${x - CURVE_WIDTH / 2},0
      C${x - CURVE_WIDTH / 4},0 ${x - CURVE_WIDTH / 3},${CURVE_HEIGHT} ${x},${CURVE_HEIGHT}
      C${x + CURVE_WIDTH / 3},${CURVE_HEIGHT} ${x + CURVE_WIDTH / 4},0 ${x + CURVE_WIDTH / 2},0
      L${SCREEN_WIDTH},0
      L${SCREEN_WIDTH},${BAR_HEIGHT}
      L0,${BAR_HEIGHT}
      Z
    `;

    return {
      d,
      fill:
        theme.colors.background === '#f1f5f9' ? theme.colors.lightPrimary : theme.colors.primary,
    };
  });

  return (
    <Svg width={SCREEN_WIDTH} height={BAR_HEIGHT}>
      <AnimatedPath animatedProps={animatedProps} />
    </Svg>
  );
}
