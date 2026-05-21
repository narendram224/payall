import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated';
import { Home, Flame, QrCode, History, Settings, Wallet, Check, QrCodeIcon } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { Shape } from './Shape';
import { themeConfig } from '@/lib/theme';

interface TabItem {
  key: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  label: string;
}

const TABS: TabItem[] = [
  { key: 'home', icon: Flame, label: 'Home' },
  { key: 'index', icon: Home, label: 'Index' },
  { key: 'history', icon: History, label: 'History' },
  { key: 'qr', icon: QrCodeIcon, label: 'QR' },
  { key: 'settings', icon: Settings, label: 'Settings' },
  { key: 'wallet', icon: Wallet, label: 'Wallet' },
];

interface BottomNavigationProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function BottomNavigation({ state, descriptors, navigation }: BottomNavigationProps) {
  const { width: screenWidth } = Dimensions.get('window');
  const INDICATOR_RADIUS = 30;

  const { theme } = useTheme();

  // Track the center of the active tab
  const visibleRoutes = state.routes.filter((route: any) => TABS.some(t => t.key === route.name));
  const visibleIndex = visibleRoutes.findIndex((r: any) => r.key === state.routes[state.index]?.key);
  const TAB_WIDTH = screenWidth / (visibleRoutes.length || 1);


  const translateX = useDerivedValue(() => {
    const idx = visibleIndex >= 0 ? visibleIndex : 0;
    return withSpring(idx * TAB_WIDTH + TAB_WIDTH / 2, {
      damping: 15,
      stiffness: 100,
    });
  });

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value - INDICATOR_RADIUS },
      // This translateY positions the circle inside the "dip"
      { translateY: -28 },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* 1. The SVG Background with the moving hole */}
      <View style={StyleSheet.absoluteFill}>
        <Shape translateX={translateX} />
      </View>

      {/* 2. The Animated Yellow Circle that follows the hole */}
      <Animated.View style={[styles.indicator, indicatorStyle]}>
        <View style={styles.circle}>
          {/* Render active icon inside the circle */}
          {visibleIndex >= 0 && React.createElement(TABS.find(t => t.key === visibleRoutes[visibleIndex]?.name)?.icon || Home, {
            size: 22,
            color: 'white',
          })}
        </View>
      </Animated.View>

      {/* 3. The Tab Buttons */}
      <View style={styles.tabsContainer}>
        {visibleRoutes.map((route: any, index: number) => {
          const isFocused = visibleIndex === index;
          const tabItem = TABS.find(t => t.key === route.name);
          if (!tabItem) return null;
          const Icon = tabItem.icon;

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={1}>
              {/* Only show icon if NOT focused (since active icon is in the circle) */}
              {!isFocused && <Icon size={22} color="white" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: 'transparent',
  },
  indicator: {
    position: 'absolute',
    width: 60,
    height: 60,
    zIndex: 10,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: themeConfig.light.colors.primary,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 70,
    zIndex: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
