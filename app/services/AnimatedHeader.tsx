import React, { useMemo } from 'react';
import { TouchableOpacity, Text, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ShieldCheck } from 'lucide-react-native';
import { useNavigation, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearWaterWave from './recharge/WaveAnimation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Stable, large diameter bounding tracking box for fluid masks
const WAVE_BOX_SIZE = SCREEN_WIDTH * 2.2;

console.log('Wave box size:', WAVE_BOX_SIZE);

interface WaveLayerProps {
  duration: number;
  opacity: number;
  bottomOffset: number; // Anchor using bottom offset to prevent clipping issues
  initialRotation: number;
  scaleX: number;
  scaleY: number;
  colors: [string, string, ...string[]];
  radii: [number, number, number, number];
}

function RealWaveLayer({
  duration,
  opacity,
  bottomOffset,
  initialRotation,
  scaleX,
  scaleY,
  colors,
  radii,
}: WaveLayerProps) {
  const rotation = useSharedValue(initialRotation);

  React.useEffect(() => {
    console.log('Runss');

    rotation.value = withRepeat(
      withTiming(initialRotation + 360, {
        duration: duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [duration, initialRotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scaleX: scaleX }, { scaleY: scaleY }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          // Anchoring securely relative to the bottom boundary ensures waves never float up out of bounds
          bottom: -WAVE_BOX_SIZE + bottomOffset,
          left: -(WAVE_BOX_SIZE - SCREEN_WIDTH) / 2,
          width: WAVE_BOX_SIZE,
          height: WAVE_BOX_SIZE,
          borderTopLeftRadius: radii[0],
          borderTopRightRadius: radii[1],
          borderBottomLeftRadius: radii[2],
          borderBottomRightRadius: radii[3],
          opacity: opacity,
        },
      ]}>
      <LinearGradient
        colors={colors}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </Animated.View>
  );
}

function PremiumWaveContainer() {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%', // Caps the visual fluid window to the bottom 45% of the header
        overflow: 'hidden',
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        zIndex: 1,
      }}>
      {/* Background Deep Wave Layer */}
      {/* <RealWaveLayer
        duration={18000} // Super slow, fluid timeline
        opacity={0.15}
        bottomOffset={45} // Brings the wave crest line perfectly into view
        initialRotation={0}
        scaleX={1.45}
        scaleY={0.72} // Balanced vertical squish keeps the curve organic and visible
        radii={[
          WAVE_BOX_SIZE * 0.44,
          WAVE_BOX_SIZE * 0.43,
          WAVE_BOX_SIZE * 0.45,
          WAVE_BOX_SIZE * 0.44,
        ]}
        colors={['#4338ca', '#312e81']}
      /> */}

      {/* Middle Tidal Layer */}
      <RealWaveLayer
        duration={13000}
        opacity={0.25}
        bottomOffset={25}
        initialRotation={120}
        scaleX={1}
        scaleY={0.5}
        radii={[
          WAVE_BOX_SIZE * 0.2,
          WAVE_BOX_SIZE * 0.23,
          WAVE_BOX_SIZE * 0.25,
          WAVE_BOX_SIZE * 0.28,
        ]}
        colors={['#6366f1', '#4338ca']}
      />

      {/* Foreground Fluid Ripple Layer */}
      {/* <RealWaveLayer
        duration={9000}
        opacity={0.4}
        bottomOffset={15}
        initialRotation={240}
        scaleX={1.38}
        scaleY={0.78}
        radii={[
          WAVE_BOX_SIZE * 0.44,
          WAVE_BOX_SIZE * 0.45,
          WAVE_BOX_SIZE * 0.44,
          WAVE_BOX_SIZE * 0.43,
        ]}
        colors={['#818cf8', '#4338ca']}
      /> */}
    </View>
  );
}

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function AnimatedHeader({
  title,
  subtitle: externalSubtitle,
  showBack = true,
  onBack: externalOnBack,
}: AnimatedHeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const segments = useSegments();

  const offsetY = useSharedValue(-20);
  const headerOpacity = useSharedValue(0);

  React.useEffect(() => {
    headerOpacity.value = withSpring(1, { damping: 15, stiffness: 140 });
    offsetY.value = withSpring(0, { damping: 15, stiffness: 140 });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: offsetY.value }],
  }));

  const autoSubtitle = useMemo(() => {
    if (externalSubtitle) return externalSubtitle;
    const parentSegment = segments[0];
    if (parentSegment === 'recharge') return 'Instant Utility Recharge';
    if (parentSegment === 'billing') return 'Secured BBPS Gateway';
    if (parentSegment === 'finance') return 'Secure Financial Terminal';
    if (parentSegment === 'insurance') return 'Verified Policy Protection';
    return 'Secure Portal';
  }, [segments, externalSubtitle]);

  const handleBack = () => {
    if (externalOnBack) externalOnBack();
    else if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <Animated.View
      style={[
        headerAnimatedStyle,
        {
          backgroundColor: '#1e1b4b',
          overflow: 'hidden',
          position: 'relative',
          paddingTop: insets.top,
        },
      ]}>
      <LinearGradient
        colors={['#1e1b4b', '#2e2a72']}
        style={{ ...StyleSheet.absoluteFillObject, zIndex: 0 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Safe Context Content Container */}
      <View
        style={{
          paddingTop: 14,
          paddingBottom: 38, // Ensures text layers clear the rolling horizon lines cleanly
          paddingHorizontal: 16,
          zIndex: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {showBack && (
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.7}
              style={{
                width: 42,
                height: 42,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                borderRadius: 14,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}>
              <ChevronLeft size={24} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 22,
                fontWeight: '900',
                color: '#ffffff',
                letterSpacing: -0.5,
                lineHeight: 28,
              }}>
              {title}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 10,
                fontWeight: '800',
                color: '#a5b4fc',
                marginTop: 3,
                letterSpacing: 0.6,
                textTransform: 'uppercase',
              }}>
              {autoSubtitle}
            </Text>
          </View>
        </View>

        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 12,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 1,
            borderColor: 'rgba(16, 185, 129, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
          }}>
          <ShieldCheck size={18} color="#10b981" strokeWidth={2.5} />
        </View>
      </View>

      {/* <PremiumWaveContainer /> */}
      <LinearWaterWave />
    </Animated.View>
  );
}

const StyleSheet = {
  absoluteFillObject: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};
