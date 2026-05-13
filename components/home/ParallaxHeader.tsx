// components/home/ParallaxHeader.jsx
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bell, Menu } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 50;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ParallaxHeader = ({ children }: { children: React.ReactNode }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.7, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.5, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.8, 0.6],
    extrapolate: 'clamp',
  });

  const titleTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });

  // Compact header parallax effects
  const compactHeaderTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [20, 0],
    extrapolate: 'clamp',
  });

  const compactTitleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.9, 0.8],
    extrapolate: 'clamp',
  });

  const compactTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.3, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1 bg-white">
      <Animated.View
        style={{
          height: headerHeight,
          backgroundColor: '#00B9F2',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          overflow: 'hidden',
        }}>
        <LinearGradient
          colors={['#F5F5F5', '#F5F5F5', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}>
          {/* Header Text - Centered and Bottom Aligned */}
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 20,
              left: 0,
              right: 0,
              alignItems: 'center',
              opacity: headerOpacity,
              transform: [{ translateY: titleTranslate }],
            }}>
            <Text className="text-sm text-black/80">Good Morning!</Text>
            <Text className="mt-1 text-2xl font-bold text-black">Rahul Sharma</Text>
            <Text className="mt-1 text-sm text-black/80">+91 98765 43210</Text>
          </Animated.View>

          {/* Compact Header View - Always Visible with Parallax */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: 50,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              opacity: 1,
              zIndex: 20,
              backgroundColor: '#F5F5F5',
              transform: [{ translateY: compactHeaderTranslate }],
            }}>
            <View className="flex-row items-center">
              <Animated.View
                style={{
                  transform: [{ scale: avatarScale }],
                }}>
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Avatar
                    alt="@mrzachnugent"
                    className="border-2 border-background web:border-0 web:ring-2 web:ring-background">
                    <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
                    <AvatarFallback>
                      <Text>ZN</Text>
                    </AvatarFallback>
                  </Avatar>
                </View>
              </Animated.View>
              <Animated.View
                style={{
                  marginLeft: 8,
                  opacity: compactTitleOpacity,
                  transform: [{ scale: compactTitleScale }],
                }}>
                <Text className="font-semibold text-black">Rahul Sharma</Text>
              </Animated.View>
            </View>
            <Animated.View
              style={{
                transform: [{ scale: avatarScale }],
              }}>
              <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full">
                <Bell strokeWidth={1} size={24} className="text-black/80" />
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          listener: (event) => {},
          useNativeDriver: false,
        })}
        contentContainerStyle={{
          paddingTop: HEADER_MAX_HEIGHT + 20,
          marginBottom: 100,
        }}>
        {children}
      </Animated.ScrollView>
    </View>
  );
};

export default ParallaxHeader;
