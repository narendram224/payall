import React from 'react';
import { TouchableOpacity, Text, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WAVE_H = 16;

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

function WaveBar() {
const progress = useSharedValue(0);
  
  React.useEffect(() => {
    progress.value = withSequence(
      withTiming(1, { duration: 500 }),
      withSpring(0, { damping: 14, stiffness: 140 })
    );
  }, []);

  const waveStyle = useAnimatedStyle(() => ({
    // 2. Changed from 0.85 to 1.0 so it spans the entire screen width
    width: progress.value * SCREEN_WIDTH * 1.0, 
    opacity: progress.value,
  }));

  return (
   <View style={{ height: WAVE_H, backgroundColor: 'transparent', overflow: 'hidden' }}>
      <Animated.View style={[waveStyle, { height: '100%' }]}>
        {/* 3. Updated viewBox height to match WAVE_H (16) */}
        <Svg width="100%" height="100%" viewBox={`0 0 400 ${WAVE_H}`} preserveAspectRatio="none">
          <Path
            {/* 4. Rescaled the Y-axis coordinates to utilize the new 16px height smoothly */}
            d="M0,8 C50,0 80,16 120,8 S200,0 240,8 S320,16 400,8 L400,16 L0,16 Z"
            fill="#6366f1"
          />
        </Svg>
      </Animated.View>
    </View>
  );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <Animated.View style={headerAnimatedStyle}>
      <WaveBar />

      <View
        style={{
          paddingTop: insets.top + 2,
          paddingBottom: 6,
          paddingHorizontal: 6,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            style={{ width: 44, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: 2 }}>
            <ArrowLeft size={22} color="#6366f1" strokeWidth={2.4} />
          </TouchableOpacity>

          <View style={{ flex: 1, marginHorizontal: 4 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#1e1b4b',
                letterSpacing: -0.4,
                lineHeight: 26,
              }}>
              {title}
            </Text>
            {subtitle ? (
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 11,
                  fontWeight: '500',
                  color: '#9ca3af',
                  marginTop: 1,
                  letterSpacing: 0.1,
                  textTransform: 'uppercase',
                }}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
