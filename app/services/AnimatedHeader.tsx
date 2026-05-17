import React from 'react';
import { TouchableOpacity, Platform, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from 'expo-router';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const HEADER_HEIGHT = Platform.OS === 'ios' ? 96 : 78;

export default function AnimatedHeader({
  title,
  subtitle,
  showBack = true,
  onBack: externalOnBack,
}: AnimatedHeaderProps) {
  const navigation = useNavigation();
  const opacity = useSharedValue(0);
  const targetY = (Platform.OS === 'ios' ? -8 : -4) - HEADER_HEIGHT + 16;

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 320 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    if (externalOnBack) {
      externalOnBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const headerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: targetY * (1 - opacity.value) }],
  }));

  return (
    <Animated.View style={headerStyle}>
      {/* Top decorative bar */}
      <Animated.View
        style={{
          height: 3,
          backgroundColor: '#6366f1',
          opacity: 0.7,
          borderRadius: 3,
          marginHorizontal: 20,
          marginBottom: 6,
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 6,
          paddingTop: 8,
          paddingBottom: 4,
        }}>
        {/* Back button */}
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          style={{
            width: 40,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 4,
          }}>
          <ArrowLeft size={23} color="#6366f1" strokeWidth={2.2} />
        </TouchableOpacity>

        {/* Title + Subtitle */}
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#1e1b4b',
              letterSpacing: -0.4,
              lineHeight: 28,
            }}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12.5,
                fontWeight: '500',
                color: '#9ca3af',
                marginTop: 1,
                letterSpacing: 0.15,
                textTransform: 'uppercase',
              }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}
