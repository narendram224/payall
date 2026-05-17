import React from 'react';
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
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WaveLayerProps {
  duration: number;
  opacity: number;
  top: string | number;
  initialRotation: number;
  scaleX: number;
  colors: [string, string, ...string[]];
}

function RealWaveLayer({ duration, opacity, top, initialRotation, scaleX, colors }: WaveLayerProps) {
  const rotation = useSharedValue(initialRotation);

  React.useEffect(() => {
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
    transform: [
      { rotate: `${rotation.value}deg` },
      { scaleX: scaleX }, // Stretching horizontally distorts the circle into a long rolling wave
    ],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          top: top,
          left: -SCREEN_WIDTH * 0.5, // Center the massive rotating block over the header viewport
          width: SCREEN_WIDTH * 2,
          height: SCREEN_WIDTH * 2,
          // Using slightly asymmetric corners breaks perfect symmetry and creates realistic fluid crests
          borderTopLeftRadius: '42%',
          borderTopRightRadius: '40%',
          borderBottomLeftRadius: '43%',
          borderBottomRightRadius: '41%',
          opacity: opacity,
        },
      ]}
    >
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
        height: '50%',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {/* Background Deep Wave */}
      <RealWaveLayer
        duration={14000}
        opacity={0.2}
        top="35%"
        initialRotation={0}
        scaleX={1.3}
        colors={['#818cf8', '#4f46e5']}
      />

      {/* Middle Wave - Moving at a different speed & offset angle to create organic interference patterns */}
      <RealWaveLayer
        duration={10000}
        opacity={0.35}
        top="42%"
        initialRotation={120}
        scaleX={1.1}
        colors={['#a5b4fc', '#6366f1']}
      />

      {/* Foreground Crisp Wave */}
      <RealWaveLayer
        duration={7000}
        opacity={0.55}
        top="50%"
        initialRotation={240}
        scaleX={1.4}
        colors={['#c7d2fe', '#6366f1']}
      />
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
  subtitle,
  showBack = true,
  onBack: externalOnBack,
}: AnimatedHeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const offsetY = useSharedValue(-24);
  const headerOpacity = useSharedValue(0);

  React.useEffect(() => {
    headerOpacity.value = withSpring(1, { damping: 14, stiffness: 150 });
    offsetY.value = withSpring(0, { damping: 14, stiffness: 150 });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: offsetY.value }],
  }));

  const handleBack = () => {
    if (externalOnBack) externalOnBack();
    else if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <Animated.View
      style={[
        headerAnimatedStyle,
        { backgroundColor: '#ffffff', overflow: 'hidden', position: 'relative' },
      ]}
    >
      {/* Safe Foreground Content Container */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingBottom: 24,
          paddingHorizontal: 16,
          zIndex: 2, // Forces all text layers directly on top of the liquid timeline
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {showBack && (
            <TouchableOpacity
              onPress={handleBack}
              activeOpacity={0.7}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 4,
                borderRadius: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // Adds background blur/backing so icon pops over water lines
              }}
            >
              <ArrowLeft size={22} color="#1e1b4b" strokeWidth={2.4} />
            </TouchableOpacity>
          )}

          <View style={{ flex: 1, marginHorizontal: 4 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 22,
                fontWeight: '800',
                color: 'white',
                letterSpacing: -0.5,
                lineHeight: 28,
                
              }}
              
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: '#4f46e5',
                  marginTop: 2,
                  letterSpacing: 0.3,
                  textTransform: 'uppercase',
                }}
                
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {/* Upgraded liquid horizon manager */}
      <PremiumWaveContainer />
    </Animated.View>
  );
}