import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Easing,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
  SplashView,
  RelaxView,
  CareView,
  MoodDiaryView,
  WelcomeView,
  TopBackSkipView,
  CenterNextButton,
} from './scenes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

const IntroductionAnimationScreen: React.FC = () => {
  const router = useRouter();
  const window = useWindowDimensions();

  const [currentPage, setCurrentPage] = useState(0);

  const animationController = useRef(useSharedValue(0));
  const animValue = useRef<number>(0);

  useAnimatedReaction(
    () => animationController.current.value,
    (value) => {
      animValue.current = value;
      scheduleOnRN(setCurrentPage, Math.floor(value));
    },
    []
  );

  const relaxTranslateYStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animationController.current.value,
      [0, 0.2, 0.4, 0.6, 0.8],
      [window.height, 0, 0, 0, 0]
    );
    return {
      transform: [{ translateY }],
    };
  });

  const playAnimation = useCallback((toValue: number, duration: number = 1600) => {
    animationController.current.value = withTiming(toValue, {
      duration,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
    });
  }, []);

  const onNextClick = useCallback(() => {
    let toValue;
    const currentVal = animationController.current.value;

    console.log('Current animation value:', currentVal);

    if (currentVal >= 0 && currentVal < 0.2) {
      toValue = 0.2;
    } else if (currentVal >= 0.2 && currentVal < 0.4) {
      toValue = 0.4;
    } else if (currentVal >= 0.4 && currentVal < 0.6) {
      toValue = 0.6;
    } else if (currentVal >= 0.6 && currentVal < 0.8) {
      toValue = 0.8;
    } else if (currentVal >= 0.8) {
      router.navigate('sign-in');
    }

    console.log('Target animation value:', toValue);
    toValue !== undefined && playAnimation(toValue);
  }, [playAnimation, router]);

  const onBackClick = useCallback(() => {
    let toValue;
    const currentVal = animationController.current.value;

    if (currentVal >= 0.2 && currentVal < 0.4) {
      toValue = 0.0;
    } else if (currentVal >= 0.4 && currentVal < 0.6) {
      toValue = 0.2;
    } else if (currentVal >= 0.6 && currentVal < 0.8) {
      toValue = 0.4;
    } else if (currentVal >= 0.8) {
      toValue = 0.6;
    }

    toValue !== undefined && playAnimation(toValue);
  }, [playAnimation]);

  const onSkipClick = useCallback(() => {
    playAnimation(0.8, 1200);
  }, [playAnimation]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'rgb(245, 235, 226)' }}>
        <StatusBar barStyle={`${currentPage > 0 ? 'dark' : 'light'}-content`} />
        <SplashView {...{ onNextClick, animationController }} />

        <Animated.View
          style={[styles.scenesContainer, relaxTranslateYStyle]}
          pointerEvents={currentPage > 0 ? 'auto' : 'none'}>
          <RelaxView {...{ animationController }} />

          <CareView {...{ animationController }} />

          <MoodDiaryView {...{ animationController }} />

          <WelcomeView {...{ animationController }} />
        </Animated.View>

        <TopBackSkipView {...{ onBackClick, onSkipClick, animationController }} />

        <CenterNextButton {...{ onNextClick, animationController }} />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scenesContainer: {
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
});

export default IntroductionAnimationScreen;
