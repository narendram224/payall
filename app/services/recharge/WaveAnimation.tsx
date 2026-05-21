import React, { useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// We extend the track to 3x screen width to allow complex, slow Bezier paths to cycle seamlessly
const WAVE_TRACK_WIDTH = SCREEN_WIDTH * 3;
const WAVE_HEIGHT = 80; // Your preferred height matching your UI

interface SingleWaveProps {
  duration: number;
  opacity: number;
  pathData: string;
  fillColor: string;
}

/**
 * High-performance horizontal sliding layer
 */
function WaveTrackLayer({ duration, opacity, pathData, fillColor }: SingleWaveProps) {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    // Sliding precisely by one full screen width creates an infinite, unnoticeable seam reset
    translateX.value = withRepeat(
      withTiming(-SCREEN_WIDTH, {
        duration: duration,
        easing: Easing.bezier(0.42, 0, 0.58, 1), // Custom ease-in-out smooths out linear velocity speed jumps
      }),
      -1,
      false
    );
  }, [duration, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          bottom: -5, // Slight bleed to ensure zero layout pixel gaps at the base
          width: WAVE_TRACK_WIDTH,
          height: WAVE_HEIGHT + 20,
          opacity: opacity,
        },
      ]}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${WAVE_TRACK_WIDTH} ${WAVE_HEIGHT + 20}`}
        preserveAspectRatio="none">
        <Path d={pathData} fill={fillColor} />
      </Svg>
    </Animated.View>
  );
}

export default function LinearWaterWave() {
  // Cubic Bezier paths engineered with staggered peaks to simulate deep ocean swells
  const wavePathLayer1 = useMemo(
    () => `
    M0,${WAVE_HEIGHT * 0.5} 
    C${SCREEN_WIDTH * 0.3},${WAVE_HEIGHT * 0.1} ${SCREEN_WIDTH * 0.5},${WAVE_HEIGHT * 0.9} ${SCREEN_WIDTH},${WAVE_HEIGHT * 0.5}
    C${SCREEN_WIDTH * 1.3},${WAVE_HEIGHT * 0.1} ${SCREEN_WIDTH * 1.5},${WAVE_HEIGHT * 0.9} ${SCREEN_WIDTH * 2},${WAVE_HEIGHT * 0.5}
    C${SCREEN_WIDTH * 2.3},${WAVE_HEIGHT * 0.1} ${SCREEN_WIDTH * 2.5},${WAVE_HEIGHT * 0.9} ${WAVE_TRACK_WIDTH},${WAVE_HEIGHT * 0.5}
    L${WAVE_TRACK_WIDTH},${WAVE_HEIGHT + 20} L0,${WAVE_HEIGHT + 20} Z
  `,
    []
  );

  const wavePathLayer2 = useMemo(
    () => `
    M0,${WAVE_HEIGHT * 0.6} 
    C${SCREEN_WIDTH * 0.4},${WAVE_HEIGHT * 0.9} ${SCREEN_WIDTH * 0.7},${WAVE_HEIGHT * 0.2} ${SCREEN_WIDTH},${WAVE_HEIGHT * 0.6}
    C${SCREEN_WIDTH * 1.4},${WAVE_HEIGHT * 0.9} ${SCREEN_WIDTH * 1.7},${WAVE_HEIGHT * 0.2} ${SCREEN_WIDTH * 2},${WAVE_HEIGHT * 0.6}
    C${SCREEN_WIDTH * 2.4},${WAVE_HEIGHT * 0.9} ${SCREEN_WIDTH * 2.7},${WAVE_HEIGHT * 0.2} ${WAVE_TRACK_WIDTH},${WAVE_HEIGHT * 0.6}
    L${WAVE_TRACK_WIDTH},${WAVE_HEIGHT + 20} L0,${WAVE_HEIGHT + 20} Z
  `,
    []
  );

  const wavePathLayer3 = useMemo(
    () => `
    M0,${WAVE_HEIGHT * 0.4} 
    C${SCREEN_WIDTH * 0.25},${WAVE_HEIGHT * 0.7} ${SCREEN_WIDTH * 0.6},${WAVE_HEIGHT * 0.1} ${SCREEN_WIDTH},${WAVE_HEIGHT * 0.4}
    C${SCREEN_WIDTH * 1.25},${WAVE_HEIGHT * 0.7} ${SCREEN_WIDTH * 1.6},${WAVE_HEIGHT * 0.1} ${SCREEN_WIDTH * 2},${WAVE_HEIGHT * 0.4}
    C${SCREEN_WIDTH * 2.25},${WAVE_HEIGHT * 0.7} ${SCREEN_WIDTH * 2.6},${WAVE_HEIGHT * 0.1} ${WAVE_TRACK_WIDTH},${WAVE_HEIGHT * 0.4}
    L${WAVE_TRACK_WIDTH},${WAVE_HEIGHT + 20} L0,${WAVE_HEIGHT + 20} Z
  `,
    []
  );

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: WAVE_HEIGHT + 40,
        overflow: 'hidden',
      }}>
      {/* 1. Base Anchor Mask (Ensures solid deep contrast under the wave valleys) */}
      <LinearGradient
        colors={['rgba(30, 27, 75, 0)', 'rgba(67, 56, 202, 0.4)', 'rgba(30, 27, 75, 1)']}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', zIndex: 0 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* 2. Deep Background Wave - Ultra Slow (14 seconds) */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: WAVE_HEIGHT + 20,
          zIndex: 1,
        }}>
        <WaveTrackLayer
          duration={2000}
          opacity={0.2}
          pathData={wavePathLayer1}
          fillColor="#00bcd4"
        />
      </View>

      {/* 3. Middle Ambient Wave - Balanced (9.5 seconds) */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: WAVE_HEIGHT + 20,
          zIndex: 2,
        }}>
        <WaveTrackLayer
          duration={2500}
          opacity={0.35}
          pathData={wavePathLayer2}
          fillColor="#673ab7"
        />
      </View>

      {/* 4. Foreground Sharp Ripple Wave - Active (6.2 seconds) */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: WAVE_HEIGHT + 20,
          zIndex: 3,
        }}>
        <WaveTrackLayer
          duration={1500}
          opacity={0.2}
          pathData={wavePathLayer3}
          fillColor="#3f51b5"
        />
      </View>
    </View>
  );
}
