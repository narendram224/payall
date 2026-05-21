import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, ChevronDown, RefreshCw } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import UserService from '@/services/user/user.service';
import { UserInfo } from '@/services/user/user.dto';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import AnimatedReanimated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 260; // Lifted slightly to comfortably house the wave crests
const HEADER_MIN_HEIGHT = 64;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const WAVE_TRACK_WIDTH = SCREEN_WIDTH * 3;
const WAVE_HEIGHT = 120;

interface SingleWaveProps {
  duration: number;
  opacity: number;
  pathData: string;
  fillColor: string;
}

/**
 * Loop Wave Track Wrapper using Reanimated for independent performance
 */
function ParallaxWaveTrack({ duration, opacity, pathData, fillColor }: SingleWaveProps) {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    // Sliding in the opposite horizontal direction to differentiate it from other layouts
    translateX.value = withRepeat(
      withTiming(SCREEN_WIDTH, {
        duration: duration,
        easing: Easing.bezier(0.36, 0.07, 0.19, 0.97),
      }),
      -1,
      false
    );
  }, [duration, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <AnimatedReanimated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          bottom: -2,
          width: WAVE_TRACK_WIDTH,
          height: WAVE_HEIGHT + 10,
          opacity: opacity,
          left: -SCREEN_WIDTH, // Offsets initial coordinate map safely
        },
      ]}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${WAVE_TRACK_WIDTH} ${WAVE_HEIGHT + 10}`}
        preserveAspectRatio="none">
        <Path d={pathData} fill={fillColor} />
      </Svg>
    </AnimatedReanimated.View>
  );
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const ParallaxHeader = ({ children }: { children: React.ReactNode }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { logout } = useAuth();

  const { data: userInfo, refetch } = useQuery<UserInfo>({
    queryKey: ['userInfo'],
    queryFn: () => UserService.fetchUserInfo(),
    staleTime: 5 * 60 * 1000,
  });

  const greeting = useMemo(() => getGreeting(), []);

  const displayName = userInfo?.name ?? 'User';
  const displayMobile = userInfo?.mobile ?? '';
  const profilePic = userInfo?.image ?? userInfo?.profile?.profile_picture ?? '';
  const initials = displayName
    .split(' ')
    .map((w: string) => w.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // ── Vector Paths (Custom geometry tailored for long, shallow waves) ──
  const wavePath1 = useMemo(
    () => `
    M0,${WAVE_HEIGHT * 0.5} 
    C${SCREEN_WIDTH * 0.4},${WAVE_HEIGHT * 0.1} ${SCREEN_WIDTH * 0.7},${WAVE_HEIGHT * 0.8} ${SCREEN_WIDTH},${WAVE_HEIGHT * 0.5}
    C${SCREEN_WIDTH * 1.4},${WAVE_HEIGHT * 0.1} ${SCREEN_WIDTH * 1.7},${WAVE_HEIGHT * 0.8} ${SCREEN_WIDTH * 2},${WAVE_HEIGHT * 0.5}
    C${SCREEN_WIDTH * 2.4},${WAVE_HEIGHT * 0.1} ${SCREEN_WIDTH * 2.7},${WAVE_HEIGHT * 0.8} ${WAVE_TRACK_WIDTH},${WAVE_HEIGHT * 0.5}
    L${WAVE_TRACK_WIDTH},${WAVE_HEIGHT + 10} L0,${WAVE_HEIGHT + 10} Z
  `,
    []
  );

  const wavePath2 = useMemo(
    () => `
    M0,${WAVE_HEIGHT * 0.6} 
    C${SCREEN_WIDTH * 0.3},${WAVE_HEIGHT * 0.8} ${SCREEN_WIDTH * 0.6},${WAVE_HEIGHT * 0.2} ${SCREEN_WIDTH},${WAVE_HEIGHT * 0.6}
    C${SCREEN_WIDTH * 1.3},${WAVE_HEIGHT * 0.8} ${SCREEN_WIDTH * 1.6},${WAVE_HEIGHT * 0.2} ${SCREEN_WIDTH * 2},${WAVE_HEIGHT * 0.6}
    C${SCREEN_WIDTH * 2.3},${WAVE_HEIGHT * 0.8} ${SCREEN_WIDTH * 2.6},${WAVE_HEIGHT * 0.2} ${WAVE_TRACK_WIDTH},${WAVE_HEIGHT * 0.6}
    L${WAVE_TRACK_WIDTH},${WAVE_HEIGHT + 10} L0,${WAVE_HEIGHT + 10} Z
  `,
    []
  );

  // ── Parallax interpolators ──
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const expandedOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.6, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  });

  const expandedTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const compactOpacity = scrollY.interpolate({
    inputRange: [HEADER_SCROLL_DISTANCE * 0.4, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, [logout]);

  const handleRefresh = useCallback(
    (e: any) => {
      e?.preventDefault?.();
      refetch();
    },
    [refetch]
  );

  return (
    <View className="flex-1 bg-white">
      {/* ── Parallax hero ─────────────────────────────────────────────── */}
      <Animated.View
        style={{
          height: headerHeight,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          overflow: 'hidden',
          backgroundColor: '#006EB3',
        }}>
        <LinearGradient
          colors={['#2196f3', '#3f51b5', '#673ab7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Dynamic Water Wave Layer (Inverted colors to sit organically over gradient base) */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: WAVE_HEIGHT + 15,
            opacity: expandedOpacity, // Automatically fades into the background as you scroll down
            zIndex: 1,
          }}>
          {/* Back Wave Layer - Light Sky Blue */}
          <ParallaxWaveTrack
            duration={2000}
            opacity={0.25}
            pathData={wavePath1}
            fillColor="#40B9F2"
          />
          {/* Front Wave Layer - Deep Vibrant Blue */}
          <ParallaxWaveTrack
            duration={3000}
            opacity={0.45}
            pathData={wavePath2}
            fillColor="#0090C8"
          />
        </Animated.View>

        {/* Expanded content */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 32, // Positioned slightly higher so the wave rolls directly beneath the user profile
            left: 0,
            right: 0,
            alignItems: 'center',
            opacity: expandedOpacity,
            transform: [{ translateY: expandedTranslateY }],
            zIndex: 2,
          }}>
          <Animated.View style={{ transform: [{ scale: avatarScale }], marginBottom: 12 }}>
            <View className="items-center justify-center rounded-full border-4 border-white/40 shadow-lg shadow-black/10">
              <Avatar alt={displayName} className="h-20 w-20">
                <AvatarImage
                  source={
                    !profilePic.includes('no.jpg')
                      ? { uri: profilePic }
                      : { uri: 'https://github.com/mrzachnugent.png' }
                  }
                />
                <AvatarFallback>
                  <Text className="text-xl font-bold text-white">{initials}</Text>
                </AvatarFallback>
              </Avatar>
            </View>
          </Animated.View>

          <Text className="text-xs font-bold uppercase tracking-widest text-white/80">
            {greeting}
          </Text>
          <Text className="mt-0.5 text-2xl font-black tracking-tight text-white">
            {displayName}
          </Text>
          {!!displayMobile && (
            <Text className="mt-1 text-xs font-semibold text-cyan-100/70">+91 {displayMobile}</Text>
          )}
        </Animated.View>

        {/* ── Compact top bar ──────────────────────────────────────────── */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: HEADER_MIN_HEIGHT,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            opacity: compactOpacity,
            backgroundColor: '#3f51b5', // Solid base color matching the bottom gradient slice
            zIndex: 20,
          }}>
          <View className="flex-row items-center">
            <Avatar alt={displayName} className="h-9 w-9 border-2 border-white/40">
              <AvatarImage
                source={
                  !profilePic.includes('no.jpg')
                    ? { uri: profilePic }
                    : { uri: 'https://github.com/mrzachnugent.png' }
                }
              />
              <AvatarFallback>
                <Text className="text-xs font-bold text-white">{initials}</Text>
              </AvatarFallback>
            </Avatar>
            <View className="ml-2.5 flex-row items-center">
              <Text className="text-sm font-bold tracking-tight text-white">{displayName}</Text>
              <ChevronDown size={14} color="white" style={{ marginLeft: 2 }} />
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleRefresh}
              className="h-9 w-9 items-center justify-center rounded-full bg-white/10 active:bg-white/20">
              <RefreshCw size={16} color="white" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full bg-white/10 active:bg-white/20">
              <Bell size={16} color="white" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              className="rounded-xl bg-white/15 px-3 py-2 active:bg-white/25">
              <Text className="text-xs font-bold text-white">Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>

      {/* ── Scrollable content ────────────────────────────────────────── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        contentContainerStyle={{
          paddingTop: HEADER_MAX_HEIGHT + 20,
          paddingBottom: 120,
        }}>
        {children}
      </Animated.ScrollView>
    </View>
  );
};

export default ParallaxHeader;
